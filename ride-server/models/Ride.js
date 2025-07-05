import mongoose from "mongoose";

const rideSchema = new mongoose.Schema({
    passengerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        //only required when the ride is in progress or completed
    },
    pickupLocation: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 255
    },
    dropoffLocation: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 255
    },
    status: {
        type: String,
        enum: ['requested', 'in-progress', 'completed', 'cancelled'],
        default: 'requested'
    },
    fare: {
        type: Number,
        required: true,
        min: 0,
        default: 100,
    },
    distance: {
        type: Number,
        required: true,
        min: 0,
        default: 1000 // in meters
    },
    type: {
        type: String,
        enum: ['Bike', 'Car', 'Rickshaw'],
        required: true
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
}, {
    timestamps: true
});

export const Ride = mongoose.model('Ride', rideSchema, 'Ride');