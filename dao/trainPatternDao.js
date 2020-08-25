let db = require('../api/mysqldb');
let tpSqlMap = require('./trainPatternSqlMap');

module.exports = {
    create: (tp, callback) => {
        db.pool.query(tpSqlMap.add, [tp.name, tp.code, tp.modelId], (error, result) => {
            if (error) throw error;
            callback(result.affectedRows > 0);
        });
    },
    delete: (id, callback) => {
        db.pool.query(tpSqlMap.deleteById, id, (error, result) => {
            if (error) throw error;
            callback(result.affectedRows > 0);
        });
    },
    batchDelete: (ids, callback) => {
        let sqlParamsEntities = [];
        ids.forEach(id => {
            sqlParamsEntities.push({
                sql: tpSqlMap.deleteById,
                params: [id]
            });
        });
        db.transaction(sqlParamsEntities).then(() => {
            callback();
        }, err => {
            callback(err);
        })
    },
    update: (tp, callback) => {
        db.pool.query(tpSqlMap.update, [tp.name, tp.code, tp.modelId, tp.id], (error, result) => {
            if (error) throw error;
            callback(result.affectedRows > 0);
        });
    },
    list: (callback) => {
        db.pool.query(tpSqlMap.list, (error, result) => {
            if (error) throw error;
            callback(result);
        });
    },
    setParams: (id, params, callback) => {
        db.pool.query(tpSqlMap.setParams, [params, id], (error, result) => {
            if (error) throw error;
            callback(result.affectedRows > 0);
        });
    },
    getParams: (id, callback) => {
        db.pool.query(tpSqlMap.getParams, [id], (error, result) => {
            if (error) throw error;
            callback(result[0] && result[0].params);
        });
    }
}