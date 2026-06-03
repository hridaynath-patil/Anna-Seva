# अन्न सेवा (Anna Seva) - Feed Needy, Reduce Waste

An elegantly designed, full-stack food rescue and redistribution web application. Operated under the patronage of the **Shri Vishwanathrao Shamrao Patil Charitable Trust**, Anna Seva connects verified donors (banquets, caterers, restaurants, and households) with local recipient organizations (NGOs, shelter homes, and volunteers) to direct surplus food batches to those who need them most.

🔗 **Live Local Link:** [http://localhost:3000](http://localhost:3000)

### 📸 Application Screenshots
| **Landing Page** | **Available Food Directory** |
|:---:|:---:|
| ![Landing Page](./screenshots/landing.png) | ![Available Food](./screenshots/available_food.png) |

| **Donor Portal Login** | **Admin Dashboard** |
|:---:|:---:|
| ![Donor Login](./screenshots/donor_login.png) | ![Admin Dashboard](./screenshots/admin_dashboard.png) |

| **Donor Food Listings** |
|:---:|
| ![Donor Listings](./screenshots/donor_listings.png) |
---

## Page-by-Page Feature Breakdown

### 1. Immersive Public Landing Page
* **Light-Gradient Hero Interface:** A premium, light-themed landing experience featuring stacked Devanagari and English trust initiative badges, modern typography, and a centered call-to-action layout.
* **Commitment to Social Welfare:** A checkmark-bulleted breakdown introducing visitors to our coordinated rescue network, local alliances, wide-reaching distribution, and direct transparency model.
* **Live Impact Stats Dashboard:** Real-time database metrics counting active donors, listed food batches, and completed deliveries.
* **Three Operational Pillars:** Structured direction modules showing how Donors list food, Requesters browse & claim, and Admins audit regional distribution.

### 2. User Authentication (Login & Signup)
* **Secure Registration:** Responsive onboarding screens for new food donors.
* **Admin Approval Verification Flow:** All newly registered donors default to a `pending` state and cannot log in until approved. Upon registration, they are shown a guidelines page explaining their request is sent to the admin.
* **Password Visibility Toggle:** Interactive fields equipped with inline toggles to show/hide input passwords securely.
* **State & City Hierarchical Menus:** Registration prompts are mapped to state-specific city lists dynamically queried from the database.

### 3. Public Available Food Directory
* **Search & Filters:** Integrated filter panel letting NGOs and coordinators query available food batches by keywords, state, and city.
* **Sleek Table Layout:** A compact, responsive layout displaying contact details (name & phone number stacked), food items, address, city/state, status badges, and date cataloged.
* **Allocation Request Modal:** Clicking "Claim Food" triggers an interactive modal containing food summaries and a form to submit claims (NGO name, mobile, address, justification, and quantity).

### 4. Donor Management Panel
* **Impact Dashboard:** Overview tracking listed food batches, active claims, and completed fulfillments.
* **Food Listing Form:** Inputs to catalog surplus food details (contact person, phone number, food description, collection address, state, and city).
* **Listing Logs:** View listed items, edit details of existing available items, and track claimed/completed statuses.
* **Claim Request Logs:** Check incoming recipient requests for their listed food batches, including NGO names, reasons, and target quantities. 
* **Profile Management:** View profile summary with a read-only field lock on mobile and email to preserve identity checks.

### 5. Administration Control Panel
* **Admin Dashboard:** High-level metrics tracking trust performance: total donors, cataloged meals, enquiries, and completed claims.
* **Donor Verification Directory:** View register requests with badges (`pending`, `approved`, `rejected`) and perform direct Approve, Reject, or Remove actions.
* **Food Listings Auditor:** Review, verify, and delete cataloged food items.
* **Allocation Requests Auditor:** Track recipient request logs, inspect NGO justifications, and audit distribution pipelines.
* **Location Database Manager:** Admin panels to add and delete states and cities dynamically.
* **Static Content Management:** Editor page to update trust descriptions and helpline info rendered in the Public About and Contact pages.

---

## Tech Stack

* **Frontend & Compilation:** Next.js 16 (React), compiled with Next.js Turbopack for lightning-fast hot reloading.
* **Backend & API Router:** Next.js App Router REST API endpoints.
* **Database & Concurrency:** Native Node.js `node:sqlite` (`DatabaseSync`). Configured with:
  * **Write-Ahead Logging (WAL):** `PRAGMA journal_mode = WAL;` to support parallel reading and writing without locking.
  * **Busy Timeout:** `PRAGMA busy_timeout = 10000;` (10 seconds) to ensure concurrent page rendering compilation workers execute smoothly without database locks.
* **Styling:** Vanilla CSS with a high-trust corporate design system (Slate Navy and Mint Teal palette) styled in `globals.css`.

---

## Getting Started

1. **Verify Database Configuration:**
   Ensure the database is initialized with tables (`states`, `cities`, `users`, `food_listings`, `requests`, `enquiries`, `pages`) and fully seeded. Running the server will automatically execute database migrations.

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Start the Development Server:**
   ```bash
   npm run dev
   ```

4. **Compile Production Bundle:**
   ```bash
   npm run build
   ```

Happy redistributing! Reduce waste, feed lives.
