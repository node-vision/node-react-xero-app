"use strict";

import React from 'react';
import ContactAdd from './ContactAdd.jsx'
import ContactStore from './../stores/ContactStore.jsx';
import ContactAction from './../stores/ContactActionCreator.jsx';
import auth from './../services/Authentication';
import { Link } from 'react-router';

import IconButton from 'material-ui/lib/icon-button';
import FloatingActionButton from 'material-ui/lib/floating-action-button';
import FontIcon from 'material-ui/lib/font-icon';
import TextField from 'material-ui/lib/text-field';

function getContacts() {
  return ContactStore.getContacts();
}

class Contact extends React.Component {
  constructor(props, context){
    super(props, context);
    ContactStore.fetchContacts();

    this.columns = ['Name', 'Company name', 'Email', 'Surname', 'Phone', 'Address',];
    this.searchFields = ['name', 'companyName', 'email', 'surname', 'phone', 'address',];

    this.state = {};
    this.state.contacts = context.data;
    this.state.searchString = '';
    this.state.loggedIn = auth.loggedIn();

    this._onChange = this._onChange.bind( this );
    this._getFoundContacts = this._getFoundContacts.bind( this );
    this._handleRemoveContacts = this._handleRemoveContacts.bind( this );
    this._handleRowSelection = this._handleRowSelection.bind( this );
    this._handleCellClick = this._handleCellClick.bind( this );
  }

  componentWillMount() {
    ContactStore.onChange(this._onChange);
  }

  componentWillUnmount() {
    ContactStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    this.setState({
      'contacts': getContacts()
    });
  }

  _handleSearch(e) {
    this.setState({
      searchString: e.target.value
    });
  }

  _handleRemoveContacts(index) {
    ContactAction.delete(this.state.contacts[index]);
  }

  _handleRowSelection(indexes) {
  }

  _handleCellClick(rowIndex, cellIndex) {
  }

  _getFoundContacts(data, searchString) {
    return data.filter((contact) => {
      let result = false;

      Object.keys(contact).map((field) => {
        if (this.searchFields.indexOf(field) >= 0 && contact[field].toLowerCase().match( searchString )) {
          result = true;
          return;
        }
      });

      return result;
    });
  }

  render() {
    let contacts = this.state.contacts,
      searchString = this.state.searchString.trim().toLowerCase(),
      rowControlsStyle = {};

    if(searchString.length > 0){
      contacts = this._getFoundContacts(contacts, searchString);
    }

    if (!this.state.loggedIn) {
      rowControlsStyle = {
        display: 'none'
      }
    }

    return (
        <div>
          <div className="container marginTop">
            <div className="search">
              <TextField
                value={this.state.searchString}
                onChange={this._handleSearch.bind(this)}
                hintText={
                  <span>
                    <FontIcon
                      className="fa fa-search fa-1"
                      color="rgb(158, 158, 158)"
                    />
                    Search contacts
                  </span>
                }
                hintStyle={{color: 'rgba(0, 0, 0, 0.41)'}}
              />
              <Link to={'contacts/add'}>
                <FloatingActionButton
                  iconClassName="fa fa-plus fa-2"
                  secondary={true}
                  />
              </Link>
            </div>
            <table className="u-full-width">
              <thead>
              <tr>
                {this.columns.map((column, index) => {
                  return (
                    <th key={index}>{column}</th>
                  )
                })}

                <th style={rowControlsStyle}>Remove</th>
                <th style={rowControlsStyle}>Edit</th>
              </tr>
              </thead>
              <tbody>
              {contacts.map((row, index) => {
                return (
                  <tr key={index}>
                    <td>{row.name}</td>
                    <td>{row.companyName}</td>
                    <td>{row.email}</td>
                    <td>{row.surname}</td>
                    <td>{row.phone}</td>
                    <td>{row.address}</td>

                    <td style={rowControlsStyle}>
                      <IconButton
                        iconClassName="fa fa-trash fa-fw"
                        onTouchTap={() => this._handleRemoveContacts.call(this, index)}
                        />
                    </td>
                    <td style={rowControlsStyle}>
                      <Link to={`/contacts/${row._id}`}>
                        <IconButton
                          iconClassName="fa fa-edit fa-fw"
                          />
                      </Link>
                    </td>
                  </tr>
                )
              })}
              </tbody>
            </table>
          </div>
        </div>
    )
  }
}

Contact.contextTypes = {
  data: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.array
  ]).isRequired
};

export default Contact;
