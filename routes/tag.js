let express = require('express');
let router = express.Router();
let auth = require('../api/auth');
let tagDao = require('../dao/tagDao');
let result = require('../model/result');
let other = require('../api/other');

router.post('/create', auth, (req, res) => {
  const tag = req.body;
  tagDao.create(tag, (success, insertId) => {
    if (success) {
      res.json(result.createResult(200, 'ok', insertId));
    } else {
      res.json(result.createResult(500, '标签创建失败！'));
    }
  });
});

router.get('/delete', auth, (req, res) => {
  const id = req.query.id;
  tagDao.delete(id, success => {
    if (success) {
      res.json(result.createResult(200, 'ok'));
    } else {
      res.json(result.createResult(500, '标签删除失败！'));
    }
  });
});

router.post('/batchDelete', auth, (req, res) => {
  const ids = req.body.ids;
  tagDao.batchDelete(ids, err => {
    if (!err) {
      res.json(result.createResult(200, 'ok'));
    } else {
      res.json(result.createResult(500, '标签批量删除失败'));
    }
  });
});

router.post('/update', auth, (req, res) => {
  const tag = req.body;
  tagDao.update(tag, success => {
    if (success) {
      res.json(result.createResult(200, 'ok'));
    } else {
      res.json(result.createResult(500, '标签更新失败！'));
    }
  });
});

router.get('/list', auth, (req, res) => {
  tagDao.list(tags => {
    res.json(result.createResult(200, 'ok', tags));
  })
});

router.get('/partList', auth, (req, res) => {
  const parentId = 10;
  tagDao.listByParenId(parentId, tags => {
    res.json(result.createResult(200, 'ok', tags));
  });
});

router.get('/specialList', auth, (req, res) => {
  const parentId = 11;
  tagDao.listByParenId(parentId, tags => {
    res.json(result.createResult(200, 'ok', tags));
  });
});

router.get('/listToPanel', auth, (req, res) => {
  tagDao.list(tags => {
    const tree = other.getTagTree(tags);
    other.removeTagsAttr(tree);
    res.json(result.createResult(200, 'ok', tree));
  })
});

router.get('/list', auth, (req, res) => {

});

module.exports = router;