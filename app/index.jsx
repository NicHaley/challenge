import React from 'react';
import {render} from 'react-dom';

const server = io('http://localhost:3003/');

// server.on('post', todo => {
//   render(todo);
// });

// // NOTE: These are listeners for events from the server
// // This event is for (re)loading the entire list of todos from the server
// server.on('load', todos => {
//   todos.forEach(todo => render(todo));
// });

// render (todo) {
//   const listItem = document.createElement('li');
//   const listItemText = document.createTextNode(todo.title);
//   listItem.appendChild(listItemText);
//   list.appendChild(listItem);
// }

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

  render () {
    const listItems = this.state.todos.map(todo => {
      return (
        <li key={todo.id}>{todo.title}</li>
      )
    });

    return (
	    <div>
	    	<form onSubmit={this.handleSubmit.bind(this)}>
		    	<input id="todo-input" type="text" value={this.state.text} onChange={this.handleChange.bind(this)} placeholder="Write a todo" />
		    	<button type="submit" value="Post">Submit</button>
	    	</form>
        <ul>
          {listItems}
        </ul>
	    </div>
    )
  }
}

render(<App/>, document.getElementById('app'));


