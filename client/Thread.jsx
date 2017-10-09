import React from 'react';
import Modal from 'react-modal';
const RB = require('react-bootstrap');

const axios = require('axios');

export default class Thread extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      popupIsOpen: false,
      posts: []
    }
    this.openPopup = this.openPopup.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.handleReply = this.handleReply.bind(this);
    this.deletePosts = this.deletePosts.bind(this);
  }
  closePopup() {
    let newState = Object.assign({}, this.state);
    newState.popupIsOpen = false;
    this.setState(newState);
  }
  openPopup() {
    let newState = Object.assign({}, this.state);
    newState.popupIsOpen = true;
    this.setState(newState);
  }

  componentDidMount() {
    let newState = Object.assign({}, this.state);
    axios.get(`/forum/${this.props.threadData.id}/posts`)
    .then((results) => {
      newState.posts = results.data;
      this.setState(newState);
    });
  }


  handleReply(e) {
    e.preventDefault();
    axios.post(`/forum/${this.props.threadData.id}/posts`, {
      message: e.target['reply-text'].value,
      user_id: this.props.user.id
    })
    .then((results) => {
    }, (err) => {
    });
  }

  deletePosts(index) {
    axios.delete(`/forum/${this.props.threadData.id}/posts/${this.state.posts[index].id}`)
    .then(results => {
      this.setState({
        posts: results.data
      })
    }, (err) => {
    });
  }

  render() {
    return(
      <div>
        <div className="thread-summary" onClick={this.openPopup}>
          <h3>{this.props.threadData.title}</h3>
          <RB.Well>
            <p className="thread-main">{this.props.threadData.description}</p>
          </RB.Well>
        </div>

        <Modal
          isOpen={this.state.popupIsOpen}
          onRequestClose={this.closePopup}
          contentLabel="ThreadPopup"
        >
          <RB.Row>
              <RB.PageHeader className="container" >{this.props.threadData.title}</RB.PageHeader>
              <RB.Col xs={1} xsOffset={11}>
                <RB.Button onClick={this.closePopup} bsSize="small" className="thread-exit">
                  <RB.Glyphicon glyph="remove" />
                </RB.Button>
              </RB.Col>
          </RB.Row>
          <RB.Row>
            <RB.Image className="container-fluid" src={this.props.threadData.musicsheet} responsive />
          </RB.Row>
          <div className="container posts">
            <h4>Instruments</h4>
            <ul type="disc">
              {JSON.parse(this.props.threadData.instruments).map((instrument) => {
                return <li>{instrument}</li>
              })}
            </ul>
          </div>
          <RB.Row>
            <RB.ListGroup className="container posts">
              {this.state.posts.map((post, index) => {
                return (
                  <RB.ListGroupItem className="posts">
                    <RB.Row className="userthread">
                      User id: {post.user_id} {post.created_at}
                      <RB.Col xs={1} xsOffset={11}>
                        <RB.Button onClick={(e) => this.deletePosts(index)} bsSize="xsmall">
                          <RB.Glyphicon glyph="remove" />
                        </RB.Button>
                      </RB.Col>
                    </RB.Row>
                    <RB.Row className="posts">
                      {post.message}
                    </RB.Row>
                  </RB.ListGroupItem>
                )
              })}
            </RB.ListGroup>
          </RB.Row>

          <form className="container" onSubmit={(e) => this.handleReply(e)}>
            <RB.FormGroup >
              <RB.FormControl className="searchbar" componentClass="textarea" name="reply-text"/>
              <RB.Button bsStyle="primary" type="submit">Reply</RB.Button>
            </RB.FormGroup>
          </form>

        </Modal>
      </div>
    );
  }
}
