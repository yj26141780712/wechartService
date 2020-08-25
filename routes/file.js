let express = require('express');
let router = express.Router();
let auth = require('../api/auth');
let result = require('../model/result');
let uuid = require('node-uuid');  //uuid
let fs = require("fs");
let multer = require('multer'); // 文件上传
let images = require('images'); // 图片压缩
// let compressImg = require('../api/compressImg'); // canvas图片压缩

// router.post('/upload', auth, multer({ dest: 'upload/old' }).single('file'), (req, res) => {
//     if (req.file) {
//         let file = req.file;
//         let filename = './upload/old/' + file.filename;
//         let suffix = file.originalname.lastIndexOf('.');
//         const uuidName = uuid.v4() + file.originalname.substr(suffix);
//         let saveFilename = './upload/old/' + uuidName;
//         fs.renameSync(filename, saveFilename);
//         let outName = './upload/compress/' + uuidName;
//         let size = { width: 600, scale, saveFilename, outName };
//         compressImg(size);
//         res.json(result.createResult(200, 'ok'));
//     } else {
//         res.json(result.createResult(300, '上传文件不能为空！'));
//     }
// });

router.post('/upload', auth, multer({ dest: 'upload/old' }).single('file'), (req, res) => {
    if (req.file) {
        let file = req.file;
        let filename = './upload/old/' + file.filename;
        // let suffix = file.originalname.lastIndexOf('.');
        const uuidName = uuid.v4() + '.jpg' //file.originalname.substr(suffix);
        let saveFilename = './upload/old/' + uuidName;
        let outName = './upload/compress/' + uuidName;
        fs.renameSync(filename, saveFilename);
        try {  // 目前只支持jpg的压缩
            images(saveFilename).size(400).save(outName, {
                quality: 50                    //保存图片到文件,图片质量为50
            });
        } catch (error) {
            console.log('压缩失败');
            fs.renameSync(saveFilename, outName);
        }
        res.json(result.createResult(200, 'ok', uuidName));
    } else {
        res.json(result.createResult(300, '上传文件不能为空！'));
    }
});

module.exports = router;