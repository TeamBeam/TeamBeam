import React from 'react';
import ReactDOM from 'react-dom';
import UserHeader from './UserHeader.jsx'
import AboutMe from './AboutMe.jsx'
import Tracks from './Tracks.jsx'
import Albums from './Albums.jsx'
import Collaboration from './Collaboration.jsx'
import Musician from './Musician.jsx'
import Composer from './Composer.jsx'
import { Grid, Row, Col } from 'react-bootstrap'
const axios = require('axios');
const _ = require('lodash');

export default class Profile extends React.Component {
 constructor(props) {
    super(props);
    this.state = {
      profile: {},
      posts: [],
      albums: []
    };
    this.getProfile = this.getProfile.bind(this);
    this.getPosts = this.getPosts.bind(this);
    this.getAlbums = this.getAlbums.bind(this);
    this.getProfile();
    this.getPosts();
    this.getAlbums();

  }
  getProfile() {
    axios.get(`/user/${this.props.user.username}`)
    .then((results) => {
      let newState = Object.assign({}, this.state);
      newState.profile = results.data.profile;
      this.setState(newState);
    })
  }

  getPosts() {
    axios.get(`/user/${this.props.user.id}/posts`)
    .then((results) => {
      let newState = Object.assign({}, this.state);
      newState.posts = results.data;
      this.setState(newState);
    })
  }

  getAlbums() {
    axios.get(`/user/${this.props.user.id}/albums`)
    .then((results) => {
      let newState = Object.assign({}, this.state);
      newState.albums = results.data;
      this.setState(newState);
    })
  }

  render() {
    if(this.state.profile.profiletype === 'composer') {
      return <Composer user={this.props.user} profile={this.state.profile} posts={this.state.posts} albums={this.state.albums}></Composer>
    } else if (this.state.profile.profiletype === 'musician') {
      return <Musician user={this.props.user} profile={this.state.profile} albums={this.state.albums}></Musician>
    } else {
      return <p>Loading profile...</p>
    }
  }
}
