import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String, 
            required: true,
        },
        email: {
            type: String, 
            required: true,
        },
        telephone: {
            type: String,
            required: true,
        },
        checkInDay: {
            type: Date,
            required: true, 
        },
        checkOutDay: {
            type: Date,
            required: true,
        },
        length: {
            type: Number,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        rooms: {
            type: Number,
            required: true,
        },
        guests: {
            type: Number,
            required: true,
        },
        userRef: {
            type: String,
            required: true,
        },
        placeName: {
            type: String, 
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        imageUrls: {
            type: Array,
            required: true,
        },
    }, {timestamps: true}
)

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;