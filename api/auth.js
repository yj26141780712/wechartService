let result = require('../model/result');
var jwt = require('./jwt');

module.exports = (req, res, next) => {
    var token = req.body.token || req.query.token || req.headers['token']
    if (token) {
        jwt.checkToken(token).then(data => {
            if (data) {
                req.decoded = data
                next()
            }
            else {
                res.json(result.createResult(502, '无效token'));
            }
        }, err => {
            console.log(err);
            res.json(result.createResult(502, '无效token'));
        })
    }
    else {
        res.json(result.createResult(502, '没有传token'));
    }
}

