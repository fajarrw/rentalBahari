const Get = (request) => {
    console.log(`200 [GET] ${request.originalUrl} - Response sent`);
}

const Post = (request, objId) => {
    console.log(`201 [POST] ${request.originalUrl} - Object Created /${objId}`);
}

const Update = (request) => {
    console.log(`204 [UPDATE] ${request.originalUrl} - Object updated successfully`);
}

const Delete = (request) => {
    console.log(`204 [DELETE] ${request.originalUrl} - Object deleted successfully`);
}

const Error = (request, filepath, err) => {
    console.log(`500 [${request.method}] ${request.originalUrl} - ${filepath}: ${err.message}`)
}

const NotFound = (request) => {
    console.log(`404 [${request.method}] ${request.originalUrl} - Target not found`)
}

const BadRequest = (request) => {
    console.log(`400 [${request.method}] ${request.originalUrl} - Bad Request`)
}

const Logger = {
    Get,
    Post,
    Update,
    Delete,
    Error,
    NotFound,
    BadRequest,
}

module.exports = Logger;