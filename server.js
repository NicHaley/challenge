const server = require('socket.io')();
const firstTodos = require('./data');
const Todo = require('./todo');

// FIXME: DB is reloading on client refresh. It should be persistent on new client connections from the last time the server was run...
let DB = firstTodos.map(t => {
    // Form new Todo objects
    return new Todo(title=t.title);
});

server.on('connection', (client) => {

    // Sends a message to the client to reload all todos
    const reloadTodos = () => {
        server.emit('load', DB);
    }

    const postTodo = (newTodo) => {

        // Push this newly created todo to our database
        DB.push(newTodo);
        server.emit('post', newTodo);

    }

    const deleteTodo = (response) => {
        DB = DB.filter(function(t) {
            return t.id !== response.todo.id;
        });

        server.emit('delete', response.todo.id);
    }

    const updateTodo = (response) => {
        let todoRecord = DB.find(t => t.id === response.todo.id);
        todoRecord.isCompleted = response.todo.isCompleted
        server.emit('update', todoRecord);
    }

    // Accepts when a client makes a new todo
    client.on('make', t => {
        const newTodo = new Todo(title=t.title);
        postTodo(newTodo);
    });

    // Accepts when a client deletes a new todo
    client.on('delete', t => {
        deleteTodo(t);
    });

    // Accepts when a client updates a new todo
    client.on('update', t => {
        updateTodo(t);
    });

    // Send the DB downstream on connect
    reloadTodos();
});

console.log('Waiting for clients to connect');
server.listen(3003);
