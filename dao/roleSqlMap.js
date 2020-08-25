let roleSqlMap = {
    add: 'insert into role (name) values(?)',
    deleteById: 'delete from role where id = ?',
    update: 'update role set name=? where id=?',
    list: 'select * from role',
    getMenusById: 'select a.id, a.name,a.url,a.icon,a.parentId,a.sort from menu a,role_menu b where a.id=b.menuId and b.roleId= ?',
    deleteMenusById: 'delete from role_menu where roleId = ?',
    addMenuById: 'insert into role_menu (roleId,menuId) values (?,?)'
};
module.exports = roleSqlMap;