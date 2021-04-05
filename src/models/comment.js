const mongoose = require('mongoose');


const Comment = mongoose.model('Comment', {
    user: {
        type: mongoose.ObjectId,
        required: true,
        ref: 'User'
    },
    postId: {
        type: mongoose.ObjectId,
        required: true,
    },
    content: {
        type: String
    },
    createdAt: {
        type: Date,
        default: () => new Date(),
        required: true
    }
});

module.exports = Comment;