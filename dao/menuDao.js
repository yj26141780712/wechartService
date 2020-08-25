let db = require('../api/mysqldb');
let menuSqlMap = require('./menuSqlMap');

module.exports = {
    create: (menu, callback) => {
        db.pool.query(menuSqlMap.add, [menu.name, menu.url, menu.icon, menu.parentId || 0, menu.sort || 0], (error, result) => {
            if (error) throw error;
            callback(result.affectedRows > 0);
        })
    },
    delete: (id, callback) => {
        db.pool.query(menuSqlMap.deleteById, id, (error, result) => {
            if (error) throw error;
            callback(result.affectedRows > 0);
        });
    },
    batchDelete: (ids, callback) => {
        let sqlParamsEntities = [];
        ids.forEach(id => {
            sqlParamsEntities.push({
                sql: menuSqlMap.deleteById,
                params: [id]
            });
        });
        db.transaction(sqlParamsEntities).then(() => {
            callback();
        }, err => {
            callback(err);
        })
    },
    update: (menu, callback) => {
        db.pool.query(menuSqlMap.update, [menu.name, menu.url, menu.icon, menu.parentId, menu.sort, menu.id], (error, result) => {
            if (error) throw error;
            callback(result.affectedRows > 0);
        });
    },
    list: (callback) => {
        db.pool.query(menuSqlMap.list, (error, result) => {
            if (error) throw error;
            callback(result);
        });
    }
}