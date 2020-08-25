let modelSqlMap = {
    add: 'insert into model (name,type,description) values (?, ?, ?)',
    deleteById: 'delete from model where id = ?',
    update: 'update model set name =?,type=?,description=? where id = ?',
    list: 'select * from model'
}

module.exports = modelSqlMap;