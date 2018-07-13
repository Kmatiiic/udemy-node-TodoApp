const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true,
        minlength: 1,
        trim: true,
        //verfies the that email is not the same as any other email in the collection
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        },
    },
    password: {
            type: String,
            require: true,
            minlength: 6
    },
    tokens: [{
        access: {
            type: String,
             require: true
        },
        token: {
            type: String,
            require: true
        }
    }]
});

UserSchema.methods.toJSON = function () {
    var userObject = this.toObject();

    return _.pick(userObject, ['_id', 'email']);
};

//methods that belong to instances of User
UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, 'secval');

    user.tokens.push({access,token});

    return user.save().then(function () {
        return token;
    });
};

//statics belong to the model
UserSchema.statics.findByToken = function (token) {
    var decoded;

    try {
        //returns decoded user
        decoded = jwt.verify(token, 'secval');
    } catch (e) {
        // return new Promise(function (resolve,reject) {
        //     reject();
        // });
        return Promise.reject();
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    }); 
};

var User = mongoose.model('User', UserSchema);

module.exports = {User};