const mongoose = require('mongoose');
const { Schema } = mongoose;
const todoSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId, // Reference to the user who owns this todo
        ref: 'signUp',
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed'], // Allows only these statuses
        default: 'Pending',
    },
    dueDate: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Todo', todoSchema);
