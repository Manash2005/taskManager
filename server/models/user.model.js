const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    profile_picture: {
        url: {
            type: String,
            default: "https://ik.imagekit.io/sodiumimages/taskManager/users/default.jpg"
        },
        fileId: {
            type: String,
            default: null
        }
    },

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    phone: {
        type: Number,
        default: 1234567890
    },

    password: {
        type: String,
        required: false // Optional for OAuth users
    },

    googleId: {
        type: String,
        unique: true,
        sparse: true // Allows null values but keeps uniqueness
    },

    authProvider: {
        type: String,
        enum: ['local', 'google'],
        default: 'local'
    }

}, { timestamps: true })

const userModel = mongoose.model("user", userSchema)

module.exports = userModel