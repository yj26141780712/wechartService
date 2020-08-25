let tagSqlMap = {
  add: 'insert into tag (name,parentId,level) values (?,?,?)',
  deleteById: 'delete from tag where id = ?',
  update: 'update tag set name =?,parentId=?,level=? where id = ?',
  list: 'select * from tag',
  listByParentId: 'select * from tag where parentId = ?'
}
module.exports = tagSqlMap;