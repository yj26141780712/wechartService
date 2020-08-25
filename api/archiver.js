let fs = require('fs');
let archiver = require('archiver');


let zip = (pathArray, disPath, res) => {
    return new Promise((resolve, reject) => {
        let archive = archiver('zip', {
            zlib: { level: 9 } // Sets the compression level.
        });
        archive.pipe(res);
        archive.on('error', (err) => {
            status = false;
            reject(err);
        });
        archive.on('finish', () => {
            console.log(archive.pointer() / 1024 / 1024 + 'M');
            console.log('压缩完成');
            resolve();
        });
        pathArray.forEach(path => {
            archive.directory(path, false);
        })
        archive.finalize();
    })
}

exports.zip = zip;