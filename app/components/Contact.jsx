"use strict";

import React from 'react';
import ContactAdd from './ContactAdd.jsx'
import ContactStore from './../stores/ContactStore.jsx';
import ContactAction from './../stores/ContactActionCreator.jsx';
import auth from './../services/Authentication';
import { Link } from 'react-router';

import Table from 'material-ui/lib/table/table';
import TableHeaderColumn from 'material-ui/lib/table/table-header-column';
import TableRow from 'material-ui/lib/table/table-row';
import TableHeader from 'material-ui/lib/table/table-header';
import TableRowColumn from 'material-ui/lib/table/table-row-column';
import TableBody from 'material-ui/lib/table/table-body';
import IconButton from 'material-ui/lib/icon-button';
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
                    Search Contacts
                  </span>
                }
                hintStyle={{color: 'rgba(0, 0, 0, 0.41)'}}
              />
              <ContactAdd />
            </div>
            <Table
              multiSelectable={false}
              onRowSelection={this._handleRowSelection}
              onCellClick={this._handleCellClick}
              >
              <TableHeader
                adjustForCheckbox={false}
                displaySelectAll={false}
                >
                <TableRow>
                  {this.columns.map((column, index) => {
                    return (
                      <TableHeaderColumn key={index}>{column}</TableHeaderColumn>
                    )
                  })}

                  <TableHeaderColumn style={rowControlsStyle}></TableHeaderColumn>
                  <TableHeaderColumn style={rowControlsStyle}></TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody
                displayRowCheckbox={false}
                selectable={false}
                showRowHover={false}
                deselectOnClickaway={false}
              >
                {contacts.map((row, index) => {
                  return (
                    <TableRow key={index} selected={row.selected}>
                      <TableRowColumn>{row.name}</TableRowColumn>
                      <TableRowColumn>{row.companyName}</TableRowColumn>
                      <TableRowColumn>{row.email}</TableRowColumn>
                      <TableRowColumn>{row.surname}</TableRowColumn>
                      <TableRowColumn>{row.phone}</TableRowColumn>
                      <TableRowColumn>{row.address}</TableRowColumn>

                      <TableRowColumn style={rowControlsStyle}>
                        <IconButton
                          iconClassName="fa fa-trash fa-fw"
                          onTouchTap={() => this._handleRemoveContacts.call(this, index)}
                          />
                      </TableRowColumn>
                      <TableRowColumn style={rowControlsStyle}>
                        <Link to={`/contacts/${row._id}`}>
                          <IconButton
                            iconClassName="fa fa-edit fa-fw"
                            />
                        </Link>
                      </TableRowColumn>
                    </TableRow>
                  )
                })}
              </TableBody
              >
            </Table>
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
