const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:2,
        maxLength:50,
    },
    lastName:{
        type:String,
        required:true,
        minLength:2,
        maxLength:70,
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email format');
            }
        }
    },
    password:{
        type:String,
        required:true,
    },
    age:{
        type:Number,
        min:18,
        required:true,
    },
    gender:{
        type:String,
        validate(value){
            if(!['male', 'female', 'other'].includes(value.toLowerCase())) {
                throw new Error('Invalid gender');
            }
        },
        required:true,
    },
    photoUrl:{
        type:String,
        default:"https://www.google.com/imgres?q=profilephoto%20free&imgurl=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fthumbnails%2F001%2F840%2F612%2Fsmall%2Fpicture-profile-icon-male-icon-human-or-people-sign-and-symbol-free-vector.jpg&imgrefurl=https%3A%2F%2Fwww.vecteezy.com%2Ffree-vector%2Fprofile-photo&docid=_BtE_WxMKR_8tM&tbnid=8pGvxLQw8lQaMM&vet=12ahUKEwiWxMD8nKGOAxXPhK8BHTIoCMUQM3oECGUQAA..i&w=200&h=200&hcb=2&ved=2ahUKEwiWxMD8nKGOAxXPhK8BHTIoCMUQM3oECGUQAA",
    },
    about:{
        type:String,
        default:"No information provided",
    },
    skills:{
        type:[String],
        default:[],
    },
    isPremium:{
        type:Boolean,
        default:false,
    },
    memberShipType:{
        type:String,
        default:"free",
    }
},{
    timestamps:true,
})

userSchema.methods.validatePassword = async function(passwordInput){
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(passwordInput, passwordHash);
    return isPasswordValid;
}

module.exports = mongoose.model('User', userSchema);