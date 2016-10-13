import React from 'react';
import {render} from 'react-dom';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {text : ""};
  }

  handleSubmit (e) {
    e.preventDefault();

    console.log(1111);
  }

  render () {
    return (
	    <div>
	    	<form onSubmit={this.handleSubmit}>
		    	<input id="todo-input" type="text" value={this.state.text} placeholder="Feed the cat" />
		    	<button type="submit" value="Post">Submit</button>
	    	</form>
	    </div>
    )
  }
}

render(<App/>, document.getElementById('app'));