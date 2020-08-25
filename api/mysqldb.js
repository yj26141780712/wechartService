let mysql = require('mysql');
let config = require('../conf/config');
let async = require("async");

let pool = mysql.createPool({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database,
    connectionLimit: config.connectionLimit
}); // 创建连接池

let transaction = (sqlParamsEntities) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, conn) => {
            conn.beginTransaction(err => {
                if (err) {
                    reject(err);
                } else {
                    let funcAry = [];
                    sqlParamsEntities.forEach(e => {
                        let temp = (cb) => {
                            let sql = e.sql;
                            let params = e.params;
                            conn.query(sql, params, (err) => {
                                if (err) {
                                    conn.rollback(err => {
                                        console.log('事务失败' + err);
                                        throw err;
                                    });
                                } else {
                                    return cb(null, 'ok');
                                }
                            });
                        }
                        funcAry.push(temp);
                    });
                    async.series(funcAry, (err) => {
                        if (err) {
                            conn.rollback(err => {
                                console.log('transaction error:' + err);
                                conn.release();
                                reject(err);
                            })
                        } else {
                            conn.commit(err => {
                                if (err) {
                                    conn.rollback(err => reject(err));
                                } else {
                                    console.log('Transaction complete!!');
                                    conn.release();
                                    resolve('Transaction complete');
                                }
                            });
                        }
                    });
                }
            })
        });
    });
}

exports.pool = pool;
exports.transaction = transaction;
// exports.query = query;
// exports.transaction = transaction;