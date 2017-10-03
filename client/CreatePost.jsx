import React from 'react';
import ReactDOM from 'react-dom';

//Todo: send post {} to app.jsx

class CreatePost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      message: '',
      instruments: '',
      sendable: {}
    };
  }
  constructPost(e) {
    //ajax request with sendable data;
    //name should be the profile name inherited from this.props
    e.preventDefault();
    var sendable = {
      name: '',
      title: this.state.title,
      instruments: this.state.instruments,
      message: this.state.message
    }
    this.setState({sendable: sendable}, ()=> {
      console.log('SENDABLE:', this.state.sendable)
      //send 
    })
  }
  setInput(e, input) {
    var state = {};
    state[input] = e.target.value;

    this.setState(state, ()=> {
      console.log(this.state.title);
    });
  }

  render() {
    return (
      <div> 
        
        <input placeholder='title' rows='3' onKeyUp={(e)=> this.setInput(e, 'title')}/>
        <br/>
        <input placeholder='instruments' onKeyUp={(e)=> this.setInput(e, 'instruments')}/>
        <br/>
        <textarea placeholder='your message...' onKeyUp={(e)=>this.setInput(e, 'message')}></textarea>
        <button onClick={this.constructPost.bind(this)}>
         Post message
        </button>

      </div>
    )
  }
}
export default CreatePost;