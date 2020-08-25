let db = require('../api/mysqldb');
let userSqlMap = require('./userSqlMap');

module.exports = {
    create: (user, callback) => {
        db.pool.query(userSqlMap.add, [user.username, user.password, user.name, user.roleId], (error, result) => {
            if (error) throw error;
            callback(result.affectedRows > 0);
        });
    },
    list: (callback) => {
        db.pool.query(userSqlMap.list, (error, result) => {
            if (error) throw error;
            callback(result);
        })
    },
    getById: (id, callback) => {
        db.pool.query(userSqlMap.getById, id, (error, result) => {
            if (error) throw error;
            callback(result[0]);
        });
    },
    deleteById: (id, callback) => {
        db.pool.query(userSqlMap.deleteById, id, (error, result) => {
            if (error) throw error;
            callback(result.affectedRows > 0);
        });
    },
    batchDelete: (ids, callback) => {
        let sqlParamsEntities = [];
        ids.forEach(id => {
            sqlParamsEntities.push({
                sql: userSqlMap.deleteById,
                params: [id]
            });
        });
        db.transaction(sqlParamsEntities).then(() => {
            callback();
        }, err => {
            callback(err);
        })
    },
    update: (user, callback) => {
        db.pool.query(userSqlMap.update, [user.username, user.password, user.name, user.roleId, user.id], (error, result) => {
            if (error) throw error;
            callback(result.affectedRows > 0);
        });
    },
    checkUser: (user, callback) => {
        db.pool.query(userSqlMap.checkUser, [user.username, user.password], (error, result) => {
            if (error) throw error;
            callback(result[0]);
        });
    }
};