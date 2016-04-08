"use strict";

import React from 'react';
import ContactAction from './../stores/ContactActionCreator.jsx';

import FloatingActionButton from 'material-ui/lib/floating-action-button';
import Dialog from 'material-ui/lib/dialog';
import TextField from 'material-ui/lib/text-field';

class ContactAdd extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.newContact = {};
    this.state = {};
    this.state.openDialogStandardActions = false;

    this._handleAddDialogTap = this._handleAddDialogTap.bind(this);
    this._handleRequestClose = this._handleRequestClose.bind(this);
    this._onDialogSubmit = this._onDialogSubmit.bind(this);

    this._handleNameChange = this._handleNameChange.bind(this);
    this._handleCompanyNameChange = this._handleCompanyNameChange.bind(this);
    this._handleEmailChange = this._handleEmailChange.bind(this);
    this._handleSurnameChange = this._handleSurnameChange.bind(this);
    this._handlePhoneChange = this._handlePhoneChange.bind(this);
    this._handleAddressChange = this._handleAddressChange.bind(this);
  }

  _handleAddDialogTap() {
    this.setState({
      openDialogStandardActions: true,
    });
  }

  _handleRequestClose() {
    this.setState({
      openDialogStandardActions: false,
    });
  }

  _onDialogSubmit() {
    ContactAction.add({
      name: this.newContact.name,
      companyName: this.newContact.companyName,
      email: this.newContact.email,
      surname: this.newContact.surname,
      phone: this.newContact.phone,
      address: this.newContact.address,
    });

    this.setState({
      openDialogStandardActions: false,
    });

    this.newContact = {};
  }

  render() {
    let standardActions = [
      {text: 'Cancel'},
      {text: 'Submit', onTouchTap: this._onDialogSubmit, ref: 'submit'},
    ];

    let bodyStyles = {
      overflowY: 'auto'
    };

    return (
      <span>
        <FloatingActionButton
          iconClassName="fa fa-plus fa-2"
          secondary={true}
          onTouchTap={this._handleAddDialogTap}/>

        <Dialog
          ref="standardDialog"
          title="Add contact"
          actions={standardActions}
          actionFocus="submit"
          modal={this.state.modal}
          open={this.state.openDialogStandardActions}
          onRequestClose={this._handleRequestClose}
          autoDetectWindowHeight={true}
          bodyStyle={bodyStyles}>
          <form>
            <TextField
              hintText="Enter name"
              errorText={this.state.nameErrorText}
              floatingLabelText="Name"
              onChange={this._handleNameChange}
              value={this.newContact.name}
              />
            <br/>
            <TextField
              hintText="Enter company name"
              errorText={this.state.companyNameErrorText}
              floatingLabelText="Company name"
              onChange={this._handleCompanyNameChange}
              value={this.newContact.companyName}
              />
            <br/>
            <TextField
              hintText="Enter email"
              errorText={this.state.emailErrorText}
              floatingLabelText="Email"
              onChange={this._handleEmailChange}
              value={this.newContact.email}
              />
            <br/>
            <TextField
              hintText="Enter surname"
              errorText={this.state.surnameErrorText}
              floatingLabelText="Surname"
              onChange={this._handleSurnameChange}
              value={this.newContact.surname}
              />
            <br/>
            <TextField
              hintText="Enter phone"
              errorText={this.state.phoneErrorText}
              floatingLabelText="Phone"
              onChange={this._handlePhoneChange}
              value={this.newContact.phone}
              />
            <br/>
            <TextField
              hintText="Enter address"
              errorText={this.state.addressErrorText}
              floatingLabelText="Address"
              onChange={this._handleAddressChange}
              value={this.newContact.address}
              />
            <br/>
          </form>
        </Dialog>
      </span>
    )
  }

  _handleNameChange(e) {
    this.newContact.name = e.target.value;
  }

  _handleCompanyNameChange(e) {
    this.newContact.companyName = e.target.value;
  }

  _handleEmailChange(e) {
    this.newContact.email = e.target.value;

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
    this.newContact.surname = e.target.value;
  }

  _handlePhoneChange(e) {
    this.newContact.phone = e.target.value;
  }

  _handleAddressChange(e) {
    this.newContact.address = e.target.value;
  }
}

export default ContactAdd;
