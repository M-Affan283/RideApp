# Jeeny: Ride Sharing Application

## Introduction

This is a simple React based web app for the second Jeeny case study. The tech stack used was MERN (Mongo, Express, React, Node) due to its flexibility, scalability and speed of development.

## Project Structure

```
README.md
ride-app/                   # Frontend React application
    eslint.config.js        # ESLint configuration
    index.html              # HTML entry point
    package.json            # Frontend dependencies
    postcss.config.js       # PostCSS configuration
    README.md               # Frontend-specific documentation
    tailwind.config.js      # Tailwind CSS configuration
    vite.config.js          # Vite build configuration
    public/                 # Static assets
        vite.svg
    src/
        App.jsx             # Main application component
        index.css           # Global styles
        main.jsx            # Application entry point
        assets/             # Images and other assets
            main.svg
            react.svg
        components/         # UI components
            auth/           # Authentication components
                LoginForm.jsx
                RegisterForm.jsx
            layout/         # Layout components
                Footer.jsx
                NavBar.jsx
            ride/           # Ride-related components
                AvailableRidesTable.jsx
                DriverDashboardBody.jsx
                PassengerDashboardBody.jsx
                RequestRideForm.jsx
                RideHistoryTable.jsx
        context/            # Application state management
            store.js
        pages/              # Application pages
            auth/           # Authentication pages
                login.jsx
                register.jsx
            ride/           # Ride-related pages
                driver/     # Driver-specific pages
                    available.jsx
                    dashboard.jsx
                    history.jsx
                passenger/  # Passenger-specific pages
                    dashboard.jsx
                    history.jsx
                    request.jsx
        utils/              # Utility functions
            api.js          # API integration utilities
ride-server/               # Backend Node.js/Express server
    app.js                 # Express application setup
    config.env             # Environment variables
    package.json           # Backend dependencies
    server.js              # Server entry point
    controllers/           # Request handlers
        RideController.js  # Ride-related operations
        UserController.js  # User-related operations
    models/                # Database schemas
        Ride.js            # Ride data model
        User.js            # User data model
    routes/                # API route definitions
        routes.js          # API endpoints
```

## Backend (ride-server)

### Technologies Used

- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB/Mongoose** - Database and ODM
- **Dotenv** - Environment variable management
- **CORS** - Cross-Origin Resource Sharing
- **Morgan** - HTTP request logger middleware

### Features Implemented

1. **User Authentication**

   - User registration and login functionality
   - User role management (driver/passenger)

2. **Ride Management**

   - Create ride requests
   - Accept/reject ride requests
   - Complete rides

3. **User Management**

   - User profile creation and updates

4. **Data Persistence**

   - MongoDB integration with Mongoose models
   - Structured data schemas for users and rides

5. **RESTful API**
   - Clean and well-organized API endpoints
   - Proper error handling and responses
   - Resource-based URL structure

## Frontend (ride-app)

### Technologies Used

- **React** - Javascript Library
- **Vite** - Build tool
- **React Router** - Routing
- **Zustand** - State management
- **Axios** - HTTP client
- **Tailwind CSS** - CSS framework
- **Lucide React** - Icon set
- **HeroUI** - UI component library

### Features Implemented

1. **Authentication**

   - User login and registration pages
   - Form validation
   - Authentication state management
   - Protected routes access management

2. **Driver Features**

   - Driver dashboard displaying latest ride
   - Available rides list for accepting new rides
   - Ride history with completed rides
   - Ride status management (Accept/Reject/Complete)

3. **Passenger Features**

   - Passenger dashboard displaying latest ride
   - Ride request form for creating new ride requests
   - Ride history with past rides

4. **UI/UX**

   - Responsive design for all screen sizes
   - Modern and clean user interface
   - Simple navigation with navbar and footer
   - Loading states and error handling via toast messages.

5. **State Management**
   - Centralized state using Zustand
   - Persistent login state
   - Access to logged user data

## Getting Started

### Backend Setup

1. Navigate to the server directory:

   ```bash
   cd ride-server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `config.env` file with the following variables:

   ```
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   ```

4. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the app directory:

   ```bash
   cd ride-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Database Schemas

### User Schema

The User schema defines the structure for user data in the application:

**Key Features:**

- Unique identifiers for each user (`_id` and `email`)
- Role-based access control (passenger/driver)
- Security measures like password exclusion from queries
- Timestamp for user creation

### Ride Schema

The Ride schema defines the structure for ride data in the application:

**Key Features:**

- Unique ride identifier (`_id`)
- References to both passenger and driver (relationships with User model)
- Status tracking throughout the ride lifecycle
- Location data for pickup and dropoff points
- Financial tracking (fare)
- Distance metrics (estimated)
- Type of automobile used (Bike, Car, Rickshaw)

## API Endpoints

### Authentication

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - User login


### Rides

- `POST /api/rides/request` - Request a ride
- `POST /api/rides/updateStatus` - Update ride rtatus
- `GET /api/rides/latest` - Get latest ride
- `GET /api/rides/passengerHistory` - Get passenger history
- `GET /api/rides/driverHistory` - Get driver history
- `GET /api/rides/driverAvailable` - Get available rides
- `GET /api/rides/getById` - Get a specific ride
- `DELETE /api/rides/delete` - Delete a ride

### Users

- `GET /api/users/profile` - User profile data
- `DELETE /api/users/delete` - Delete account

## Assumptions

- Currently the system assumes that if one driver rejects a request then other drivers cannot take up that request anymore.
- The distance and fare calculated are randomly generated in the backend.
- The system assumes a passenger cannot be a driver and vice versa.
- They system assumes all available drivers are withing the passenger's vicinity.


## Future Improvements

The following improvements could be made to the application:

- A complete rating system, where a passenger can give a rating out of stars to the driver and leave a comment.
- A better mathematical model to calculate distance between pickup and dropoff locations and calculate the fare.
- Realtime ride requests handling, where drivers will be able to see incoming rides immediately upon request generation without having to refresh the page. This can be done via sockets. Users will also be able to view their request status in realtime.
- A better timing mechanism for ride requests for when a single driver rejects a request.
- Ability to send request to other drivers if another driver rejects it.
- An in built wallet system for online payments or to deposit change.
- Ability to switch between passenger and driver roles and update UI accordingly.
- Ability to update user profile, especially for drivers.
- Integration of a maps API for more accurate location handling.
- Generation and storage of receipts for passenger upon ride completion.


Link to Video Demonstration:
https://drive.google.com/file/d/1r-JcaYEfMtti5MAGIo26rqlRWgSGboQy/view?usp=sharing