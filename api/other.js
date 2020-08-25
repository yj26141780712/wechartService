const getTagTree = (tags) => {
    const topTags = tags.filter(t => t.level === 1);
    topTags.forEach(tag => {
        const children = getChildrenTag(tag.id, tags);
        if (children && children.length > 0) {
            tag.children = children;
        }
    });
    return topTags;
}

const getChildrenTag = (tagId, tags) => {
    const children = tags.filter(t => t.parentId === tagId);
    children.forEach(c => {
        const _children = getChildrenTag(c.id, tags);
        if (_children && _children.length > 0) {
            c.children = _children;
        }
    })
    return children;
}

removeTagsAttr = (tags) => {
    tags.forEach(t => {
        removeTagAttr(t);
    })
}

const removeTagAttr = (tag) => {
    delete tag['id'];
    delete tag['parentId'];
    delete tag['level'];
    delete tag['createTime'];
    delete tag['sort'];
    let children = tag.children;
    if (children) {
        children.forEach(c => {
            removeTagAttr(c);
        });
    }
}

exports.getTagTree = getTagTree;
exports.removeTagsAttr = removeTagsAttr;