const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50,
    },
    email: {
        type: String,
        trim: true, // trim --> space trim
        unique: 1,
    },
    password: {
        type: String,
        minlength: 5,
    },
    lastname: {
        type: String,
        maxlength: 50,
    },
    role: {
        type: Number,
        default: 0,
    },
    image: String,
    token: {
        type: String,
    },
    tokenExp: {
        type: String,
    },
});

userSchema.pre('save', function (next) {
    let user = this;

    if (user.isModified('password')) {
        // make password encryption
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err);

            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err);
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
    // plainPassword === encryption password
    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

userSchema.methods.generateToken = function (cb) {
    let user = this;

    // use jsonwebtoken
    let token = jwt.sign(user._id.toHexString(), 'secretToken');

    user.token = token;
    user.save(function (err, user) {
        if (err) return cb(err);
        cb(null, user);
    });
};

userSchema.statics.findByToken = (token, cb) => {
    let user = this;

    // decode token
    jwt.verify(token, 'secretToken', (err, decoded) => {
        // client token  === database token
        user.findOne({ _id: decoded, token: token }, (err, user) => {
            if (err) return cb(err);
            cb(null, user);
        });
    });
};

const User = mongoose.model('User', userSchema);

module.exports = { User };
