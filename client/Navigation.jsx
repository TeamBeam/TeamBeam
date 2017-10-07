import React from 'react';
import ReactDOM from 'react-dom';
import { Nav, Navbar, NavItem, NavDropdown,  MenuItem} from 'react-bootstrap'
import { Link } from 'react-router-dom'
const axios = require('axios');

export default class Navigation extends React.Component {
 constructor(props) {
    super(props);
    this.state = {
      view: ""
    };
  }

  render() {
    return (
      <div>
        <Navbar collapseOnSelect fluid>
               <Navbar.Header>
                 <Navbar.Brand>
                   <Link to="/">Sound Connect</Link>
                 </Navbar.Brand>
               <Navbar.Toggle/>
               </Navbar.Header>

              <Navbar.Collapse>
               <Nav>
                 <NavItem eventKey={1} href="#"><Link to="/">Home</Link></NavItem>
                 <NavItem eventKey={2} href="#"><Link to="/forum">Forum</Link></NavItem>

                 <NavItem eventKey={3} href="#">Placeholder</NavItem>
                 <NavItem eventKey={4} href="#">Placeholder</NavItem>
               </Nav>

               { this.props.user.id ?
                 (<Nav pullRight>
                   <NavDropdown eventKey={5} title="Account" id="basic-nav-dropdown">
                     <MenuItem eventKey={5.1}>Placeholder</MenuItem>
                     <MenuItem eventKey={5.2}>Settings</MenuItem>
                     <MenuItem divider />
                     <MenuItem eventKey={5.3}><Link onClick={this.props.handleLogout} to="/login">Log Out</Link></MenuItem>
                   </NavDropdown>
                 </Nav>) :
                 (<Nav pullRight>
                   <NavDropdown eventKey={5} title="Account" id="basic-nav-dropdown">
                     <MenuItem eventKey={5.1}>Placeholder</MenuItem>
                     <MenuItem eventKey={5.2}>Settings</MenuItem>
                   </NavDropdown>
                 </Nav>)
               }
             </Navbar.Collapse>
       </Navbar>
       {this.props.children}
     </div>
    );
  }
}
