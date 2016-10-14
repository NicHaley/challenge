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
            const boundClick = this.handleDelete.bind(this, todo);
            return (
              <li onClick={boundClick} key={todo.id}>
                {todo.title}
                <button>Delete</button>
              </li>
            );
          }, this)}
        </ul>
	    </div>
    )
  }
}

render(<App/>, document.getElementById('app'));


