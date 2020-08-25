const jwt = require("jsonwebtoken");
const refreshSecret = "refreshAABBCCDDEEFFGG20200707";
const secret = "AABB20200707";

createRefreshToken = (payload) => {
    return jwt.sign(payload, refreshSecret, {
        expiresIn: '1440h'
    });
}

checkRefreshToken = (refreshToken) => {
    return new Promise((resolve, reject) => {
        jwt.verify(refreshToken, refreshSecret, (err, res) => {
            if (!err) {
                resolve(res)
            } else {
                reject("长token验证失败");
            }
        })
    })
}

createToken = (payload) => {
    return jwt.sign(payload, secret, {
        expiresIn: '2h'
    });
}

checkToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, res) => {
            console.log(err);
            if (!err) {
                resolve(res)
            } else {
                reject("token验证失败");
            }
        })
    })
}


module.exports = {
    createRefreshToken,
    checkRefreshToken,
    createToken,
    checkToken
}