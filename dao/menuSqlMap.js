let menuSqlMap = {
    add: 'insert into menu (name,url,icon,parentId,sort) values (?, ?, ?, ?, ?) ',
    deleteById: 'delete from menu where id = ?',
    update: 'update menu set name=?,url=?,icon=?,parentId=?,sort=? where id = ?',
    list: 'select * from menu'
}

module.exports = menuSqlMap;