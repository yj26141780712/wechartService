let express = require('express');
let app = express();
let user = require('./routes/user');
let role = require('./routes/role');
let menu = require('./routes/menu');
let model = require('./routes/model');
let trainPattern = require('./routes/trainPattern');
let tag = require('./routes/tag');
let serie = require('./routes/serie');
let action = require('./routes/action');
let file = require('./routes/file');
let bodyParser = require('body-parser');
let result = require('./model/result');
let domain = require('domain');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    let req_domain = domain.create();
    req_domain.on('error', (err) => {
        console.log(err);  // 打印错误日志
        res.json(result.createResult(500, err.stack));
    });
    req_domain.run(next);
});

app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With,token,If-Modified-Since");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    if (req.method == "OPTIONS") res.send(200); /*让options请求快速返回*/
    else {
        next();
    };
});

app.use('/eliga/api/user', user);
app.use('/eliga/api/role', role);
app.use('/eliga/api/menu', menu);
app.use('/eliga/api/model', model);
app.use('/eliga/api/trainPattern', trainPattern);
app.use('/eliga/api/tag', tag);
app.use('/eliga/api/serie', serie);
app.use('/eliga/api/action', action);
app.use('/eliga/api/file', file);
app.use('/eliga/download', express.static('upload'));

let server = app.listen(3001, function () {
    let host = server.address().address;
    let port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});