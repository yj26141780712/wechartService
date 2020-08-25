let express = require('express');
let router = express.Router();
let roleDao = require('../dao/roleDao');
let result = require('../model/result');
let auth = require('../api/auth');

router.post('/create', auth, (req, res) => {
    var role = req.body;
    roleDao.create(role, success => {
        if (success) {
            res.json(result.createResult(200, 'ok', role));
        } else {
            res.json(result.createResult(200, '角色创建失败'));
        }
    });
});

router.get('/delete', auth, (req, res) => {
    const id = req.query.id;
    if (id == 5) {
        res.json(result.createResult(500, '超级管理员角色不能删除！'));
        return;
    }
    roleDao.delete(id, success => {
        if (success) {
            res.json(result.createResult(200, 'ok'));
        } else {
            res.json(result.createResult(500, '删除失败，角色不存在！'));
        }
    });
});

// router.post('/batchDelete', auth, (req, res) => {
//     const ids = req.body.ids;
//     roleDao.batchDelete(ids, (err) => {
//         if (!err) {
//             res.json(result.createResult(200, 'ok'));
//         } else {
//             res.json(result.createResult(500, '批量删除失败，' + err));
//         }
//     });
// });

router.post('/update', auth, (req, res) => {
    const role = req.body;
    roleDao.update(role, success => {
        if (success) {
            res.json(result.createResult(200, 'ok'));
        } else {
            res.json(result.createResult(500, '更新失败，角色不存在！'));
        }
    })
});

router.get('/list', auth, (req, res) => {
    const roleId = req.decoded && req.decoded.roleId;
    roleDao.list(roles => {
        if (roleId !== 5) { // 超级管理员角色对其他不可见
            roles = roles.filter(r => r.id !== 5);
        }
        res.json(result.createResult(200, 'ok', roles));
    });
});

router.get('/menuList', auth, (req, res) => {
    const roleId = req.query.roleId;
    roleDao.getMenusById(roleId, menus => {
        res.json(result.createResult(200, 'ok', menus));
    })
});

router.post('/allotMenu', auth, (req, res) => {
    const roleId = req.body.roleId;
    const menuIds = req.body.menuIds;
    roleDao.setMenusById(roleId, menuIds, err => {
        if (!err) {
            res.json(result.createResult(200, 'ok'));
        } else {
            res.json(result.createResult(500, '分配菜单失败，' + err));
        }
    })
});

module.exports = router;