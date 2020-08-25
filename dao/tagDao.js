let db = require('../api/mysqldb');
let tagSqlMap = require('./tagSqlMap');

module.exports = {
  create: (tag, callback) => {
    db.pool.query(tagSqlMap.add, [tag.name, tag.parentId, tag.level], (error, result) => {
      if (error) throw error;
      callback(result.affectedRows > 0, result.insertId);
    });
  },
  delete: (id, callback) => {
    db.pool.query(tagSqlMap.deleteById, id, (error, result) => {
      if (error) throw error;
      callback(result.affectedRows > 0);
    });
  },
  batchDelete: (ids, callback) => {
    let sqlParamsEntities = [];
    ids.forEach(id => {
      sqlParamsEntities.push({
        sql: tagSqlMap.deleteById,
        params: [id]
      });
    });
    db.transaction(sqlParamsEntities).then(() => {
      callback();
    }, err => {
      callback(err);
    })
  },
  update: (tag, callback) => {
    db.pool.query(tagSqlMap.update, [tag.name, tag.parentId, tag.level, tag.id], (error, result) => {
      if (error) throw error;
      callback(result.affectedRows > 0);
    });
  },
  list: (callback) => {
    db.pool.query(tagSqlMap.list, (error, result) => {
      callback(result);
    });
  },
  listByParenId: (parentId, callback) => {
    db.pool.query(tagSqlMap.listByParentId, parentId, (error, result) => {
      callback(result);
    });
  },
  listToPanel: (callback) => {
    db.pool.query(tagSqlMap.list, (error, result) => {
      callback(result);
    });
  }
}