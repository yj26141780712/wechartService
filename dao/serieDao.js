let db = require('../api/mysqldb');
let serieSqlMap = require('./serieSqlMap');

module.exports = {
    create: (serie, callback) => {
        db.pool.query(serieSqlMap.add, [serie.name], (error, result) => {
            if (error) throw error;
            callback(result.affectedRows > 0, result.insertId);
        })
    },
    delete: (id, deleteChildren, callback) => {
        let sqlParamsEntities = [{
            sql: serieSqlMap.deleteById,
            params: [id],
        }];
        if (deleteChildren) {
            sqlParamsEntities.push({
                sql: serieSqlMap.deleteActionsById,
                params: [id],
            });
        }
        console.log(sqlParamsEntities);
        db.transaction(sqlParamsEntities).then(() => {
            callback();
        }, err => {
            callback(err);
        })
    },
    batchDelete: (ids, callback) => {
        let sqlParamsEntities = [];
        ids.forEach(id => {
            sqlParamsEntities.push({
                sql: serieSqlMap.deleteById,
                params: [id],
            });
        });
        db.transaction(sqlParamsEntities).then(() => {
            callback();
        }, err => {
            callback(err);
        })
    },
    update: (serie, callback) => {
        db.pool.query(serieSqlMap.update, [serie.name, serie.id], (error, result) => {
            if (error) throw error;
            callback(result.affectedRows > 0);
        });
    },
    list: (callback) => {
        db.pool.query(serieSqlMap.list, (error, result) => {
            if (error) throw error;
            callback(result);
        });
    },
    actionList: (id, callback) => {
        db.pool.query(serieSqlMap.actionList, id, (error, result) => {
            if (error) throw error;
            callback(result);
        });
    }
}