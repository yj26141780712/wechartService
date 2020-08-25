let tpSqlMap = {
    add: 'insert into pattern (name,code,modelId) values (?, ?, ?)',
    deleteById: 'delete from pattern where id = ?',
    update: 'update pattern set name=?,code=?,modelId=? where id=?',
    list: 'select id,name,code,modelId from pattern',
    setParams: 'update pattern set params = ? where id = ?',
    getParams: 'select params from pattern where id = ?'
}

module.exports = tpSqlMap;