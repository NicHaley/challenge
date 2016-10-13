import React from 'react';
import {render} from 'react-dom';

const server = io('http://localhost:3003/');

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {text : ""};
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
    return (
	    <div>
	    	<form onSubmit={this.handleSubmit.bind(this)}>
		    	<input id="todo-input" type="text" value={this.state.text} onChange={this.handleChange.bind(this)} placeholder="Feed the cat" />
		    	<button type="submit" value="Post">Submit</button>
	    	</form>
	    </div>
    )
  }
}

render(<App/>, document.getElementById('app'));