let db = require('../api/mysqldb');
let actionSqlMap = require('./actionSqlMap');

module.exports = {
    create: (action, callback) => {
        db.pool.query(actionSqlMap.add, [action.name, action.modelId, action.patternId, action.serieId || 0, action.tags, action.guide, action.images, action.createPerson, action.modifyPerson, action.paramJson, action.auxJson, action.guideHtml], (error, result) => {
            if (error) throw error;
            callback(result.affectedRows > 0, result.insertId);
        })
    },
    delete: (id, callback) => {
        db.pool.query(actionSqlMap.deleteById, id, (error, result) => {
            if (error) throw error;
            callback(result.affectedRows > 0);
        });
    },
    batchDelete: (ids, callback) => {
        let sqlParamsEntities = [];
        ids.forEach(id => {
            sqlParamsEntities.push({
                sql: actionSqlMap.deleteById,
                params: [id]
            });
        });
        db.transaction(sqlParamsEntities).then(() => {
            callback();
        }, err => {
            callback(err);
        });
    },
    update: (action, callback) => {
        db.pool.query(actionSqlMap.update, [action.name, action.modelId, action.patternId, action.serieId || 0, action.tags, action.guide, action.images, action.modifyPerson, action.paramJson, action.auxJson, action.guideHtml, action.id], (error, result) => {
            if (error) throw error;
            callback(result.affectedRows > 0);
        });
    },
    list: (callback) => {
        db.pool.query(actionSqlMap.list, (error, result) => {
            if (error) throw error;
            callback(result);
        });
    },
    listToPanel: (callback) => {
        db.pool.query(actionSqlMap.listToPanel, (error, result) => {
            if (error) throw error;
            callback(result);
        });
    },
    detail: (id, callback) => {
        db.pool.query(actionSqlMap.detail, id, (error, result) => {
            if (error) throw error;
            callback(result[0]);
        });
    }
};