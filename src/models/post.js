const mongoose = require('mongoose');


const Post = mongoose.model('Post', {
    user: {
        type: mongoose.ObjectId,
        required: true,
        ref: 'User'
    },
    description: {
        type: String
    },
    image: {
        type: String,
        required: true
    },
    likes: [mongoose.ObjectId],
    north: {
        type: String
    },
    east: {
        type: String
    },
    createdAt: {
        type: Date,
        default: () => new Date(),
        required: true
    }
});

module.exports = Post;
