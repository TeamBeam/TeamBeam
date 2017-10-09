import React from 'react';
import ReactDOM from 'react-dom';
import Dropzone from 'react-dropzone'
import axios from 'axios';
import { Button, FormControl, ControlLabel, FormGroup, Checkbox, Radio, Input, Well, Label, InputGroup, Grid, Row } from 'react-bootstrap';

class CreatePost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      instruments: [],
      customInstrument: '',
      musicsheet: '',
      sendable: {},
      availableInstruments: ['guitar', 'drums']
    };
  }
  constructPost(e) {
    e.preventDefault();
    var sendable = {
      user_id: this.props.user.id,
      title: this.state.title,
      instruments: JSON.stringify(this.state.instruments),
      description: this.state.description,
      musicsheet: this.state.musicsheet,
      created_at: new Date(),
      updated_at: new Date()
    }
    this.setState({sendable: sendable}, ()=> {
      var data = this.state.sendable;
      if (data.title.length) {
        axios.post('/forum', data)
          .then(res => {
            console.log(res);
          })
          .catch(err => {
            console.log(err);
          });
        this.props.closePopup();
      }
    })
  }
  setInput(e, input) {
    var state = {};
    state[input] = e.target.value;
    this.setState(state);
  }
  addInstrument(instrument) {
    var instruments = this.state.instruments;
    instrument ? instrument = instrument : instrument = this.state.customInstrument;
    var indexToRemove = instruments.indexOf(instrument);
  
    if (indexToRemove >= 0) {
      instruments.splice(indexToRemove, 1);
    } else if(instrument.length) {
      instruments.push(instrument);
    }
    this.setState({instruments: instruments}, () => {
      var availableInstruments = this.state.availableInstruments;
      indexToRemove = availableInstruments.indexOf(instrument);
      if (indexToRemove >= 0) {
        availableInstruments.splice(indexToRemove, 1);
      } else if(instrument.length){
        availableInstruments.push(instrument);
      }
      this.setState({availableInstruments: availableInstruments}, () => console.log(this.state.instruments))
 
    });
  }
  onDrop(accepted, rejected){
    console.log(accepted[0].preview)
    this.setState({musicsheet: accepted[0].preview}, () => {
      console.log('accepted: ', this.state.musicsheet);
    });
  }

  render() {
    

    return (
      <form>
        <Button bsStyle='default' style={exit} onClick={()=> this.props.closePopup()}>
          X
        </Button>
        
        <br/>
        <FormGroup>
          <ControlLabel>
            title
          </ControlLabel>
          <FormControl type="text" placeholder="your title..." onKeyUp={(e)=> this.setInput(e, 'title')}> 

          </FormControl>
            <ControlLabel>
              message
            </ControlLabel>
            <FormControl componentClass="textarea" placeholder='your message...' onKeyUp={(e)=>this.setInput(e, 'description')}>
            </FormControl>
        </FormGroup>
       
        <Well>
          <FormGroup>
            <InputGroup>
              <InputGroup.Button>
                <Button bsStyle='primary' onClick={()=> this.addInstrument() }>select</Button>
              </InputGroup.Button>
              <FormControl type="text" placeholder='custom instrument to add/remove...' onKeyUp={(e)=> this.setInput(e, 'customInstrument')}/>
            </InputGroup>
            <br/>
            <ControlLabel>
              Click instrument to add/remove
            </ControlLabel>
            <br/>
              {
                this.state.availableInstruments.map((instrument) => 
                  <Checkbox style={checkbox} inline onClick={()=> this.addInstrument(instrument)}>
                    {instrument}
                  </Checkbox>
                )
              }
          </FormGroup>

          <Well>
            <ControlLabel>Listed instruments in your post...(click to remove)</ControlLabel>
            <br/>
            <ControlLabel>
              {this.state.instruments.map((instrument, key) => 
                <Radio style={checkbox} onChange={(e)=>console.log(e)} onClick={(e)=>{this.addInstrument(instrument)}} inline checked> 
                 <Well>
                  {  instrument + ' '} 
                </Well>
                </Radio>
              )}
            </ControlLabel>
          </Well>
        </Well>

        <Grid>
        
        <div style={imgs}>
          <Row>
            <div style={dropzone}>
              <Dropzone onDrop={this.onDrop.bind(this)}> Click to upload musicsheet
              </Dropzone>
            </div>
          </Row>
          <Row>
            <div style={sheetWrapper}>
              <Label bsStyle='info'>
                {'sheet uploaded'}
              </Label>
              <br/>
              {' '}
              {
                this.state.musicsheet.length ?
                  (<img style={musicSheet} src={`${this.state.musicsheet}`}/>) :
                  ('(no sheet uploaded)')
              }
            </div>
          </Row>
  
          <br/>

          <Button bsSize='large' bsStyle='success' onClick={this.constructPost.bind(this)}>
           Post to thread
          </Button>
        </div>
        </Grid>
       
      </form>
    )
  }
}
const imgs = {
  marginRight: '30px'
}
const dropzone = {
  'marginTop': '-10px'
}
const sheetWrapper = {
  marginTop: '-125px',
  marginLeft: '4px'
}
const musicSheet = {
  width: 100,
  height: 100,
  mode: 'fit'
}
const exit = {
  float: 'right'
}
const checkbox = {
  'text-shadow': '1px 1px grey'
}


export default CreatePost;
