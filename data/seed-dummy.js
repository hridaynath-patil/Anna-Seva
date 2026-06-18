import './load-env.js';
import { query, hashPassword } from '../src/lib/db.js';

const dummyUsers = [
  {
    name: "Vallabh Kulkarni",
    email: "vallabh@donor.com",
    mobile: "7517536723",
    address: "Basil Mondale - Kharadi Pune",
    cityName: "Pune",
    foods: [
      { name: "Pav Bhaji", qty: "50 servings", desc: "Freshly prepared Pav Bhaji with extra pav. Prepared for a small get-together." },
      { name: "Veg Biryani", qty: "80 servings", desc: "Delicious veg biryani with raita. Perfect for distributing to the needy." }
    ]
  },
  {
    name: "Rutvik Kulkarni",
    email: "rutvik@donor.com",
    mobile: "9284754843",
    address: "Baner Pune",
    cityName: "Pune",
    foods: [
      { name: "Chole Bhature", qty: "60 servings", desc: "Spicy chole with fluffy bhature." },
      { name: "Mix Veg & Chapati", qty: "100 servings", desc: "Healthy mix vegetable curry with 200 chapatis." }
    ]
  },
  {
    name: "Manjunath Patil",
    email: "manjunath@donor.com",
    mobile: "7276274362",
    address: "Madhuban Society - Baner Pune",
    cityName: "Pune",
    foods: [
      { name: "Idli Sambar", qty: "120 servings", desc: "Soft steamed idlis served with sambar and coconut chutney." },
      { name: "Dal Rice", qty: "90 servings", desc: "Comforting steam rice and yellow dal tadka." }
    ]
  },
  {
    name: "Ramnath Patil",
    email: "ramnath@donor.com",
    mobile: "8378998788",
    address: "GV7 - Ambegaon Pune",
    cityName: "Pune",
    foods: [
      { name: "Puri Bhaji", qty: "70 servings", desc: "Hot puris with potato bhaji." },
      { name: "Khichdi", qty: "50 servings", desc: "Nutritious and light dal khichdi." }
    ]
  },
  {
    name: "Brahma Deshmukh",
    email: "brahma@donor.com",
    mobile: "9922466109",
    address: "Vanaz Metro Station Kothrud Pune",
    cityName: "Pune",
    foods: [
      { name: "Paneer Masala & Jeera Rice", qty: "110 servings", desc: "Rich paneer gravy served with aromatic jeera rice." },
      { name: "Samosa & Chutney", qty: "150 servings", desc: "150 pieces of fresh hot samosas with tamarind chutney." }
    ]
  },
  {
    name: "Satvik Kulkarni",
    email: "satvik@donor.com",
    mobile: "9130601071",
    address: "White Stone Society - Wagholi, Pune",
    cityName: "Pune",
    foods: [
      { name: "Aloo Paratha", qty: "80 servings", desc: "Stuffed aloo parathas with pickle." },
      { name: "Pulao", qty: "100 servings", desc: "Veg pulao loaded with green peas and carrots." }
    ]
  },
  {
    name: "Vashishth Kulkarni",
    email: "vashishth@donor.com",
    mobile: "7588119346",
    address: "Vaibhav Ganesh Mandir, Latur",
    cityName: "Latur",
    foods: [
      { name: "Sheera", qty: "60 servings", desc: "Sweet semolina sheera prepared for prasad." },
      { name: "Dal Tadka & Rice", qty: "85 servings", desc: "Spiced dal tadka with plain rice." }
    ]
  },
  {
    name: "Shashank Sonkawade",
    email: "shashank@donor.com",
    mobile: "8149997759",
    address: "Khadgaon Road, Latur",
    cityName: "Latur",
    foods: [
      { name: "Masala Bhat", qty: "100 servings", desc: "Traditional Maharashtrian spiced rice." },
      { name: "Chapati & Usal", qty: "120 servings", desc: "Sprouted moth bean usal served with soft chapatis." }
    ]
  }
];

const ngos = [
  { name: "Smile Foundation", mobile: "9876543001", reason: "Distribution to underprivileged children at municipal schools" },
  { name: "Goonj NGO", mobile: "9876543002", reason: "Feeding drive for construction workers and daily wage laborers" },
  { name: "Robin Hood Army", mobile: "9876543003", reason: "Night distribution drive in local slum pockets" },
  { name: "Seva International", mobile: "9876543004", reason: "Meals for senior citizen shelters and care homes" },
  { name: "Hope Orphanage", mobile: "9876543005", reason: "Special meal lunch for children at our orphanage center" }
];

async function seed() {
  try {
    console.log("Starting dummy data seeding...");

    // Get Maharashtra state ID
    const stateRow = await query.get("SELECT id FROM states WHERE name = ?", ["Maharashtra"]);
    if (!stateRow) {
      throw new Error("Maharashtra state not found in DB. Please run standard seed first.");
    }
    const stateId = stateRow.id;

    // Get Pune and Latur city IDs
    const puneRow = await query.get("SELECT id FROM cities WHERE name = ? AND state_id = ?", ["Pune", stateId]);
    const laturRow = await query.get("SELECT id FROM cities WHERE name = ? AND state_id = ?", ["Latur", stateId]);

    if (!puneRow || !laturRow) {
      throw new Error("Pune or Latur city not found in DB. Please run standard seed first.");
    }

    const cityIds = {
      "Pune": puneRow.id,
      "Latur": laturRow.id
    };

    const passwordHash = hashPassword("Password@123");

    for (const u of dummyUsers) {
      console.log(`Processing user: ${u.name} (${u.email})`);
      const cityId = cityIds[u.cityName];

      // Check if user already exists
      let user = await query.get("SELECT id FROM users WHERE email = ?", [u.email]);
      let userId;

      if (!user) {
        // Insert user
        const insertUserRes = await query.run(`
          INSERT INTO users (name, email, password, role, mobile, address, state_id, city_id, status)
          VALUES (?, ?, ?, 'donor', ?, ?, ?, ?, 'approved')
        `, [u.name, u.email, passwordHash, u.mobile, u.address, stateId, cityId]);
        userId = insertUserRes.lastInsertRowid;
        console.log(`  Created user with ID: ${userId}`);
      } else {
        userId = user.id;
        console.log(`  User already exists with ID: ${userId}. Updating details...`);
        await query.run("UPDATE users SET mobile = ?, name = ?, address = ?, state_id = ?, city_id = ? WHERE id = ?", [u.mobile, u.name, u.address, stateId, cityId, userId]);
      }

      // Add 2 foods for this user
      for (const food of u.foods) {
        // Check if listing already exists for this food name and donor
        let listing = await query.get(`
          SELECT id FROM food_listings 
          WHERE donor_id = ? AND food_items = ?
        `, [userId, food.name]);

        let listingId;
        if (!listing) {
          // Insert food listing (set status to 'claimed' since all food requests will be completed)
          const sql = `
            INSERT INTO food_listings (donor_id, contact_person, mobile, food_items, description, address, state_id, city_id, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'claimed')
          `;
          const params = [userId, u.name, u.mobile, food.name, `${food.desc} (Quantity: ${food.qty})`, u.address, stateId, cityId];
          console.log("SQL:", sql);
          console.log("Params:", params, "Length:", params.length);
          const insertListingRes = await query.run(sql, params);
          listingId = insertListingRes.lastInsertRowid;
          console.log(`    Created food listing: ${food.name} (ID: ${listingId})`);
        } else {
          listingId = listing.id;
          console.log(`    Food listing already exists: ${food.name} (ID: ${listingId}). Updating details...`);
          // Ensure it's marked as claimed and has the correct mobile/contact_person/details
          await query.run(`
            UPDATE food_listings 
            SET status = 'claimed', mobile = ?, contact_person = ?, address = ?, state_id = ?, city_id = ?
            WHERE id = ?
          `, [u.mobile, u.name, u.address, stateId, cityId, listingId]);
        }

        // Add 5 completed requests for this food listing
        let requestIndex = 1;
        for (const ngo of ngos) {
          // Check if request already exists from this NGO for this listing
          const reqCheck = await query.get(`
            SELECT id FROM requests 
            WHERE listing_id = ? AND requester_name = ?
          `, [listingId, ngo.name]);

          if (!reqCheck) {
            await query.run(`
              INSERT INTO requests (listing_id, requester_name, requester_mobile, address, state_id, city_id, reason, quantity, status)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
              listingId,
              ngo.name,
              ngo.mobile,
              u.cityName === "Pune" ? "NGO Center, Pune" : "NGO Center, Latur",
              stateId,
              cityId,
              ngo.reason,
              `Batch ${requestIndex++} (${food.qty})`,
              'completed'
            ]);
          }
        }
        console.log(`      Generated 5 completed requests for food: ${food.name}`);
      }
    }

    console.log("Seeding completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seed();
