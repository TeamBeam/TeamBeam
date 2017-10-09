import React from 'react';
import Thread from './Thread.jsx';
import $ from "jquery";
import Modal from 'react-modal';
import CreatePost from './CreatePost.jsx';
import { Button, FormGroup, FormControl, InputGroup, Grid, Col, SplitButton, MenuItem } from 'react-bootstrap';

const axios = require('axios');
const threads_data = require('../data/threads_data.js');//Dummy threads data

export default class Forum extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      threads: [],
      allThreads: [],
      searchText: '',
      popupIsOpen: false
    }
  }

  componentDidMount() {
    axios.get('/forum')
    .then((results) => {
      let newState = Object.assign({}, this.state);
      newState.threads = results.data;
      newState.allThreads = results.data;
      console.log(newState.threads);
      this.setState(newState);
    }, (err) => {
      console.log('Error loading threads', err);
    })
  }

  openPopup() {
    var state = Object.assign({}, this.state);
    state.popupIsOpen = true;
    this.setState(state);
  }
  closePopup() {
    var state = Object.assign({}, this.state);
    state.popupIsOpen = false;
    this.setState(state);
  }
  filterSearch(e) {
    e.preventDefault();
    var threadsToSet = [];
    if (!this.state.searchText.length) {
      this.setState({threads: this.state.allThreads})
    } else {
      this.state.threads.forEach(thread => {
        if (thread.title === this.state.searchText.trim()) {
          threadsToSet.push(thread);
        }
      });
      if (threadsToSet.length) {
        this.setState({threads: threadsToSet});
      }
    }
  }
  searchAllTitles(e) {
    console.log(e)
    this.setState({threads: this.state.allThreads})
  }
  keyUp(e) {
    this.setState({searchText: e.target.value})
  }

  render() {
    return(
      <div>
        <form>
          <FormGroup controlId="formValidationError3">
          <div className="container thread-search">
            <Col xs={5} >
              <FormControl type="text" placeholder="Search thread title" onKeyUp={(e)=>   this.keyUp(e)} />
              <FormControl.Feedback />
            </Col>
            <div >
              <SplitButton className="btn btn-primary" onClick={(e)=> this.filterSearch(e)}
                onSelect={(e)=> this.searchAllTitles(e)}
                bsStyle='default' title='search'>
                <MenuItem eventKey={1}>AllTitles</MenuItem>
              </SplitButton>
            </div>
            </div>
          </FormGroup>
        </form>

      <div className="container">
        <a className="create-post" href="#" onClick={this.openPopup.bind(this)}>
          Create New Post
        </a>

        <Modal
          isOpen={this.state.popupIsOpen}
          onRequestClose={this.closePopup.bind(this)}
          contentLabel="ThreadPopup"
        >
          <CreatePost user={this.props.user} closePopup={this.closePopup.bind(this)}/>
        </Modal>
            <div className="threads">
              {this.state.threads.map((thread) => {
                return <Thread
                  threadData={thread}
                  key={thread.id}
                  user={this.props.user}
                />
              })}
            </div>
          </div>
      </div>
    );
  }
}

