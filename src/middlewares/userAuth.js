const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuth = async (req, res, next) => {
    try{
        const cookies = req.cookies;
    const { token } = cookies;
    if (!token) {
        throw new Error("Invalid Token");
    }
    const decoded = await jwt.verify(token, "scretfesfKey");
    const { _id } = decoded;
    const user = await User.findById(_id);
    if (!user) {
        throw new Error("User not found");
    }
    req.user = user;
    next();
    }catch(err){
        console.log(err);
        return res.status(400).send(err.message);
    }
};

module.exports = { userAuth };
