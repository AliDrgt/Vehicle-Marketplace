# Vehicle-Marketplace

Overview of the Application’s Functionality:
The Vehicle Marketplace is a web-based platform designed to simplify vehicle transactions. Sellers can create detailed listings with vehicle specifications, photos, and pricing, while buyers can explore and filter vehicles using advanced search options. Secure in-platform messaging enables buyers and sellers to communicate without sharing personal contact details. Additionally, the platform features an admin dashboard for managing users, listings, and disputes. Optional enhancements such as a vehicle comparison tool, email notifications for saved searches, a bookmark feature for favorites, and a chatbot for customer service aim to further improve user experience.

Technology Stack:
Frontend: Next.js
Backend: Node.js(NestJS)
Database: PostgreSQL
APIs:
Google Maps API or Mapbox (location-based searches)
Twilio API or Socket.IO (secure messaging)
OpenAI API (chatbot integration)
Hosting: AWS
Version Control: Git

Why Next.js?
Next.js is chosen for its better performance, SEO optimization, and flexibility. Since the marketplace has public-facing vehicle listings, it needs search engines to index pages efficiently. Next.js allows pre-rendering using Static Site Generation (SSG) and Incremental Static Regeneration (ISR), making pages load faster and rank higher.
It also provides hybrid rendering, built-in image optimization, and API routes, making it ideal for balancing speed, SEO, and scalability.




Features to Be Implemented:
Core Features:
User Authentication (email/password, role-based access for buyers/sellers, and admins).
Vehicle Listings with details like make, model, year, price, mileage, and photos and more.
Advanced Search and Filters (location, price, vehicle type, mileage, engine power, and year).
Admin Dashboard to manage users, listings, and disputes.
Bookmark Feature for users easy access to their favorite listings.

Optional Features:
Secure Messaging between buyers and sellers.
Vehicle Comparison Tool for side-by-side evaluation.
Notifications via email for buyers when new listings match their search criteria.
Chatbot for customer service.
Mobile compatible.(specify max-min resolution in readme)

User Stories:
As a buyer, I want to search for vehicles using specific filters (e.g., price, location, mileage) so that I can quickly find options that meet my preferences.
As a seller, I want to create detailed vehicle listings with photos and descriptions so that buyers can understand my offering.
As a buyer, I want to communicate securely with sellers through in-app messaging so that I can negotiate or ask questions safely.
As an admin, I want to oversee user accounts and listings so that the platform maintains quality and security.
As a buyer, I want to save my favorite listings so that I can easily revisit and compare them later.

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
| `role`        | ENUM("user", "admin") | Defines privileges           |
| `profile_picture` | String (Optional) | Profile image URL            |
| `created_at`  | Timestamp          | When the account was created    |
| `updated_at`  | Timestamp          | Last profile update             |
| `listings`    | Listing[]          | All Listings                    |
| `favorites`   | Favorite[]         | User Favorites                  |
| `reports`     | Report[]           | User Reports                    |
| `isDeleted`   | Boolean            | Soft Delete Bool                |


---

### Vehicle Table
Stores vehicle listings with detailed specifications.

| Field          | Type                | Description                            |
| ------------- | ------------------ | -------------------------------------- |
| `id`         | UUID (Primary Key)   | Unique vehicle identifier             |
| `sellerId`   | UUID (Foreign Key → User) | ID of the seller                     |
| `seller`     | Relation (User)      | Seller details                         |
| `brandId`    | Integer (Foreign Key → CarBrand) | ID of the vehicle brand        |
| `brand`      | Relation (CarBrand)  | Brand details                          |
| `modelId`    | Integer (Foreign Key → CarModel) | ID of the car model            |
| `model`      | Relation (CarModel)  | Model details                          |
| `title`      | String               | Listing title (e.g., "Aston Martin V8") |
| `price`      | Float                | Vehicle price                         |
| `mileage`    | Integer              | Kilometers driven                     |
| `year`       | Integer              | Model year                            |
| `fuelType`   | String               | Fuel type (Petrol, Diesel, Hybrid, Electric) |
| `transmission` | String             | Manual, Automatic, Semi-Automatic     |
| `enginePower` | Integer             | Horsepower/kW                         |
| `drivetrain` | String               | FWD, RWD, AWD                         |
| `color`      | String               | Exterior color                         |
| `description` | Text                | Seller-provided details               |
| `location`   | JSON (lat, lng)      | Geolocation for searches              |
| `isSecondHand` | Boolean            | Indicates if used or new              |
| `photos`     | Array (VehiclePhoto[]) | Images associated with the listing   |
| `favorites`  | Array (Favorite[])   | Users who favorited the listing       |
| `reports`    | Array (Report[])     | Reports associated with this listing  |
| `createdAt`  | DateTime (default: now()) | Timestamp when the listing was created |
| `updatedAt`  | DateTime (auto-update) | Timestamp when the listing was last updated |
| `isDeleted`  | Boolean (default: false) | Soft delete flag for listings |

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

| Field       | Type                     | Description                          |
|------------|--------------------------|--------------------------------------|
| `id`       | UUID (Primary Key)       | Unique photo identifier             |
| `listingId` | UUID (Foreign Key → Listing) | Associated listing ID           |
| `listing`  | Relation (Listing)       | Reference to the associated listing |
| `photoUrl` | String                   | URL to the stored image             |
| `createdAt` | DateTime (default: now()) | Timestamp when the photo was added  |

---

### Favorites Table
Allows users to save vehicle listings.

| Field       | Type                     | Description                        |
|------------|--------------------------|------------------------------------|
| `id`       | UUID (Primary Key)       | Unique favorite identifier        |
| `userId`   | UUID (Foreign Key → User) | The user who favorited the listing |
| `listingId` | UUID (Foreign Key → Listing) | Favorited listing ID            |
| `createdAt` | DateTime (default: now()) | Timestamp when favorited         |

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

| Field        | Type                                      | Description                     |
|-------------|------------------------------------------|---------------------------------|
| `id`        | UUID (Primary Key)                      | Unique report identifier       |
| `reporterId` | UUID (Foreign Key → User)               | User who submitted the report  |
| `listingId`  | UUID (Foreign Key → Listing)            | Listing that was reported      |
| `reason`    | String                                   | Description of the report issue |
| `status`    | ENUM("OPEN", "UNDER_REVIEW", "RESOLVED") | Current status of the report   |
| `createdAt` | DateTime (default: now())               | Timestamp when report was created |

### Car Brand Table
The CarBrand table stores unique car brands, ensuring that each brand is distinctly identified and linked to multiple models and listings.

| Field    | Type                 | Description                                    |
|----------|---------------------|------------------------------------------------|
| `id`     | Int (Primary Key)    | Unique identifier for each brand              |
| `name`   | String (Unique)      | Name of the car brand (e.g., "Toyota", "BMW") |
| `models` | Relation (CarModel)  | List of car models associated with this brand |
| `listings` | Relation (Listing) | Listings that belong to this car brand        |

### Car Model Table
The CarModel table stores vehicle models linked to specific car brands and their associated listings.

| Field     | Type                 | Description                                      |
|-----------|---------------------|--------------------------------------------------|
| `id`      | Int (Primary Key)    | Unique identifier for each car model            |
| `name`    | String               | Name of the car model (e.g., "Corolla", "X5")   |
| `brandId` | Int (Foreign Key → CarBrand) | ID of the associated car brand       |
| `brand`   | Relation (CarBrand)  | Reference to the parent car brand               |
| `listings` | Relation (Listing)  | Listings that belong to this car model          |



---

### Soft Delete System
Instead of permanently deleting records, we mark them as inactive.

- **For Vehicles:** Add `is_deleted` (Boolean) in the `Vehicle` table.  
- **For Messages:** Add `is_deleted` (Boolean) in the `Messaging` table.  

---

## 2. Database Scheme
![image](https://github.com/user-attachments/assets/ebd2ea3e-6e2c-4bf7-b833-7a24c4f007c5)

---

## 3. API Endpoints and CRUD

### Users
| Method  | Endpoint    | Description                           | Auth Required |
|---------|------------|--------------------------------------|--------------|
| `POST`  | `/auth/register` | Register a new user              | ❌ |
| `POST`  | `/auth/login` | Log in and get access token        | ❌ |
| `GET`   | `/users` | Retrieve all users                   | ❌ |
| `GET`   | `/users/me` | Get the authenticated user's profile | ✅ (Self) |
| `GET`   | `/users/{id}` | Get user details                   | ❌ |
| `PATCH` | `/users/{id}` | Soft delete user account           | ❌ |

---

### Listings (Vehicles)
| Method  | Endpoint                      | Description                                           | Auth Required |
|---------|--------------------------------|-------------------------------------------------------|--------------|
| `POST`  | `/listing`                     | Create a new vehicle listing                         | ✅ (Seller) |
| `GET`   | `/listing/user/{sellerId}`     | Get all listings created by a specific user          | ❌ |
| `GET`   | `/listing`                     | Get all vehicle listings (supports search filters)   | ❌ |
| `GET`   | `/listing/{id}`                | Get vehicle details                                  | ❌ |
| `GET`   | `/listing/brands`              | Get all available vehicle brands                     | ❌ |
| `GET`   | `/listing/brands/{brandId}/models` | Get all models for a specific brand              | ❌ |
| `PUT`   | `/listing/{id}`                | Update vehicle listing                               | ✅ (Owner) |
| `PATCH` | `/listing/{id}`                | Soft delete listing                                 | ✅ (Owner/Admin) |


#### **Search Filters for Listings**
- **Basic Filters Supported:**
  - `brand`
  - `minPrice` and `maxPrice`
  - `fuelType`
  - `transmission`
  - `sort`
  - `page`
  - `limit`
  
Example:  
`GET /listings?price_min=5000&price_max=20000&mileage_max=50000&fuel_type=petrol`

---

### Favorites
| Method  | Endpoint                         | Description                                   | Auth Required |
|---------|----------------------------------|-----------------------------------------------|--------------|
| `POST`  | `/favorites`                     | Save a vehicle to favorites                  | ✅ (User) |
| `GET`   | `/favorites`                     | Get all favorite listings of the authenticated user | ✅ (User) |
| `DELETE`| `/favorites`                     | Remove a saved listing from favorites        | ✅ (User) |
| `GET`   | `/favorites/count/{listingId}`   | Get the number of users who favorited a listing | ❌ |


---

### Messaging (Future Real-Time Support)
| Method | Endpoint | Description | Auth Required |
|--------|---------|-------------|--------------|
| `POST` | `/messages` | Send a message | ✅ (User) |
| `GET` | `/messages/{user_id}` | Get messages for a user | ✅ (Self) |
| `PATCH` | `/messages/{id}` | Soft delete a message (only for sender or receiver) | ✅ (Sender/Receiver) |

---

### Reports (Fraud/Disputes)
| Method | Endpoint | Description | Auth Required |
|--------|---------|-------------|--------------|
| `POST` | `/reports` | Report a listing for fraud or violations | ✅ (User) |
| `GET` | `/reports` | View all reports (admin only) | ✅ (Admin) |
| `PATCH` | `/reports/{reportId}` | Update report status (`OPEN`, `UNDER_REVIEW`, `RESOLVED`) | ✅ (Admin) |

---

### Vehicle Photos
Manages multiple photos for each vehicle listing.

| Method | Endpoint | Description | Auth Required |
|--------|---------|-------------|--------------|
| `POST` | `/listings/{id}/photos` | Upload a new vehicle photo | ✅ (Owner) |
| `GET` | `/listings/{id}/photos` | Retrieve all photos for a listing | ❌ |
| `DELETE` | `/listings/{id}/photos/{photo_id}` | Delete a photo from a listing | ✅ (Owner/Admin) |

---

## 2. Request/Response Format

---

## **User Authentication & Management**
### **POST /auth/register**
#### Request
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe",
  "phone_number": "+123456789"
}
```
#### Response
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com",
  "name": "John Doe",
  "phone_number": "+123456789",
  "created_at": "2025-02-01T12:00:00Z"
}
```

---

### **POST /auth/login**
#### Request
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```
#### Response
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "name": "John Doe",
    "phone_number": "+123456789",
    "role": "user",
    "created_at": "2025-02-01T12:00:00Z"
  }
}
```

---

### **GET /users/{id}**
#### Response
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com",
  "name": "John Doe",
  "phone_number": "+123456789",
  "role": "user",
  "created_at": "2025-02-01T12:00:00Z"
}
```

---

### **PUT /users/{id}**
#### Request
```json
{
  "name": "John Updated",
  "phone_number": "+987654321",
  "password": "newsecurepassword"
}
```
#### Response
```json
{
  "message": "User updated successfully"
}
```

---

### **PATCH /users/{id}**
#### Response
```json
{
  "message": "User account soft deleted"
}
```

---

## **Vehicle Listings**
### **POST /listings**
#### Request
```json
{
  "title": "Toyota Corolla 2020",
  "brand": "Toyota",
  "model": "Corolla",
  "price": 15000,
  "mileage": 30000,
  "year": 2020,
  "fuel_type": "Petrol",
  "transmission": "Automatic",
  "engine_power": 150,
  "drivetrain": "FWD",
  "color": "Black",
  "description": "Well-maintained, no accidents",
  "location": {
    "latitude": 37.7749,
    "longitude": -122.4194
  },
  "is_second_hand": true
}
```
#### Response
```json
{
  "listing_id": "abc123",
  "created_at": "2025-02-01T12:00:00Z"
}
```

---

### **GET /listings**
#### Response
```json
[
  {
    "listing_id": "abc123",
    "title": "Toyota Corolla 2020",
    "brand": "Toyota",
    "model": "Corolla",
    "price": 15000,
    "mileage": 30000,
    "year": 2020,
    "fuel_type": "Petrol",
    "transmission": "Automatic",
    "engine_power": 150,
    "color": "Black",
    "favorites_count": 12
  }
]
```

---

### **GET /listings/{id}**
#### Response
```json
{
  "listing_id": "abc123",
  "title": "Toyota Corolla 2020",
  "brand": "Toyota",
  "model": "Corolla",
  "price": 15000,
  "mileage": 30000,
  "year": 2020,
  "fuel_type": "Petrol",
  "transmission": "Automatic",
  "engine_power": 150,
  "drivetrain": "FWD",
  "color": "Black",
  "description": "Well-maintained, no accidents",
  "location": {
    "latitude": 37.7749,
    "longitude": -122.4194
  },
  "is_second_hand": true
}
```

---

### **PUT /listings/{id}**
#### Request
```json
{
  "title": "Toyota Corolla 2021",
  "price": 16000,
  "mileage": 25000,
  "color": "Blue",
  "description": "Recently serviced, excellent condition"
}
```
#### Response
```json
{
  "message": "Listing updated successfully"
}
```

---

### **PATCH /listings/{id}**
#### Response
```json
{
  "message": "Listing soft deleted"
}
```

---

## **Vehicle Photos**
### **POST /listings/{id}/photos**
#### Request
```json
{
  "photo_url": "https://s3.amazonaws.com/uploads/car_photo.jpg"
}
```
#### Response
```json
{
  "photo_id": "photo123",
  "listing_id": "abc123",
  "photo_url": "https://s3.amazonaws.com/uploads/car_photo.jpg",
  "created_at": "2025-02-01T14:30:00Z"
}
```

---

### **GET /listings/{id}/photos**
#### Response
```json
[
  {
    "photo_id": "photo123",
    "photo_url": "https://s3.amazonaws.com/uploads/car_photo.jpg"
  },
  {
    "photo_id": "photo124",
    "photo_url": "https://s3.amazonaws.com/uploads/car_photo_2.jpg"
  }
]
```

---

### **DELETE /listings/{id}/photos/{photo_id}**
#### Response
```json
{
  "message": "Photo deleted successfully"
}
```

---

## **Favorites**
### **POST /favorites**
#### Request
```json
{
  "listing_id": "abc123"
}
```
#### Response
```json
{
  "message": "Listing added to favorites"
}
```

---

### **GET /favorites**
#### Response
```json
[
  {
    "listing_id": "abc123",
    "title": "Toyota Corolla 2020",
    "price": 15000,
    "mileage": 30000
  },
  {
    "listing_id": "def456",
    "title": "Honda Civic 2019",
    "price": 14000,
    "mileage": 32000
  }
]
```

---

### **DELETE /favorites/{id}**
#### Response
```json
{
  "message": "Listing removed from favorites"
}
```

---

## **Messaging**
### **POST /messages**
#### Request
```json
{
  "sender_id": "user123",
  "receiver_id": "user456",
  "listing_id": "abc123",
  "content": "Hello, is this car still available?"
}
```
#### Response
```json
{
  "message_id": "msg789",
  "created_at": "2025-02-01T14:30:00Z"
}
```

---

## **Reports**
### **POST /reports**
#### Request
```json
{
  "listing_id": "abc123",
  "reason": "This listing is fraudulent"
}
```
#### Response
```json
{
  "report_id": "rep789",
  "message": "Report submitted successfully"
}
```

---

### **GET /reports**
#### Response
```json
[
  {
    "report_id": "rep789",
    "listing_id": "abc123",
    "reason": "This listing is fraudulent",
    "status": "open",
    "created_at": "2025-02-01T15:00:00Z"
  }
]
```


---

## 3. Authorization Needs

The API uses **JWT-based authentication** for secure access:

- **User authentication** via `Authorization: Bearer <token>`.
- **Role-based access control**:
  - **Users**: Can manage their own data and listings.
  - **Sellers**: Can create and edit their vehicle listings.
  - **Admins**: Can review reports and ban users if necessary.

---
