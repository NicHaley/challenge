const server = require('socket.io')();
const firstTodos = require('./data');
const Todo = require('./todo');

server.on('connection', (client) => {
    // This is going to be our fake 'database' for this application
    // Parse all default Todo's from db

    // FIXME: DB is reloading on client refresh. It should be persistent on new client connections from the last time the server was run...
    let DB = firstTodos.map(t => {
        // Form new Todo objects
        return new Todo(title=t.title);
    });

    // Sends a message to the client to reload all todos
    const reloadTodos = () => {
        server.emit('load', DB);
    }

    const postTodo = (newTodo) => {

        // Push this newly created todo to our database
        DB.push(newTodo);
        server.emit('post', newTodo);

    }

    const deleteTodo = (todo) => {
        DB = DB.filter(function(t) {
            return t.id !== todo.todo.id;
        });

        server.emit('delete', todo.todo.id);
    }

    // Accepts when a client makes a new todo
    client.on('make', t => {
        const newTodo = new Todo(title=t.title);
        postTodo(newTodo);
    });

    // Accepts when a client deletes a new todo
    client.on('delete', t => {
        // const newTodo = new Todo(title=t.title);
        deleteTodo(t);
    });

    // Send the DB downstream on connect
    reloadTodos();
});

console.log('Waiting for clients to connect');
server.listen(3003);
