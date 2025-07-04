const jwt = require("jsonwebtoken");

const generateJWT =async (userId) => {
    const token = await jwt.sign({_id:userId},"secretfesKey");
    return token;
}

module.exports = {
    generateJWT
}
   