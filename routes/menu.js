let express = require('express');
let router = express.Router();
let auth = require('../api/auth');
let menuDao = require('../dao/menuDao');
let result = require('../model/result')

router.post('/create', auth, (req, res) => {
    const menu = req.body;
    menuDao.create(menu, success => {
        if (success) {
            res.json(result.createResult(200, 'ok'));
        } else {
            res.json(result.createResult(500, '菜单创建失败！'));
        }
    });
});

router.get('/delete', auth, (req, res) => {
    const id = req.query.id;
    menuDao.delete(id, success => {
        if (success) {
            res.json(result.createResult(200, 'ok'));
        } else {
            res.json(result.createResult(500, '菜单删除失败，菜单不存在！'))
        }
    });
});

router.post('/batchDelete', auth, (req, res) => {
    const ids = req.body.ids;
    menuDao.batchDelete(ids, err => {
        if (!err) {
            res.json(result.createResult(200, 'ok'));
        } else {
            res.json(result.createResult(500, '批量删除失败，' + err));
        }
    })
});

router.post('/update', auth, (req, res) => {
    const menu = req.body;
    menuDao.update(menu, success => {
        if (success) {
            res.json(result.createResult(200, 'ok'));
        } else {
            res.json(result.createResult(500, '菜单更新失败，菜单不存在'))
        }
    });
});

router.get('/list', auth, (req, res) => {
    const roleId = req.decoded && req.decoded.roleId;
    menuDao.list(menus => {
        if (roleId !== 5) { //菜单管理只对超级管理员可见
            menus = menus.filter(m => m.id !== 5);
        }
        res.json(result.createResult(200, 'ok', menus));
    })
});

module.exports = router;