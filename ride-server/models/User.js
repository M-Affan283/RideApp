import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 100
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 1024
    },
    type: {
        type: String,
        enum: ['driver', 'passenger'],
        required: true
    },
}, 
{
    timestamps: true
});

export const User = mongoose.model('User', userSchema, 'User');