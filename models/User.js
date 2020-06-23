const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    picture: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
})

module.exports.toJSON = function (obj) {
    var obj = this.toObject()
    delete obj.password
    return obj
}

module.exports = mongoose.model("User", UserSchema);