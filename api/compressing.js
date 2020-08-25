const fs = require("fs");
const compressing = require("compressing");

const zip = (sourcePath, distPath) => {
    return new Promise((resolve, reject) => {
        compressing.zip
            .compressDir(sourcePath, distPath)
            .then(() => {
                console.log(`Tip: 文件压缩成功，已压缩至【${distPath}】`);
                resolve();
            })
            .catch(err => {
                console.log("Tip: 压缩报错");
                reject(err);
            });
    });
}

exports.zip = zip;


