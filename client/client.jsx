import React from 'react';
import {render} from 'react-dom';
require("./client.scss");

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

  handleToggle (todo, options) {
    todo.isCompleted = options.value || !todo.isCompleted;

    server.emit('update', {
      todo : todo
    });
  }

  handleToggleAll () {
    this.state.todos.forEach(todo => {
      this.handleToggle(todo, {value: true});
    });
  }

  handleDeleteAll () {
    this.state.todos.forEach(todo => {
      this.handleDelete(todo);
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
	    <div className="todos">
        <h1 className="todos__title">todos</h1>
	    	<form className="todos__form" onSubmit={this.handleSubmit.bind(this)} autoComplete="off">
		    	<input id="todo-input" type="text" className="todos__form__input" value={this.state.text} onChange={this.handleChange.bind(this)} placeholder="Write a todo" />
		    	<button className="todos__form__submit" type="submit" value="Post">Submit</button>
	    	</form>
        <ul className="todos__list">
          {this.state.todos.map((todo) => {
            const 
              boundDelete = this.handleDelete.bind(this, todo),
              boundToggle = this.handleToggle.bind(this, todo);

            return (
              <li className="todos__list__item" key={todo.id}>
                <input className="todos__list__item__toggle" type="checkbox" id={"todo_" + todo.id} onChange={boundToggle} checked={todo.isCompleted} />
                <label htmlFor={"todo_" + todo.id} className={"todos__list__item__title" + (todo.isCompleted ? " m-state_completed" : "")} >{todo.title}</label>
                <button className="todos__list__item__button" onClick={boundDelete}>✕</button>
              </li>
            );
          }, this)}
        </ul>
        <button className="todos__toggle-all-button" onClick={this.handleToggleAll.bind(this)}>Mark all tasks as completed</button>
        <button className="todos__delete-all-button" onClick={this.handleDeleteAll.bind(this)}>Delete all tasks</button>
	    </div>
    )
  }
}

render(<App/>, document.getElementById('app'));

