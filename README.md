# Vehicle-Marketplace

Overview of the Application’s Functionality:
The Vehicle Marketplace is a web-based platform designed to simplify vehicle transactions. Sellers can create detailed listings with vehicle specifications, photos, and pricing, while buyers can explore and filter vehicles using advanced search options. Secure in-platform messaging enables buyers and sellers to communicate without sharing personal contact details. Additionally, the platform features an admin dashboard for managing users, listings, and disputes. Optional enhancements such as a vehicle comparison tool, email notifications for saved searches, a bookmark feature for favorites, and a chatbot for customer service aim to further improve user experience.

Technology Stack:
Frontend: React.js, Tailwind CSS
Backend: Django or Node.js
Database: PostgreSQL
APIs:
Google Maps API or Mapbox (location-based searches)
Twilio API or Socket.IO (secure messaging)
OpenAI API (chatbot integration)
Hosting: AWS
Version Control: Git

Features to Be Implemented:
Core Features:
User Authentication (email/password, role-based access for buyers/sellers, and admins).
Vehicle Listings with details like make, model, year, price, mileage, and photos and more.
Advanced Search and Filters (location, price, vehicle type, mileage, engine power, and year).
Secure Messaging between buyers and sellers.
Admin Dashboard to manage users, listings, and disputes.
Optional Features:
Vehicle Comparison Tool for side-by-side evaluation.
Notifications via email for buyers when new listings match their search criteria.
Bookmark Feature for users easy access to their favorite listings.
Chatbot for customer service.
Mobile compatible.(specify max-min resolution in readme)

User Stories:
As a buyer, I want to search for vehicles using specific filters (e.g., price, location, mileage) so that I can quickly find options that meet my preferences.
As a seller, I want to create detailed vehicle listings with photos and descriptions so that buyers can understand my offering.
As a buyer, I want to communicate securely with sellers through in-app messaging so that I can negotiate or ask questions safely.
As an admin, I want to oversee user accounts and listings so that the platform maintains quality and security.
As a buyer, I want to save my favorite listings so that I can easily revisit and compare them later.

# Database Schema and ER Diagram for Vehicle Marketplace

## 1. Database Tables and Relationships

### User Table
Stores user information. Users can act as both buyers and sellers, with an admin role for moderation.

| Field           | Type              | Description                     |
| -------------- | ---------------- | ------------------------------- |
| `id`          | UUID (Primary Key) | Unique identifier               |
| `email`       | String (Unique)    | User email                      |
| `password`    | String             | Hashed password                 |
| `name`        | String             | Full name                       |
| `phone_number` | String            | Contact number                  |
| `role`        | ENUM("user", "admin") | Defines privileges          |
| `profile_picture` | String (Optional) | Profile image URL          |
| `created_at`  | Timestamp          | When the account was created    |
| `updated_at`  | Timestamp          | Last profile update             |

---

### Vehicle Table
Stores vehicle listings with detailed specifications.

| Field          | Type                | Description                            |
| ------------- | ------------------ | -------------------------------------- |
| `id`         | UUID (Primary Key)   | Unique vehicle identifier             |
| `seller_id`  | UUID (Foreign Key → User) | Seller’s ID                     |
| `brand`      | String               | Brand of the vehicle                  |
| `model`      | String               | Model of the car                      |
| `title`      | String               | Listing title (e.g., "Aston Martin V8") |
| `price`      | Decimal              | Vehicle price                         |
| `mileage`    | Integer              | Kilometers driven                     |
| `year`       | Integer              | Model year                             |
| `fuel_type`  | String               | Fuel type (Petrol, Diesel, Electric)  |
| `transmission` | String             | Manual or Automatic                   |
| `engine_power` | Integer            | Horsepower/kW                         |
| `drivetrain` | String               | FWD, RWD, AWD                         |
| `color`      | String               | Exterior color                         |
| `description` | Text                | Seller-provided details               |
| `location`   | JSON (lat, lng)      | Geolocation for searches              |
| `is_second_hand` | Boolean          | Indicates if used/new                 |

---

### Condition Report (For Used Cars) Optional Feature

| Field          | Type     | Description                              |
| ------------- | ------- | ---------------------------------------- |
| `accident_report` | Boolean | Indicates prior accidents           |
| `damaged_parts` | JSON    | Stores a list of damaged/replaced parts |
| `has_warranty` | Boolean | Warranty status                         |
| `service_history` | Text  | Maintenance records                     |

---

### Vehicle Hardware (Equipment)
Instead of a separate table, this is stored as a **JSON field** inside the `Vehicle` table.

```json
{
  "safety": ["Driver Airbag", "Passenger Airbag", "ABS", "ESP"],
  "comfort": ["Electric Mirrors", "Cruise Control"],
  "multimedia": ["Bluetooth", "Navigation"]
}
```

---

### Vehicle Photo Table
Manages multiple photos for each vehicle.

| Field        | Type                 | Description                  |
| ------------ | ------------------- | ---------------------------- |
| `id`        | UUID (Primary Key)   | Unique photo ID              |
| `vehicle_id` | UUID (Foreign Key → Vehicle) | Associated vehicle ID |
| `photo_url` | String               | URL to stored image          |

---

### Favorites Table
Allows users to save vehicle listings.

| Field       | Type                  | Description                    |
| ----------- | -------------------- | ------------------------------ |
| `id`       | UUID (Primary Key)    | Unique favorite ID             |
| `user_id`  | UUID (Foreign Key → User) | The user who favorited it |
| `vehicle_id` | UUID (Foreign Key → Vehicle) | Favorited vehicle |
| `created_at` | Timestamp            | Date favorited                 |

---

### Messaging Table
Future feature of making it real-time chat.

| Field        | Type                  | Description                    |
| ------------ | -------------------- | ------------------------------ |
| `id`        | UUID (Primary Key)    | Unique message ID              |
| `sender_id` | UUID (Foreign Key → User) | Sender’s ID |
| `receiver_id` | UUID (Foreign Key → User) | Receiver’s ID |
| `vehicle_id` | UUID (Foreign Key → Vehicle, Nullable) | Related listing |
| `content`   | Text                  | Message text                   |
| `is_deleted` | Boolean              | Soft delete option             |
| `created_at` | Timestamp            | Date message was sent          |

> **Future Expansion:** want to integrate WebSockets for real-time chat.

---

### Report Table (User Reports)
Users can report listings for fraud, disputes, or violations.

| Field       | Type                   | Description                   |
| ----------- | --------------------- | ----------------------------- |
| `id`       | UUID (Primary Key)     | Unique report ID              |
| `reporter_id` | UUID (Foreign Key → User) | User who reported |
| `listing_id` | UUID (Foreign Key → Vehicle) | Reported listing |
| `reason`   | Text                   | Report description            |
| `status`   | ENUM("open", "under review", "resolved") | Status tracking |
| `created_at` | Timestamp             | Date report was submitted     |

---

### Soft Delete System
Instead of permanently deleting records, we mark them as inactive.

- **For Vehicles:** Add `is_deleted` (Boolean) in the `Vehicle` table.  
- **For Messages:** Add `is_deleted` (Boolean) in the `Messaging` table.  

---

## 2. Database Scheme
![image](https://github.com/user-attachments/assets/ebd2ea3e-6e2c-4bf7-b833-7a24c4f007c5)

---

## 3. CRUD Operations

### Users
| Method | Endpoint | Description |
|--------|---------|-------------|
| `POST` | `/auth/register` | Register a new user |
| `GET` | `/users/{id}` | Retrieve user details |
| `PUT` | `/users/{id}` | Update profile details |
| `PATCH` | `/users/{id}` | Soft delete account (sets is_deleted=True) |

---

### Vehicles
| Method | Endpoint | Description |
|--------|---------|-------------|
| `POST` | `/listings` | Add a new vehicle listing |
| `GET` | `/listings` | Retrieve vehicle listings |
| `PUT` | `/listings/{id}` | Edit vehicle details |
| `PATCH` | `/listings/{id}` | Soft delete a vehicle (sets is_deleted=True) |

---

### Favorites
| Method | Endpoint | Description |
|--------|---------|-------------|
| `POST` | `/favorites` | Save a vehicle listing |
| `GET` | `/favorites` | Retrieve saved listings |
| `DELETE` | `/favorites/{id}` | Remove a saved listing |

---

### Reports
| Method | Endpoint | Description |
|--------|---------|-------------|
| `POST` | `/reports` | Report a listing |
| `GET` | `/reports` | View reports |
| `PUT` | `/reports/{id}` | Change report status |
| `DELETE` | `/reports/{id}` | Admin-only option |

---
