import express from 'express';

//User controllers
import { registerUser, loginUser, getUserProfile, deleteUser } from '../controllers/UserController.js';

//Ride controllers
import {
    requestRide,
    updateRideStatus,
    getLatestRides,
    getPassengerRideHistory,
    getDriverRideHistory,
    getDriverAvailableRides,
    getRideById,
    deleteRide
} from '../controllers/RideController.js';

const userRouter = express.Router();
const rideRouter = express.Router();

// User routes
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/profile', getUserProfile);
userRouter.delete('/delete', deleteUser);

// Ride routes
rideRouter.post('/request', requestRide);
rideRouter.post('/updateStatus', updateRideStatus);
rideRouter.get('/latest', getLatestRides);
rideRouter.get('/passengerHistory', getPassengerRideHistory);
rideRouter.get('/driverHistory', getDriverRideHistory);
rideRouter.get('/driverAvailable', getDriverAvailableRides);
rideRouter.get('/getById', getRideById);
rideRouter.delete('/delete', deleteRide);


export { userRouter, rideRouter };