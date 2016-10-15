import React from 'react';
import {render} from 'react-dom';

const server = io('http://localhost:3003/');

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      text : "",
      todos : []
    };
  }

  componentDidMount () {

    server.on('post', todo => {
      this.setState({todos: this.state.todos.concat([todo])});
    });

    server.on('delete', todoId => {
      const newArray = this.state.todos.filter(function(t) {
        return t.id !== todoId;
      });

      this.setState({todos: newArray});
    });

    server.on('update', todo => {

      let 
        update = require('react-addons-update'),
        todos = this.state.todos;

      let todoIndex = todos.findIndex(function(t) { 
        return t.id === todo.id; 
      });

      let updatedTodo = update(todos[todoIndex], {isCompleted: {$set: todo.isCompleted}}); 

      let newTodos = update(todos, {
        $splice: [[todoIndex, 1, updatedTodo]]
      });

      this.setState({todos: newTodos});

    });

    server.on('load', todos => {
      this.setState({todos: todos});
    });

  }

  handleSubmit (e) {
    e.preventDefault();

    let text = this.state.text.trim();

    server.emit('make', {
      title : text
    });

    this.setState({text: ''});
  }

  handleChange (e) {
  	this.setState({text: e.target.value});
  }

  handleDelete (todo) {
    server.emit('delete', {
      todo : todo
    });
  }

  handleToggle (todo) {
    todo.isCompleted = !todo.isCompleted;

    server.emit('update', {
      todo : todo
    });
  }

  render () {
    const listItems = this.state.todos.map(todo => {
      return (
        <li key={todo.id}>
          {todo.title}
          <button>Delete</button>
        </li>
      )
    });

    return (
	    <div>
	    	<form onSubmit={this.handleSubmit.bind(this)}>
		    	<input id="todo-input" type="text" value={this.state.text} onChange={this.handleChange.bind(this)} placeholder="Write a todo" />
		    	<button className="test" type="submit" value="Post">Submit</button>
	    	</form>
        <ul>
          {this.state.todos.map((todo) => {
            const 
              boundDelete = this.handleDelete.bind(this, todo),
              boundToggle = this.handleToggle.bind(this, todo);

            return (
              <li key={todo.id}>
                <input type="checkbox" onChange={boundToggle} checked={todo.isCompleted} />
                {todo.title}
                <button onClick={boundDelete}>Delete</button>
              </li>
            );
          }, this)}
        </ul>
	    </div>
    )
  }
}

render(<App/>, document.getElementById('app'));


