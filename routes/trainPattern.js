let express = require('express');
let router = express.Router();
let auth = require('../api/auth');
let tpDao = require('../dao/trainPatternDao');
let result = require('../model/result');

router.post('/create', auth, (req, res) => {
    const tp = req.body;
    tpDao.create(tp, success => {
        if (success) {
            res.json(result.createResult(200, 'ok'));
        } else {
            res.json(result.createResult(500, '训练模式创建失败！'));
        }
    });
});

router.get('/delete', auth, (req, res) => {
    const id = req.query.id;
    tpDao.delete(id, success => {
        if (success) {
            res.json(result.createResult(200, 'ok'));
        } else {
            res.json(result.createResult(500, '训练模式删除失败，训练模式不存在'));
        }
    })
})

router.post('/batchDelete', auth, (req, res) => {
    const ids = req.body.ids;
    tpDao.batchDelete(ids, err => {
        if (!err) {
            res.json(result.createResult(200, 'ok'));
        } else {
            res.json(result.createResult(500, '训练模式批量删除失败，' + err))
        }
    });
});

router.post('/update', auth, (req, res) => {
    const tp = req.body;
    tpDao.update(tp, success => {
        if (success) {
            res.json(result.createResult(200, 'ok'));
        } else {
            res.json(result.createResult(500, '训练模式更新失败，训练模式不存在！'))
        }
    });
});

router.get('/list', auth, (req, res) => {
    tpDao.list(tps => {
        res.json(result.createResult(200, 'ok', tps));
    })
});

router.post('/setParams', auth, (req, res) => {
    const tpId = req.body.id;
    const params = req.body.params;
    tpDao.setParams(tpId, params, success => {
        if (success) {
            res.json(result.createResult(200, 'ok'));
        } else {
            res.json(result.createResult(500, '参数保存失败!'));
        }
    });
});

router.get('/getParams', auth, (req, res) => {
    const tpId = req.query.id;
    tpDao.getParams(tpId, params => {
        res.json(result.createResult(200, 'ok', params));
    })
});

module.exports = router;