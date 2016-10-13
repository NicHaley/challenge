const uuid = require('node-uuid');

module.exports = class Todo {
    constructor(title='') {
        this.title = title,
        this.id = uuid.v4()
    }
}
