let fs = require("fs");
let path = require("path");

createPath = (path) => {
    return new Promise((resolve, reject) => {
        fs.mkdir(path, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

createHtml = (oldFilename, filename, content) => {
    return new Promise((resolve, reject) => {
        fs.unlink(oldFilename, err => {
            content = '\uFEFF' + content;
            fs.writeFile(filename, content, 'utf8', (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    });
}

copyFiles = (sourceFile, destPath, names) => {
    names.forEach(name => {
        let _sourceFile = sourceFile + name;
        let _destPath = destPath + name;
        fs.copyFileSync(_sourceFile, _destPath);
    });
}

createDir = (path) => {
    return new Promise((resolve, reject) => {
        fs.mkdir(path, function (err) {
            if (err) {
                reject(err)
                return
            }
            resolve();
        });
    })
}

copyFolder = (srcDir, tarDir) => {
    return new Promise((resolve) => {
        copyFolderFile(srcDir, tarDir, () => {
            resolve();
        });
    });
}

copyFile = (srcPath, tarPath, cb) => {
    var rs = fs.createReadStream(srcPath)
    rs.on('error', function (err) {
        if (err) {
            console.log('read error', srcPath)
        }
        cb && cb(err)
    })
    var ws = fs.createWriteStream(tarPath)
    ws.on('error', function (err) {
        if (err) {
            console.log('write error', tarPath)
        }
        cb && cb(err)
    })
    ws.on('close', function (ex) {
        cb && cb(ex)
    })
    rs.pipe(ws)
}

copyFolderFile = (srcDir, tarDir, cb) => {
    fs.readdir(srcDir, function (err, files) {
        var count = 0
        var checkEnd = function () {
            ++count == files.length && cb && cb()
        }
        if (err) {
            checkEnd()
            return
        }
        files.forEach(function (file) {
            var srcPath = path.join(srcDir, file)
            var tarPath = path.join(tarDir, file)
            fs.stat(srcPath, function (err, stats) {
                if (stats.isDirectory()) {
                    fs.mkdir(tarPath, function (err) {
                        if (err) {
                            return
                        }
                        copyFolderFile(srcPath, tarPath, checkEnd)
                    })
                } else {
                    copyFile(srcPath, tarPath, checkEnd)
                }
            })
        })
        //为空时直接回调
        files.length === 0 && cb && cb()
    })
}

createJson = (filename, content) => {
    return new Promise((resolve, reject) => {
        fs.unlink(filename, err => {
            fs.writeFile(filename, content, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    });
}

moveImages = (sourceFile, destPath, images) => {
    images.forEach(image => {
        let _sourceFile = sourceFile + image;
        let _destPath = destPath + image;
        if (fs.existsSync(_sourceFile)) {
            fs.renameSync(_sourceFile, _destPath);
        }
    });
}

deleteImages = (path, imgs) => {
    const files = fs.readdirSync(path);
    files.forEach(file => {
        if ((file.indexOf('.png') > -1 || file.indexOf('.jpg') > -1) && imgs.indexOf(file) === -1) {
            fs.unlinkSync(path + file);
        }
    })
}

delFile = (path) => {
    fs.unlinkSync(path)
}

delDir = (path) => {
    let files = [];
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach((file, index) => {
            let curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) {
                delDir(curPath); //递归删除文件夹
            } else {
                fs.unlinkSync(curPath); //删除文件
            }
        });
        fs.rmdirSync(path);
    }
}

exports.createPath = createPath;
exports.createHtml = createHtml;
exports.createJson = createJson;
exports.moveImages = moveImages;
exports.deleteImages = deleteImages;
exports.delDir = delDir;
exports.delFile = delFile;
exports.copyFiles = copyFiles;
exports.createDir = createDir;
exports.copyFolder = copyFolder;