import mongoose from "mongoose";

const userChema = new mongoose.Schema({
    username: {
        type:String,
        required: true,
        unique: true,
    }, 
    email: {
        type:String,
        required: true,
        unique: true,
    }, 
    password: {
        type:String,
        required: true,
    }, 
    avatar: {
        type:String,
        default: 'https://th.bing.com/th/id/R.8359b42bbcae99fc2473fb9bdb6e1ae0?rik=FdiaSrRDfG9mAQ&pid=ImgRaw&r=0'
    },
}, {timestamps: true});

const User = mongoose.model('User', userChema);

export default User;

