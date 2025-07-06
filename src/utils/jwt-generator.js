const jwt = require("jsonwebtoken");

const generateJWT =async (userId) => {
    const token = await jwt.sign({_id:userId},process.env.JWT_SECRET);
    return token;
}

module.exports = {
    generateJWT
}
   