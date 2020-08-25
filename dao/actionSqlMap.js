let actionSqlMap = {
    add: 'insert into action (name,modelId,patternId,serieId,tags,guide,images,createPerson,modifyPerson,paramJson,auxJson,guideHtml) values (?,?,?,?,?,?,?,?,?,?,?,?)',
    deleteById: 'update action set deleted = 1 where id = ?',
    update: 'update action set name=?,modelId=?,patternId=?,serieId=?,tags=?,guide=?,images=?,modifyPerson=?,paramJson=?,auxJson=?,guideHtml=? where id=?',
    detail: 'select name,modelId,patternId,serieId,tags,guide,guideHtml,images,createPerson,modifyPerson,paramJson,auxJson,guideHtml from action where id=?',
    list: 'select id,name,modelId,patternId,serieId,tags,guide,guideHtml,images,createPerson,modifyPerson,paramJson,auxJson,guideHtml from action where deleted = 0',
    listToPanel: `select a.id, a.name,b.name modelName,b.type modelType,c.name patternName,c.code patternCode, d.id serieId, d.name serieName,a.tags,paramJson params, auxJson accessories,a.guideHtml guide,a.images  from action a 
    left join model b on a.modelId = b.id 
    left join pattern c on a.patternId = c.id
    left join serie d on a.serieId = d.id where a.deleted = 0`
}

module.exports = actionSqlMap;