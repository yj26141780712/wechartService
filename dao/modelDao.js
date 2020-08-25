let db = require('../api/mysqldb');
let modelSqlMap = require('./modelSqlMap');

module.exports = {
    create: (model, callback) => {
        db.pool.query(modelSqlMap.add, [model.name, model.type, model.description], (error, result) => {
            if (error) throw error;
            callback(result.affectedRows > 0);
        });
    },
    delete: (id, callback) => {
        db.pool.query(modelSqlMap.deleteById, id, (error, result) => {
            if (error) throw error;
            callback(result.affectedRows > 0);
        });
    },
    batchDelete: (ids, callback) => {
        let sqlParamsEntities = [];
        ids.forEach(id => {
            sqlParamsEntities.push({
                sql: modelSqlMap.deleteById,
                params: [id]
            });
        });
        db.transaction(sqlParamsEntities).then(() => {
            callback();
        }, err => {
            callback(err);
        });
    },
    update: (model, callback) => {
        db.pool.query(modelSqlMap.update, [model.name, model.type, model.description, model.id], (error, result) => {
            if (error) throw error;
            callback(result.affectedRows > 0);
        });
    },
    list: (callback) => {
        db.pool.query(modelSqlMap.list, (error, result) => {
            if (error) throw error;
            callback(result);
        })
    }
}