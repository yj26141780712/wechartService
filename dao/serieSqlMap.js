let seriesSqlMap = {
    add: 'insert into serie (name) values (?)',
    deleteById: 'delete from serie where id = ?',
    deleteActionsById: 'update action set deleted = 1 where serieId = ?',
    update: 'update serie set name=? where id = ?',
    list: 'select * from serie',
    actionList: 'select id,name from action where serieId = ? and deleted = 1'
};

module.exports = seriesSqlMap;