"use strict";

import React from 'react';
import ContactStore from './../stores/ContactStore.jsx';
import ContactAction from './../stores/ContactActionCreator.jsx';
import auth from './../services/Authentication';

import Card from 'material-ui/lib/card/card';
import CardActions from 'material-ui/lib/card/card-actions';
import CardTitle from 'material-ui/lib/card/card-title';
import CardText from 'material-ui/lib/card/card-text';
import TextField from 'material-ui/lib/text-field';
import FlatButton from 'material-ui/lib/flat-button';
import Snackbar from 'material-ui/lib/snackbar';

function getContact() {
  return ContactStore.getContact();
}

class ContactUpdate extends React.Component {
  constructor(props, context) {
    super(props, context);

    ContactStore.fetchContact(props.params.id);
    this.newContact = {};

    this.state = {};
    this.state.contact = context.data;
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
    ContactStore.onChange(this._onChange);
  }

  componentWillUnmount() {
    ContactStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    this.setState({
      contact: getContact()
    });
  }

  _onSubmit() {
    ContactAction.update({
      _id: this.state.contact._id,
      name: this.state.contact.name,
      companyName: this.state.contact.companyName,
      email: this.state.contact.email,
      surname: this.state.contact.surname,
      phone: this.state.contact.phone,
      address: this.state.contact.address,
    });

    this.setState({
      snackbarOpen: true,
    });
  }

  handleSnackbarClose() {
    this.setState({
      snackbarOpen: false,
    });
  }

  render() {
    if (!this.state.contact || !this.state.loggedIn) {
      return false;
    }

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
                defaultValue={this.state.contact.name}
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
    this.state.contact.name = e.target.value;
  }

  _handleCompanyNameChange(e) {
    this.state.contact.companyName = e.target.value;
  }

  _handleEmailChange(e) {
    this.state.contact.email = e.target.value;

    let errorMsg = '';
    let emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (e.target.value && !emailReg.test(e.target.value)) {
      errorMsg ='Enter a valid email address';
    }

    this.setState({
      emailErrorText: errorMsg
    });
  }

  _handleSurnameChange(e) {
    this.state.contact.surname = e.target.value;
  }

  _handlePhoneChange(e) {
    this.state.contact.phone = e.target.value;
  }

  _handleAddressChange(e) {
    this.state.contact.address = e.target.value;
  }
}

export default ContactUpdate;
