exports.createResult = (success, message, data) => {
    let result = {};
    result.code = success;
    result.message = message;
    result.obj = data;
    return result;
}