let express = require('express');
let router = express.Router();
let auth = require('../api/auth');
let modelDao = require('../dao/modelDao');
let result = require('../model/result');

router.post('/create', auth, (req, res) => {
    const model = req.body;
    modelDao.create(model, success => {
        if (success) {
            res.json(result.createResult(200, 'ok'));
        } else {
            res.json(result.createResult(500, '机型创建失败！'));
        }
    });
});

router.get('/delete', auth, (req, res) => {
    const id = req.query.id;
    modelDao.delete(id, success => {
        if (success) {
            res.json(result.createResult(200, 'ok'));
        } else {
            res.json(result.createResult(500, '机型删除失败,机型不存在！'))
        }
    });
});

router.post('/batchDelete', auth, (req, res) => {
    const ids = req.body.ids;
    modelDao.batchDelete(ids, err => {
        if (!err) {
            res.json(result.createResult(200, 'ok'));
        } else {
            res.json(result.createResult(500, '批量删除失败，' + err));
        }
    });
});

router.post('/update', auth, (req, res) => {
    const model = req.body;
    modelDao.update(model, success => {
        if (success) {
            res.json(result.createResult(200, 'ok'));
        } else {
            res.json(result.createResult(500, '机型更新失败,机型不存在！'));
        }
    });
});

router.get('/list', auth, (req, res) => {
    modelDao.list(models => {
        res.json(result.createResult(200, 'ok', models));
    })
});

module.exports = router;