let db = require('../api/mysqldb');
let roleSqlMap = require('./roleSqlMap');
module.exports = {
    create: (role, callback) => {
        db.pool.query(roleSqlMap.add, [role.name], (error, result) => {
            if (error) throw error;
            callback(result.affectedRows > 0);
        })
    },
    delete: (id, callback) => {
        db.pool.query(roleSqlMap.deleteById, id, (error, result) => {
            if (error) throw error;
            callback(result.affectedRows > 0);
        });
    },
    batchDelete: (ids, callback) => {
        let sqlParamsEntities = [];
        ids.forEach(id => {
            sqlParamsEntities.push({
                sql: roleSqlMap.deleteById,
                params: [id]
            });
        });
        db.transaction(sqlParamsEntities).then(() => {
            callback();
        }, err => {
            callback(err);
        });
    },
    update: (role, callback) => {
        db.pool.query(roleSqlMap.update, [role.name, role.id], (error, result) => {
            if (error) throw error;
            callback(result.affectedRows > 0);
        });
    },
    list: (callback) => {
        db.pool.query(roleSqlMap.list, (error, result) => {
            if (error) throw error;
            callback(result);
        });
    },
    getMenusById: (id, callback) => {
        db.pool.query(roleSqlMap.getMenusById, id, (error, result) => {
            if (error) throw error;
            callback(result);
        })
    },
    setMenusById: (id, menuIds, callback) => {
        let sqlParamsEntities = [];
        sqlParamsEntities.push({
            sql: roleSqlMap.deleteMenusById,
            params: [id]
        });
        menuIds.forEach(menuId => {
            sqlParamsEntities.push({
                sql: roleSqlMap.addMenuById,
                params: [id, menuId]
            });
        });
        db.transaction(sqlParamsEntities).then(() => {
            callback();
        }, err => {
            callback(err);
        })
    }
}