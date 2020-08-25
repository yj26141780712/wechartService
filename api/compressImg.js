let fs = require('fs');
const { createCanvas, loadImage } = require('canvas');


compressImg = ({ width, scale, filename, outName }, callback) => {
    let height = width / scale;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    loadImage(filename).then((image) => {
        ctx.drawImage(image, 0, 0, width, height);
        return canvas.toDataURL()
    }).then(res => {
        const base64 = res.replace(/^data:image\/\w+;base64,/, '');
        const picUrl = new Buffer(base64, 'base64');
        fs.writeFile(outName, picUrl, (err) => {
            callback(err);
        });
    });
}

module.exports = compressImg;