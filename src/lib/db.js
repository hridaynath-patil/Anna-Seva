import { DatabaseSync } from 'node:sqlite';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const DB_DIR = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const DB_PATH = path.join(DB_DIR, 'food_seva.db');
const db = new DatabaseSync(DB_PATH);

// Configure pragmas for concurrent reliability
db.exec('PRAGMA busy_timeout = 10000;');
db.exec('PRAGMA journal_mode = WAL;');

// Helper to hash passwords
export function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Initialize tables and seed data
export function initDB() {
  // Enable foreign keys
  db.exec('PRAGMA foreign_keys = ON;');

  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS states (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS cities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      state_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      FOREIGN KEY(state_id) REFERENCES states(id) ON DELETE CASCADE
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('donor', 'admin')),
      mobile TEXT,
      address TEXT,
      state_id INTEGER,
      city_id INTEGER,
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      FOREIGN KEY(state_id) REFERENCES states(id) ON DELETE SET NULL,
      FOREIGN KEY(city_id) REFERENCES cities(id) ON DELETE SET NULL
    );
  `);

  // Migrate existing users table to add status column if it doesn't exist
  try {
    db.exec("ALTER TABLE users ADD COLUMN status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected'));");
  } catch (e) {
    // Column already exists
  }
  // Ensure existing admin is approved
  try {
    db.exec("UPDATE users SET status = 'approved' WHERE role = 'admin';");
  } catch (e) {}

  db.exec(`
    CREATE TABLE IF NOT EXISTS food_listings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      donor_id INTEGER NOT NULL,
      contact_person TEXT NOT NULL,
      mobile TEXT NOT NULL,
      food_items TEXT NOT NULL,
      description TEXT,
      address TEXT NOT NULL,
      state_id INTEGER NOT NULL,
      city_id INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'available' CHECK(status IN ('available', 'claimed', 'expired', 'approved')),
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      FOREIGN KEY(donor_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY(state_id) REFERENCES states(id) ON DELETE CASCADE,
      FOREIGN KEY(city_id) REFERENCES cities(id) ON DELETE CASCADE
    );
  `);

  // Migrate food_listings table check constraint dynamically if needed
  try {
    const schemaRow = db.prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name='food_listings'").get();
    if (schemaRow && !schemaRow.sql.includes('approved')) {
      db.exec("PRAGMA foreign_keys = OFF;");
      db.exec(`
        BEGIN TRANSACTION;
        DROP TABLE IF EXISTS _food_listings_old;
        ALTER TABLE food_listings RENAME TO _food_listings_old;
        
        CREATE TABLE food_listings (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          donor_id INTEGER NOT NULL,
          contact_person TEXT NOT NULL,
          mobile TEXT NOT NULL,
          food_items TEXT NOT NULL,
          description TEXT,
          address TEXT NOT NULL,
          state_id INTEGER NOT NULL,
          city_id INTEGER NOT NULL,
          status TEXT NOT NULL DEFAULT 'available' CHECK(status IN ('available', 'claimed', 'expired', 'approved')),
          created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
          FOREIGN KEY(donor_id) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY(state_id) REFERENCES states(id) ON DELETE CASCADE,
          FOREIGN KEY(city_id) REFERENCES cities(id) ON DELETE CASCADE
        );
        
        INSERT INTO food_listings (id, donor_id, contact_person, mobile, food_items, description, address, state_id, city_id, status, created_at)
        SELECT id, donor_id, contact_person, mobile, food_items, description, address, state_id, city_id, status, created_at
        FROM _food_listings_old;
        
        DROP TABLE IF EXISTS _food_listings_old;
        COMMIT;
      `);
      db.exec("PRAGMA foreign_keys = ON;");
      console.log("food_listings table check constraint successfully migrated to support 'approved'.");
    }
  } catch (e) {
    console.error("Failed to migrate food_listings constraint:", e.message);
    try { db.exec("ROLLBACK;"); } catch(err) {}
    try { db.exec("PRAGMA foreign_keys = ON;"); } catch(err) {}
  }

  db.exec(`
    CREATE TABLE IF NOT EXISTS requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      listing_id INTEGER NOT NULL,
      requester_name TEXT NOT NULL,
      requester_mobile TEXT NOT NULL,
      address TEXT NOT NULL,
      state_id INTEGER NOT NULL,
      city_id INTEGER NOT NULL,
      reason TEXT NOT NULL,
      quantity TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new', 'approved', 'rejected', 'completed')),
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      FOREIGN KEY(listing_id) REFERENCES food_listings(id) ON DELETE CASCADE,
      FOREIGN KEY(state_id) REFERENCES states(id) ON DELETE CASCADE,
      FOREIGN KEY(city_id) REFERENCES cities(id) ON DELETE CASCADE
    );
  `);

  // Migrate requests table if it references the old dropped table
  try {
    const requestsSchema = db.prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name='requests'").get();
    if (requestsSchema && requestsSchema.sql.includes('_food_listings_old')) {
      db.exec("PRAGMA foreign_keys = OFF;");
      db.exec(`
        BEGIN TRANSACTION;
        DROP TABLE IF EXISTS _requests_old;
        ALTER TABLE requests RENAME TO _requests_old;
        
        CREATE TABLE requests (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          listing_id INTEGER NOT NULL,
          requester_name TEXT NOT NULL,
          requester_mobile TEXT NOT NULL,
          address TEXT NOT NULL,
          state_id INTEGER NOT NULL,
          city_id INTEGER NOT NULL,
          reason TEXT NOT NULL,
          quantity TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new', 'approved', 'rejected', 'completed')),
          created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
          FOREIGN KEY(listing_id) REFERENCES food_listings(id) ON DELETE CASCADE,
          FOREIGN KEY(state_id) REFERENCES states(id) ON DELETE CASCADE,
          FOREIGN KEY(city_id) REFERENCES cities(id) ON DELETE CASCADE
        );
        
        INSERT INTO requests (id, listing_id, requester_name, requester_mobile, address, state_id, city_id, reason, quantity, status, created_at)
        SELECT id, listing_id, requester_name, requester_mobile, address, state_id, city_id, reason, quantity, status, created_at
        FROM _requests_old;
        
        DROP TABLE IF EXISTS _requests_old;
        COMMIT;
      `);
      db.exec("PRAGMA foreign_keys = ON;");
      console.log("requests table successfully migrated to reference food_listings.");
    }
  } catch (e) {
    console.error("Failed to migrate requests table reference:", e.message);
    try { db.exec("ROLLBACK;"); } catch(err) {}
    try { db.exec("PRAGMA foreign_keys = ON;"); } catch(err) {}
  }

  db.exec(`
    CREATE TABLE IF NOT EXISTS enquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      mobile TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new', 'read')),
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS pages (
      id TEXT PRIMARY KEY,
      about_text TEXT NOT NULL,
      contact_text TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    );
  `);

  // --- SEED DATA ---
  // Seed default admin if not exists
  const adminCheck = db.prepare("SELECT id FROM users WHERE role = 'admin'").get();
  if (!adminCheck) {
    const insertAdmin = db.prepare(`
      INSERT INTO users (name, email, password, role, mobile, address, status)
      VALUES (?, ?, ?, 'admin', '9999999999', 'Admin HQ, New Delhi', 'approved')
    `);
    insertAdmin.run('System Admin', 'admin@foodseva.com', hashPassword('admin123'));
  }

  // Seed Pages content if not exists
  const pagesCheck = db.prepare("SELECT id FROM pages WHERE id = 'main'").get();
  if (!pagesCheck) {
    const insertPages = db.prepare(`
      INSERT INTO pages (id, about_text, contact_text)
      VALUES (?, ?, ?)
    `);
    insertPages.run(
      'main',
      'Anna Seva is a non-profit initiative dedicated to reducing food waste and hunger. We connect generous donors who have surplus food with people, shelters, and NGOs who need it. Our system coordinates logistics, city coverage, and verification to make sure meals are delivered safely and efficiently.',
      'You can reach the Anna Seva helpline at info@annaseva.org, or visit our central coordination office at Seva Bhawan, New Delhi. Mobile: +91 1800-111-222.'
    );
  }

  // Seed States (Idempotent insertion)
  const states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 
    'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 
    'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Puducherry', 
    'Chandigarh', 'Andaman and Nicobar Islands', 'Ladakh'
  ];
  const insertState = db.prepare('INSERT OR IGNORE INTO states (name) VALUES (?)');
  for (const s of states) {
    insertState.run(s);
  }

  // Seed Cities (Idempotent insertion)
  const citiesData = [
    { state: 'Andhra Pradesh', cities: ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Tirupati'] },
    { state: 'Arunachal Pradesh', cities: ['Itanagar', 'Naharlagun', 'Tawang'] },
    { state: 'Assam', cities: ['Guwahati', 'Dibrugarh', 'Silchar', 'Jorhat'] },
    { state: 'Bihar', cities: ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur'] },
    { state: 'Chhattisgarh', cities: ['Raipur', 'Bhilai', 'Bilaspur'] },
    { state: 'Goa', cities: ['Panaji', 'Margao', 'Vasco da Gama'] },
    { state: 'Gujarat', cities: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar'] },
    { state: 'Haryana', cities: ['Gurugram', 'Faridabad', 'Panipat', 'Ambala'] },
    { state: 'Himachal Pradesh', cities: ['Shimla', 'Dharamshala', 'Solan'] },
    { state: 'Jammu and Kashmir', cities: ['Srinagar', 'Jammu', 'Anantnag'] },
    { state: 'Jharkhand', cities: ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro'] },
    { state: 'Karnataka', cities: ['Bengaluru', 'Mysuru', 'Hubballi', 'Mangaluru', 'Belagavi'] },
    { state: 'Kerala', cities: ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur'] },
    { state: 'Madhya Pradesh', cities: ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain'] },
    { state: 'Maharashtra', cities: ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Aurangabad', 'Kolhapur', 'Latur', 'Solapur'] },
    { state: 'Manipur', cities: ['Imphal', 'Thoubal'] },
    { state: 'Meghalaya', cities: ['Shillong', 'Tura'] },
    { state: 'Mizoram', cities: ['Aizawl', 'Lunglei'] },
    { state: 'Nagaland', cities: ['Kohima', 'Dimapur'] },
    { state: 'Odisha', cities: ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Sambalpur'] },
    { state: 'Punjab', cities: ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala'] },
    { state: 'Rajasthan', cities: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer'] },
    { state: 'Sikkim', cities: ['Gangtok', 'Namchi'] },
    { state: 'Tamil Nadu', cities: ['Chennai', 'Coimbatore', 'Madurai', 'Trichy', 'Salem'] },
    { state: 'Telangana', cities: ['Hyderabad', 'Warangal', 'Nizamabad', 'Khammam'] },
    { state: 'Tripura', cities: ['Agartala', 'Udaipur'] },
    { state: 'Uttar Pradesh', cities: ['Lucknow', 'Kanpur', 'Noida', 'Ghaziabad', 'Agra', 'Varanasi', 'Allahabad', 'Aligarh', 'Meerut'] },
    { state: 'Uttarakhand', cities: ['Dehradun', 'Haridwar', 'Haldwani', 'Roorkee'] },
    { state: 'West Bengal', cities: ['Kolkata', 'Howrah', 'Durgapur', 'Siliguri', 'Asansol'] },
    { state: 'Delhi', cities: ['New Delhi', 'Dwarka', 'Rohini', 'Saket'] },
    { state: 'Puducherry', cities: ['Puducherry', 'Karaikal'] },
    { state: 'Chandigarh', cities: ['Chandigarh'] },
    { state: 'Andaman and Nicobar Islands', cities: ['Port Blair'] },
    { state: 'Ladakh', cities: ['Leh', 'Kargil'] }
  ];

  const insertCity = db.prepare('INSERT INTO cities (state_id, name) VALUES (?, ?)');
  for (const item of citiesData) {
    const stateRow = db.prepare("SELECT id FROM states WHERE name = ?").get(item.state);
    if (!stateRow) continue;
    const stateId = stateRow.id;

    for (const c of item.cities) {
      const cityCheck = db.prepare("SELECT id FROM cities WHERE state_id = ? AND name = ?").get(stateId, c);
      if (!cityCheck) {
        insertCity.run(stateId, c);
      }
    }
  }

  // Seed Donors (Need 3 to match dashboard photo "Total Food Donor: 3")
  try {
    const donorCount = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'donor'").get()?.count;
    if (donorCount === 0) {
      const mh = db.prepare("SELECT id FROM states WHERE name = 'Maharashtra'").get()?.id;
      const kolhapur = db.prepare("SELECT id FROM cities WHERE name = 'Kolhapur'").get()?.id;
      const up = db.prepare("SELECT id FROM states WHERE name = 'Uttar Pradesh'").get()?.id;
      const allahabad = db.prepare("SELECT id FROM cities WHERE name = 'Allahabad'").get()?.id;
      const ap = db.prepare("SELECT id FROM states WHERE name = 'Andhra Pradesh'").get()?.id;
      const vishakhapatnam = db.prepare("SELECT id FROM cities WHERE name = 'Visakhapatnam'").get()?.id;

      // Resolve or dynamically insert Latur to prevent ReferenceError
      let latur;
      const laturRow = db.prepare("SELECT id FROM cities WHERE name = 'Latur'").get();
      if (laturRow) {
        latur = laturRow.id;
      } else if (mh) {
        const insertCity = db.prepare('INSERT INTO cities (state_id, name) VALUES (?, ?)');
        insertCity.run(mh, 'Latur');
        latur = db.prepare("SELECT id FROM cities WHERE name = 'Latur'").get()?.id;
      }

      if (mh && kolhapur && up && allahabad && ap && vishakhapatnam && latur) {
        const insertDonor = db.prepare(`
          INSERT INTO users (name, email, password, role, mobile, address, state_id, city_id, status)
          VALUES (?, ?, ?, 'donor', ?, ?, ?, ?, 'approved')
        `);

        insertDonor.run('Hriday', 'Hriday@donor.com', hashPassword('donor123'), '1478523699', 'b755 latur', mh, latur);
        insertDonor.run('Rahul', 'rahul@donor.com', hashPassword('donor123'), '9874563210', 'b552 sehore', ap, vishakhapatnam);
        insertDonor.run('Aditya', 'aditya@donor.com', hashPassword('donor123'), '9852364710', 'b744 kolhapur', up, allahabad);
      }
    }
  } catch (e) {
    console.error('Failed to seed donors:', e.message);
  }

  // Seed Food Listings (Need 4 to match dashboard photo "Total Listed Food: 4")
  try {
    const listingCount = db.prepare('SELECT COUNT(*) as count FROM food_listings').get()?.count;
    if (listingCount === 0) {
      const hriday = db.prepare("SELECT id FROM users WHERE email = 'Hriday@donor.com'").get()?.id;
      const rahul = db.prepare("SELECT id FROM users WHERE email = 'rahul@donor.com'").get()?.id;
      const aditya = db.prepare("SELECT id FROM users WHERE email = 'aditya@donor.com'").get()?.id;

      const mh = db.prepare("SELECT id FROM states WHERE name = 'Maharashtra'").get()?.id;
      const kolhapur = db.prepare("SELECT id FROM cities WHERE name = 'Kolhapur'").get()?.id;
      const up = db.prepare("SELECT id FROM states WHERE name = 'Uttar Pradesh'").get()?.id;
      const allahabad = db.prepare("SELECT id FROM cities WHERE name = 'Allahabad'").get()?.id;
      const aligarh = db.prepare("SELECT id FROM cities WHERE name = 'Aligarh'").get()?.id;
      const ap = db.prepare("SELECT id FROM states WHERE name = 'Andhra Pradesh'").get()?.id;
      const vishakhapatnam = db.prepare("SELECT id FROM cities WHERE name = 'Visakhapatnam'").get()?.id;

      if (hriday && rahul && aditya && mh && kolhapur && up && allahabad && aligarh && ap && vishakhapatnam) {
        const insertListing = db.prepare(`
          INSERT INTO food_listings (id, donor_id, contact_person, mobile, food_items, description, address, state_id, city_id, status, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        // Match exactly the 3 listings shown in the first screenshot available food table
        insertListing.run(1, hriday, 'Hriday', '1478523699', 'Dal,Rice,Roti,Panner', 'Freshly prepared lunch package.', 'b755 kolhapur', up, allahabad, 'available', '2024-02-24 14:54:51');
        insertListing.run(2, rahul, 'Rahul', '9874563210', 'Dal Maknhi,Bread,Rice', 'Dinner pack from a small gathering.', 'b552 sehore', ap, vishakhapatnam, 'available', '2024-01-23 00:00:00');
        insertListing.run(3, aditya, 'Aditya', '9852364710', 'Dal,Rice,Mix Veg,Panner', 'Excess food from home party.', 'b744 kolhapur', up, aligarh, 'available', '2024-08-24 00:00:00');
        insertListing.run(4, hriday, 'Hriday', '1478523699', 'Khichdi', 'Healthy dinner food.', 'b755 kolhapur', mh, kolhapur, 'available', '2024-08-25 12:00:00');
      }
    }
  } catch (e) {
    console.error('Failed to seed listings:', e.message);
  }

  // Seed Requests (Need 6 total to match "All Requests: 6" in admin dashboard)
  try {
    const requestCount = db.prepare('SELECT COUNT(*) as count FROM requests').get()?.count;
    if (requestCount === 0) {
      const up = db.prepare("SELECT id FROM states WHERE name = 'Uttar Pradesh'").get()?.id;
      const allahabad = db.prepare("SELECT id FROM cities WHERE name = 'Allahabad'").get()?.id;
      const mh = db.prepare("SELECT id FROM states WHERE name = 'Maharashtra'").get()?.id;
      const kolhapur = db.prepare("SELECT id FROM cities WHERE name = 'Kolhapur'").get()?.id;

      const l1 = db.prepare("SELECT id FROM food_listings WHERE id = 1").get();
      const l2 = db.prepare("SELECT id FROM food_listings WHERE id = 2").get();
      const l3 = db.prepare("SELECT id FROM food_listings WHERE id = 3").get();
      const l4 = db.prepare("SELECT id FROM food_listings WHERE id = 4").get();

      if (up && allahabad && mh && kolhapur && l1 && l2 && l3 && l4) {
        const insertRequest = db.prepare(`
          INSERT INTO requests (listing_id, requester_name, requester_mobile, address, state_id, city_id, reason, quantity, status, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        // 4 Completed
        insertRequest.run(1, 'NGO Ashraya', '8888888881', 'Colony Street 1', up, allahabad, 'For local slum children feed', '15 plates', 'completed', '2024-02-25 10:00:00');
        insertRequest.run(1, 'Shelter Home', '8888888882', 'Colony Street 2', up, allahabad, 'Daily dinner support', '10 plates', 'completed', '2024-02-26 10:00:00');
        insertRequest.run(2, 'Helping Hands', '8888888883', 'Sehore Main Rd', up, allahabad, 'Feeding homeless', '20 plates', 'completed', '2024-01-24 10:00:00');
        insertRequest.run(3, 'Care Foundation', '8888888884', 'Aligarh Market', up, allahabad, 'Distribution to street dwellers', '12 plates', 'completed', '2024-08-25 10:00:00');

        // 1 Rejected
        insertRequest.run(2, 'Unknown Entity', '9991112223', 'Fake Address', up, allahabad, 'Selfish request', '50 plates', 'rejected', '2024-01-25 11:00:00');

        // 1 New
        insertRequest.run(4, 'Sewa NGO', '7776665554', 'Kolhapur Town Hall', mh, kolhapur, 'Feeding kids program', '8 plates', 'new', '2026-06-03 12:00:00');
      }
    }
  } catch (e) {
    console.error('Failed to seed requests:', e.message);
  }

  // Seed sample Enquiry if not exists
  try {
    const enquiryCount = db.prepare('SELECT COUNT(*) as count FROM enquiries').get()?.count;
    if (enquiryCount === 0) {
      const insertEnquiry = db.prepare(`
        INSERT INTO enquiries (name, email, mobile, message, status, created_at)
        VALUES (?, ?, ?, ?, 'new', ?)
      `);
      insertEnquiry.run('Amit Sharma', 'amit@gmail.com', '9898989898', 'I would like to volunteer as a delivery partner in Mumbai.', '2026-06-03 14:00:00');
    }
  } catch (e) {
    console.error('Failed to seed enquiries:', e.message);
  }
}

// Database helper functions
export const query = {
  exec(sql) {
    return db.exec(sql);
  },
  prepare(sql) {
    return db.prepare(sql);
  },
  all(sql, params = []) {
    return db.prepare(sql).all(...params);
  },
  get(sql, params = []) {
    return db.prepare(sql).get(...params);
  },
  run(sql, params = []) {
    return db.prepare(sql).run(...params);
  }
};

// Initialize immediately on load
try {
  initDB();
  console.log('Database initialized successfully with schema and seed data.');
} catch (error) {
  console.error('Failed to initialize database:', error);
}
