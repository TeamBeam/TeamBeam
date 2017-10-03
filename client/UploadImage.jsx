import React from 'react';
import ReactDOM from 'react-dom';
import Dropzone from 'react-dropzone';


class UploadImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      files: []
    }
  }

  onDrop(accepted, rejected){
    this.setState({files: accepted}, () => {
      console.log('accepted: ', this.state.files);
      console.log('rejected: ', rejected);
    });
  }

  render(props) {
    return (
      <div>
        <Dropzone onDrop={this.onDrop.bind(this)}>
          -upload your profile picture-
        </Dropzone>
      </div>
    )
  }
}
export default UploadImage;
