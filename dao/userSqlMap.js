let userSqlMap = {
    add: 'insert into user (username, password, name, roleId) values(?, ?, ? , ?)',
    deleteById: 'delete from user where id = ?',
    update: 'update user set username=?, password=?,name=?,roleId=? where id=?',
    list: 'select * from user',
    getById: 'select * from user where id = ?',
    checkUser: 'select username,name,roleId from user where username=? and password=?'
};
module.exports = userSqlMap;