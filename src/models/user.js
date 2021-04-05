const mongoose = require('mongoose');
const emailValidate = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;



const User = mongoose.model('User', {
    username: {
        type: String,
        unique: true,
        required: true,
        minLength: 3,
        maxLength: 16
    },
    password: {
        type: String,
        required: true,
        unique: true,
        minLength: 8
    },
    email: {
        type: String,
        required: true,
        match: emailValidate
    },
    createdAt: {
        type: Date,
        default: () => new Date(),
        required: true
    },
    avatar: {
        type: String,
    },
    followers: [mongoose.ObjectId],
    bio: {
        type: String,
        maxLength: 800
    }
});


module.exports = User;

