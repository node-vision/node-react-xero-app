"use strict";

import React from 'react';
import reactUpdate from 'react-addons-update';
import ContactAction from './../stores/ContactActionCreator.jsx';
import auth from './../services/Authentication';

import Card from 'material-ui/lib/card/card';
import CardActions from 'material-ui/lib/card/card-actions';
import CardTitle from 'material-ui/lib/card/card-title';
import CardText from 'material-ui/lib/card/card-text';
import TextField from 'material-ui/lib/text-field';
import FlatButton from 'material-ui/lib/flat-button';
import Snackbar from 'material-ui/lib/snackbar';

class ContactAdd extends React.Component {
  constructor(props, context) {
    super(props, context);
    
    this.state = {};
    this.state.contact = {};
    this.state.loggedIn = auth.loggedIn();
    this.state.snackbarOpen = false;
    
    this._onSubmit = this._onSubmit.bind(this);
    this._onChange = this._onChange.bind(this);
    this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
    
    this._handleNameChange = this._handleNameChange.bind(this);
    this._handleCompanyNameChange = this._handleCompanyNameChange.bind(this);
    this._handleEmailChange = this._handleEmailChange.bind(this);
    this._handleSurnameChange = this._handleSurnameChange.bind(this);
    this._handlePhoneChange = this._handlePhoneChange.bind(this);
    this._handleAddressChange = this._handleAddressChange.bind(this);
  }
  
  componentWillMount() {
  }
  
  componentWillUnmount() {
  }
  
  _onChange() {
  }
  
  _onSubmit() {
    let email = (this.checkEmail(this.state.contact.email)) ? this.state.contact.email : '';

    ContactAction.add({
      name: this.state.contact.name,
      companyName: this.state.contact.companyName,
      email: email,
      surname: this.state.contact.surname,
      phone: this.state.contact.phone,
      address: this.state.contact.address,
    });
    
    this.setState({
      contact: {},
      snackbarOpen: true,
    });
  }
  
  handleSnackbarClose() {
    this.setState({
      snackbarOpen: false,
    });
  }
  
  checkEmail(email) {
    let emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailReg.test(email);
  }
  
  render() {
    let textFieldStyle = {
      display: 'block',
      margin: 'auto',
    };
    
    return (
      <div className="container marginTop">
        <Card>
          <CardTitle title="Update contact" subtitle="" />
          <CardText>
            <form>
              <TextField
                hintText="Enter name"
                errorText={this.state.nameErrorText}
                floatingLabelText="Name"
                onChange={this._handleNameChange}
                value={this.state.contact.name}
                style={textFieldStyle}
                />
              <br/>
              <TextField
                hintText="Enter company name"
                errorText={this.state.companyNameErrorText}
                floatingLabelText="Company name"
                onChange={this._handleCompanyNameChange}
                value={this.state.contact.companyName}
                style={textFieldStyle}
                />
              <br/>
              <TextField
                hintText="Enter email"
                errorText={this.state.emailErrorText}
                floatingLabelText="Email"
                onChange={this._handleEmailChange}
                value={this.state.contact.email}
                type={'email'}
                style={textFieldStyle}
                />
              <br/>
              <TextField
                hintText="Enter surname"
                errorText={this.state.surnameErrorText}
                floatingLabelText="Surname"
                onChange={this._handleSurnameChange}
                value={this.state.contact.surname}
                style={textFieldStyle}
                />
              <br/>
              <TextField
                hintText="Enter phone"
                errorText={this.state.phoneErrorText}
                floatingLabelText="Phone"
                onChange={this._handlePhoneChange}
                value={this.state.contact.phone}
                style={textFieldStyle}
                />
              <br/>
              <TextField
                hintText="Enter address"
                errorText={this.state.addressErrorText}
                floatingLabelText="Address"
                onChange={this._handleAddressChange}
                value={this.state.contact.address}
                style={textFieldStyle}
                />
              <br/>
            </form>
          </CardText>
          <CardActions>
            <FlatButton label="Update" onTouchTap={this._onSubmit}/>
          </CardActions>
          <Snackbar
            open={this.state.snackbarOpen}
            message="Contact updated"
            autoHideDuration={4000}
            onRequestClose={this.handleSnackbarClose}
            />
        </Card>
      </div>
    )
  }
  
  _handleNameChange(e) {
    let newState = reactUpdate(this.state, {
      contact: {
        name: {$set: e.target.value}
      }
    });
    
    this.setState(newState);
  }
  
  _handleCompanyNameChange(e) {
    let newState = reactUpdate(this.state, {
      contact: {
        companyName: {$set: e.target.value}
      }
    });
    
    this.setState(newState);
  }
  
  _handleEmailChange(e) {
    let email = e.target.value,
      errorMsg = '';
    
    if (e.target.value && !this.checkEmail(e.target.value)) {
      errorMsg ='Enter a valid email address';
    }
    
    let newState = reactUpdate(this.state, {
      contact: {
        email: {$set: email}
      },
      emailErrorText: {$set: errorMsg}
    });
    
    this.setState(newState);
  }
  
  _handleSurnameChange(e) {
    let newState = reactUpdate(this.state, {
      contact: {
        surname: {$set: e.target.value}
      }
    });
    
    this.setState(newState);
  }
  
  _handlePhoneChange(e) {
    let newState = reactUpdate(this.state, {
      contact: {
        phone: {$set: e.target.value}
      }
    });
    
    this.setState(newState);
  }
  
  _handleAddressChange(e) {
    let newState = reactUpdate(this.state, {
      contact: {
        address: {$set: e.target.value}
      }
    });
    
    this.setState(newState);
  }
}

export default ContactAdd;
