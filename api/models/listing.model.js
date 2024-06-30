import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        user: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            default: 0,
        },
        comment: {
            type: String,
        },
    }, {timestamps: true}
)

const listingSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        type: {
            type: String, 
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        address: {
            type: String, 
            required: true,
        },
        regularPrice: {
            type: Number,
            required: true,
        },
        discountPrice: {
            type: Number,
            required: true,
        },
        smoking: {
            type: Boolean,
            required: true,
        },
        bar: {
            type: Boolean,
            required: true,
        }, 
        wifi: {
            type: Boolean,
            required: true,
        },
        parking: {
            type: Boolean,
            required: true,
        },
        offer: {
            type: Boolean,
            required: true,
        },
        imageUrls: {
            type: Array,
            required: true,
        },
        userRef: {
            type: String,
            required: true,
        },
        reviews: [reviewSchema],
        ratings: {
            type: Number,
            default: 0,
        },
        numReviews: {
            type: Number,
            default: 0,
        },

    }, {timestamps: true}
)

const Listing = mongoose.model('Listing', listingSchema);
export default Listing;