let express = require('express');
const path = require('path');
let mysql = require('mysql');
let fs = require('fs');
let app = express();

let bodyParser = require('body-parser')
let url = require('url');
let resJson = {
    code: 200,
    message: 'ok'
}

let pool = mysql.createPool({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'root',
    database: 'zerg'
}); // 创建连接池

let static = 'http://localhost:3001/zerg/file/images';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With,token,If-Modified-Since");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    if (req.method == "OPTIONS") res.send(200); /*让options请求快速返回*/
    else {
        res.header("Access-Control-Expose-Headers", "token");
        res.header("token", req.headers['token']);
        next();
    };
});


//verify
app.post('/zerg/api/token/verify', (req, res) => {
    resJson.isValid = true;
    res.json(resJson);
});
//user
app.post('/zerg/api/token/user', (req, res) => {
    resJson.token = 'token';
    res.json(resJson);
});

app.get('/zerg/api/banner/:id', (req, res) => {
    pool.getConnection((err, conn) => {
        if (err) {
            console.log(err);
            console.log('数据库连接失败！');
        } else {
            console.log('数据库连接成功！');
            let sql = `select key_word,img_id,CONCAT('${static}',url) url from banner a inner join banner_item b left join image c on b.img_id= c.id where a.id = b.banner_id  and a.id = ${req.params.id}`;
            conn.query(sql, (err2, result) => {
                conn.release();
                if (err2) {
                    console.log(err2);
                } else {
                    let items = result;
                    resJson.obj = items;
                    console.log(resJson);
                    res.json(resJson);
                }
            });
        }
    });

});

app.get('/zerg/api/theme', (req, res) => {
    res.json(resJson);
});

app.get('/zerg/api/product/recent', (req, res) => {
    res.json(resJson);
});

// app.use(express.static(path.join(__dirname, 'public')))
app.use('/zerg/file', express.static(path.join(__dirname, 'public')))
// node 静态资源路径配置

let server = app.listen(3001, function () {
    let host = server.address().address;
    let port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});