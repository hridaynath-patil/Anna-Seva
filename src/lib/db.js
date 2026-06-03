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
    insertAdmin.run('System Admin', 'admin@annaseva.org', hashPassword('admin123'));
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

  // Seed Donors
  try {
    const donorCount = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'donor'").get()?.count;
    if (donorCount === 0) {
      const mh = db.prepare("SELECT id FROM states WHERE name = 'Maharashtra'").get()?.id;
      
      // Resolve or dynamically insert Pune and Latur
      let pune;
      let latur;

      const puneRow = db.prepare("SELECT id FROM cities WHERE name = 'Pune'").get();
      if (puneRow) {
        pune = puneRow.id;
      } else if (mh) {
        const insertCity = db.prepare('INSERT INTO cities (state_id, name) VALUES (?, ?)');
        insertCity.run(mh, 'Pune');
        pune = db.prepare("SELECT id FROM cities WHERE name = 'Pune'").get()?.id;
      }

      const laturRow = db.prepare("SELECT id FROM cities WHERE name = 'Latur'").get();
      if (laturRow) {
        latur = laturRow.id;
      } else if (mh) {
        const insertCity = db.prepare('INSERT INTO cities (state_id, name) VALUES (?, ?)');
        insertCity.run(mh, 'Latur');
        latur = db.prepare("SELECT id FROM cities WHERE name = 'Latur'").get()?.id;
      }

      if (mh && pune && latur) {
        const insertDonor = db.prepare(`
          INSERT INTO users (name, email, password, role, mobile, address, state_id, city_id, status)
          VALUES (?, ?, ?, 'donor', ?, ?, ?, ?, 'approved')
        `);

        insertDonor.run('Hridaynath Patil', 'hriday@donor.com', hashPassword('hriday123'), '7666484077', 'Vanaz Metro Station, Kothrud', mh, pune);
        insertDonor.run('Bhagwat Patil', 'bhagwat@donor.com', hashPassword('bhagwat123'), '9420434447', 'Matoshree Empire, Latur', mh, latur);
      }
    }
  } catch (e) {
    console.error('Failed to seed donors:', e.message);
  }

  // Seed Food Listings
  try {
    const listingCount = db.prepare('SELECT COUNT(*) as count FROM food_listings').get()?.count;
    if (listingCount === 0) {
      const hriday = db.prepare("SELECT * FROM users WHERE email = 'hriday@donor.com'").get();
      const bhagwat = db.prepare("SELECT * FROM users WHERE email = 'bhagwat@donor.com'").get();

      if (hriday && bhagwat) {
        const insertListing = db.prepare(`
          INSERT INTO food_listings (donor_id, contact_person, mobile, food_items, description, address, state_id, city_id, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        // Hridaynath's listings
        insertListing.run(hriday.id, hriday.name, hriday.mobile, 'Chapati', 'For 100 People (Quantity: 100)', hriday.address, hriday.state_id, hriday.city_id, 'approved');
        insertListing.run(hriday.id, hriday.name, hriday.mobile, 'Icecream', 'For 100 People (Quantity: 100)', hriday.address, hriday.state_id, hriday.city_id, 'approved');
        insertListing.run(hriday.id, hriday.name, hriday.mobile, 'Dalkhicdi', 'For 100 People (Quantity: 100)', hriday.address, hriday.state_id, hriday.city_id, 'claimed');

        // Bhagwat's listings
        insertListing.run(bhagwat.id, bhagwat.name, bhagwat.mobile, 'Thali', 'For 100 People (Quantity: 100)', bhagwat.address, bhagwat.state_id, bhagwat.city_id, 'approved');
        insertListing.run(bhagwat.id, bhagwat.name, bhagwat.mobile, 'Veg Pulav', 'For 100 People (Quantity: 100)', bhagwat.address, bhagwat.state_id, bhagwat.city_id, 'claimed');
      }
    }
  } catch (e) {
    console.error('Failed to seed food listings:', e.message);
  }

  // Seed Requests
  try {
    const requestCount = db.prepare('SELECT COUNT(*) as count FROM requests').get()?.count;
    if (requestCount === 0) {
      const mh = db.prepare("SELECT id FROM states WHERE name = 'Maharashtra'").get()?.id;
      const pune = db.prepare("SELECT id FROM cities WHERE name = 'Pune'").get()?.id;
      const latur = db.prepare("SELECT id FROM cities WHERE name = 'Latur'").get()?.id;

      const chapati = db.prepare("SELECT id FROM food_listings WHERE food_items = 'Chapati'").get()?.id;
      const icecream = db.prepare("SELECT id FROM food_listings WHERE food_items = 'Icecream'").get()?.id;
      const dalkhicdi = db.prepare("SELECT id FROM food_listings WHERE food_items = 'Dalkhicdi'").get()?.id;
      const thali = db.prepare("SELECT id FROM food_listings WHERE food_items = 'Thali'").get()?.id;
      const vegPulav = db.prepare("SELECT id FROM food_listings WHERE food_items = 'Veg Pulav'").get()?.id;

      if (mh && pune && latur && chapati && icecream && dalkhicdi && thali && vegPulav) {
        const insertRequest = db.prepare(`
          INSERT INTO requests (listing_id, requester_name, requester_mobile, address, state_id, city_id, reason, quantity, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        // Claims on Hridaynath's listings
        insertRequest.run(chapati, 'Sewa Foundation', '9876543210', 'Near Kothrud Depot, Pune', mh, pune, 'Distribution to roadside dwellers', '80 plates', 'approved');
        insertRequest.run(icecream, 'Hope Orphanage', '9822334455', 'Senapati Bapat Road, Pune', mh, pune, 'Dessert for kids after dinner drive', '100 cups', 'approved');
        insertRequest.run(dalkhicdi, 'Annapurna Kitchen', '9158000999', 'Deccan Gymkhana, Pune', mh, pune, 'Senior citizen home dinner distribution', '90 packs', 'completed');

        // Claims on Bhagwat's listings
        insertRequest.run(thali, 'Latur Relief NGO', '9405001122', 'Gandhi Chowk, Latur', mh, latur, 'Free meals for patients relatives at civil hospital', '100 Thalis', 'approved');
        insertRequest.run(vegPulav, 'Samarpan Trust', '9850123456', 'Ausa Road, Latur', mh, latur, 'Slum area feeding program', '100 plates', 'completed');
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
