let express = require('express');
let router = express.Router();
let auth = require('../api/auth');
let serieDao = require('../dao/serieDao');
let result = require('../model/result');
let file = require('../api/file');

router.post('/create', auth, (req, res) => {
    const serie = req.body;
    serieDao.create(serie, (success, id) => {
        if (success) {
            res.json(result.createResult(200, 'ok', { ...serie, id }));
        } else {
            res.json(result.createResult(500, '创建系列失败！'));
        }
    });
});

router.get('/delete', auth, (req, res) => {
    const id = req.query.id;
    const deleteChildren = req.query.deleteChildren;
    serieDao.delete(id, deleteChildren === 'true', err => {
        if (!err) {
            if (deleteChildren) {
                serieDao.actionList(id, actions => {
                    const actionIds = actions.map(a => a.id);
                    actionIds.forEach(actionId => {
                        const path = './upload/action/' + actionId + '';
                        file.delDir(path);
                    })
                })
            }
            res.json(result.createResult(200, 'ok'));
        } else {
            res.json(result.createResult(500, '删除系列失败，' + err));
        }
    });
});

router.post('/batchDelete', auth, (req, res) => {
    const ids = req.body.ids;
    serieDao.batchDelete(ids, err => {
        if (!err) {
            res.json(result.createResult(200, 'ok'));
        } else {
            res.json(result.createResult(500, '批量删除系列失败，' + err));
        }
    });
});

router.post('/update', auth, (req, res) => {
    const serie = req.body;
    serieDao.update(serie, success => {
        if (success) {
            res.json(result.createResult(200, 'ok', { serie }));
        } else {
            res.json(result.createResult(500, '更新系列失败！'));
        }
    });
});

router.get('/list', auth, (req, res) => {
    serieDao.list(series => {
        res.json(result.createResult(200, 'ok', series));
    })
});

module.exports = router;