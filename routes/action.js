let express = require('express');
let router = express.Router();
let auth = require('../api/auth');
let actionDao = require('../dao/actionDao');
let tagDao = require('../dao/tagDao');
let result = require('../model/result');
let file = require('../api/file');
let uuid = require('node-uuid');
// let compressing = require('../api/compressing');
let archiver = require('../api/archiver');
let other = require('../api/other');

router.post('/create', auth, (req, res) => {
    const username = req.decoded && req.decoded.username;
    const action = req.body;
    const uuidName = uuid.v4() + '.html'
    action.createPerson = action.modifyPerson = username;
    action.guideHtml = uuidName;
    actionDao.create(action, (success, id) => {
        if (success) {
            // 在upload/action/ 下创建id文件夹  生成html文件 并将压缩图片移动到改
            const path = './upload/action/' + id + '/';
            file.createPath(path).then(() => {
                const filename = path + uuidName;
                file.createHtml('', filename, action.guide).then(() => {
                    const images = action.images ? action.images.split(',') : [];
                    const compressPath = './upload/compress/';
                    const oldPath = './upload/old/';
                    file.moveImages(compressPath, path, images);
                    file.deleteImages(compressPath, []); //删除压缩文件图片
                    file.deleteImages(oldPath, []); //删除原图文件图片
                    res.json(result.createResult(200, 'ok', { ...action, id }));
                }, err => {
                    //删除该动作
                    res.json(result.createResult(500, '动作指导文件生成失败,' + err));
                })
            }, err => {
                //删除该动作
                res.json(result.createResult(500, '动作文件夹生成失败,' + err));
            });
        } else {
            res.json(result.createResult(500, '动作创建失败！'));
        }
    });
});

router.get('/delete', auth, (req, res) => {
    const id = req.query.id;
    actionDao.delete(id, success => {
        if (success) {
            const path = './upload/action/' + id + '';
            file.delDir(path);
            res.json(result.createResult(200, 'ok'));
        } else {
            res.json(result.createResult(500, '动作删除失败！'));
        }
    })
});

router.post('/batchDelete', auth, (req, res) => {
    const ids = req.body.ids;
    actionDao.batchDelete(ids, err => {
        if (!err) {
            res.json(result.createResult(200, 'ok'));
        } else {
            res.json(result.createResult(500, '动作批量删除成功！'));
        }
    })
});

router.post('/update', auth, (req, res) => {
    const username = req.decoded && req.decoded.username;
    const action = req.body;
    action.modifyPerson = username;
    const oldHtml = action.guideHtml;
    const uuidName = uuid.v4() + '.html'
    action.guideHtml = uuidName;
    actionDao.update(action, success => {
        if (success) {
            const path = './upload/action/' + action.id + '/';
            const oldFilename = path + oldHtml;
            const filename = path + uuidName;
            file.createHtml(oldFilename, filename, action.guide).then(() => {
                const images = action.images ? action.images.split(',') : [];
                const compressPath = './upload/compress/';
                const oldPath = './upload/old/';
                file.deleteImages(path, images); // 删除旧的图片
                file.moveImages(compressPath, path, images); //转移图片到动作文件夹
                file.deleteImages(compressPath, []); //删除压缩文件图片
                file.deleteImages(oldPath, []); //删除原图文件图片
                res.json(result.createResult(200, 'ok', { ...action }));
            }, err => {
                //删除该动作
                res.json(result.createResult(500, '动作指导文件生成失败,' + err));
            })
        } else {
            res.json(result.createResult(500, '动作更新失败！'));
        }
    });
});

router.get('/copy', auth, (req, res) => {
    const oldId = req.query.id;
    const name = req.query.name;
    actionDao.detail(oldId, action => {
        if (!action) {
            res.json(result.createResult(500, '无法找到复制的动作！'));
            return;
        }
        const username = req.decoded && req.decoded.username;
        action.createPerson = action.modifyPerson = username;
        action.name = name ? name : action.name;
        actionDao.create(action, (success, newId) => {
            if (success) {
                const oldPath = './upload/action/' + oldId + '/';
                const path = './upload/action/' + newId + '/';
                file.createPath(path).then(() => {
                    const images = action.images ? action.images.split(',') : [];
                    file.copyFiles(oldPath, path, [action.guideHtml].concat(images));
                    res.json(result.createResult(200, 'ok', { ...action, id: newId }));
                }, err => {
                    //删除该动作
                    res.json(result.createResult(500, '动作文件夹生成失败,' + err));
                });
            } else {
                res.json(result.createResult(500, '动作创建失败！'));
            }
        });
    });
});

router.get('/list', auth, (req, res) => {
    const roleId = req.decoded && req.decoded.roleId;
    actionDao.list(actions => {
        actions.forEach(action => {
            action.tags = action.tags ? action.tags.split(',') : [];
            action.images = action.images ? action.images.split(',') : [];
        });
        res.json(result.createResult(200, 'ok', actions));
    })
});

router.get('/listToPanel', auth, (req, res) => {
    actionDao.listToPanel(actions => {
        actions.forEach(action => {
            action.tags = action.tags ? action.tags.split(',') : [];
            action.images = action.images ? action.images.split(',') : [];
            action.params = action.params ? JSON.parse(action.params) : [];
            action.accessories = action.accessories ? JSON.parse(action.accessories) : [];
        });
        res.json(result.createResult(200, 'ok', actions));
    });
});

router.get('/zip', auth, (req, res) => {
    actionDao.list(actions => {
        const ids = actions.map(a => a.id);
        const tempPath = './upload/action' + new Date().getTime() + '/';
        createTempPath(tempPath, ids)
            .then(createJsonFile)
            .then(() => {
                const sourcePath = [tempPath, './upload/json/'];
                const zipName = new Date().getTime() + '.zip';
                const distPath = './upload/zip/' + zipName;
                res.setHeader('Content-Type', 'application/x-zip');
                res.setHeader("Content-Disposition", "attachment; filename=" + Buffer.from(zipName).toString('binary'));
                archiver.zip(sourcePath, distPath, res).then(() => {
                    file.delDir(tempPath);
                }, err => {
                    res.json(result.createResult(500, '导出失败！' + err));
                });
            });
    })
});

router.get('/batchZip', auth, (req, res) => {
    const ids = req.query.ids.split(',');
    const tempPath = './upload/action' + new Date().getTime() + '/';
    createTempPath(tempPath, ids)
        .then(createJsonFile)
        .then(() => {
            const sourcePath = [tempPath, './upload/json/'];
            const zipName = new Date().getTime() + '.zip';
            const distPath = './upload/zip/' + zipName;
            res.setHeader('Content-Type', 'application/x-zip');
            res.setHeader("Content-Disposition", "attachment; filename=" + Buffer.from(zipName).toString('binary'));
            archiver.zip(sourcePath, distPath, res).then(() => {
                file.delDir(tempPath);
            }, err => {
                res.json(result.createResult(500, '导出失败！' + err));
            });
        });
});

createTempPath = (tempPath, ids) => { //创建临时动作文件
    const promises = [];
    file.createDir(tempPath).then(() => {
        ids.forEach(id => {
            const src = './upload/action/' + id;
            const dst = tempPath + id
            let promise = new Promise((resolve) => {
                file.createDir(dst).then(() => {
                    file.copyFolder(src, dst).then(() => {
                        resolve();
                    });
                })
            });
            promises.push(promise);
        });
    })
    return Promise.all(promises);
}

createJsonFile = () => {
    let promise1 = new Promise((resolve, reject) => {
        actionDao.listToPanel(actions => {
            actions.forEach(action => {
                action.tags = action.tags ? action.tags.split(',') : [];
                action.images = action.images ? action.images.split(',') : [];
                action.params = action.params ? JSON.parse(action.params) : [];
                action.accessories = action.accessories ? JSON.parse(action.accessories) : [];
            });
            const json = JSON.stringify(actions);
            file.createJson('./upload/json/actions.json', json).then(() => {
                resolve();
            });
        });
    })
    let promise2 = new Promise((resolve, reject) => {
        tagDao.listToPanel(tags => {
            const tree = other.getTagTree(tags);
            other.removeTagsAttr(tree);
            const json = JSON.stringify(tree);
            file.createJson('./upload/json/tags.json', json).then(() => {
                resolve();
            });
        });
    });
    return Promise.all([promise1, promise2])
}


module.exports = router;