const jwt = require('jsonwebtoken')
const secret = "rahasia"

const userToken = (payload) => {
    return jwt.sign(payload, secret)
}

const verifyToken = (token) => {
    return jwt.verify(token, secret)
}

module.exports = {
    userToken,
    verifyToken
}