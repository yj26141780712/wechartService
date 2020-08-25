let express = require('express');
let router = express.Router();
let userD = require('../dao/userDao');
let result = require('../model/result');
let jwt = require('../api/jwt');
let auth = require('../api/auth');

/* user detail */
router.get('/detail', auth, (req, res) => {
    console.log('user detail called');
    const id = req.query.id;
    userD.getById(id, (user) => {
        res.json(result.createResult(200, 'ok', user));
    });
});

/* list users */
router.get('/list', auth, (req, res) => {
    console.log('list users called');
    userD.list((users) => {
        res.json(result.createResult(200, 'ok', users));
    });
});

/* delete user */
router.get('/delete', auth, function (req, res) {
    const id = req.query.id;
    console.log('delete user called', id);
    userD.deleteById(id, (success) => {
        if (success) {
            res.json(result.createResult(200, 'ok', null));
        } else {
            res.json(result.createResult(500, '删除失败！', null));
        }
    });
});

router.post('/batchDelete', auth, function (req, res) {
    const ids = req.body.ids;
    userD.batchDelete(ids, err => {
        if (!err) {
            res.json(result.createResult(200, 'ok'));
        } else {
            res.json(result.createResult(500, '批量删除失败，' + err));
        }
    })
});

/* create user */
router.post('/create', auth, function (req, res) {
    var user = req.body;
    userD.create(user, success => {
        if (success) {
            var r = result.createResult(200, 'ok', user);
            res.json(r);
        }
    });
});

router.post('/update', auth, (req, res) => {
    const user = req.body;
    userD.update(user, success => {
        if (success) {
            res.json(result.createResult(200, 'ok'));
        } else {
            res.json(result.createResult(500, '用户更新失败,用户不存在！'));
        }
    })
})

router.get('/login', (req, res) => {
    const { username, password } = req.query;
    userD.checkUser({ username, password }, user => {
        if (user) { // 账号密码验证成功
            //生成长短token;
            const stoken = jwt.createToken({ ...user });
            const ltoken = jwt.createRefreshToken({ ...user });
            res.json(result.createResult(200, 'ok', { ...user, stoken, ltoken }));
        } else {
            res.json(result.createResult(500, '用户名或者密码错误！'));
        }
    })
})

router.get('/refreshToken', (req, res) => {
    const lToken = req.query.lToken;
    if (lToken) {
        jwt.checkRefreshToken(lToken).then((data) => {
            const stoken = jwt.createToken({
                username: data.username,
                name: data.name,
                roleId: data.roleId
            });
            res.json(result.createResult(200, 'ok', stoken));
        }, err => {
            res.json(result.createResult(500, '刷新token失败,' + err));
        });
    } else {
        res.json(result.createResult(500, '没有传长token！'));
    }
});

module.exports = router;