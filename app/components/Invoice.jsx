"use strict";

import React from 'react';
import InvoiceStore from './../stores/InvoiceStore.jsx';
import InvoiceAction from './../stores/InvoiceActionCreator.jsx';
import auth from './../services/Authentication';
import { Link } from 'react-router';
import dateFormat from 'dateformat';

import IconButton from 'material-ui/lib/icon-button';
import FloatingActionButton from 'material-ui/lib/floating-action-button';
import FontIcon from 'material-ui/lib/font-icon';
import TextField from 'material-ui/lib/text-field';

function getInvoices() {
  return InvoiceStore.getInvoices();
}

class Invoice extends React.Component {
  constructor(props, context){
    super(props, context);
    InvoiceStore.fetchInvoices();

    this.columns = ['Name', 'Contact', 'Due date', 'Paid date', 'Items', 'Total price', 'Total tax', 'Created',];
    this.searchFields = ['name'];

    this.state = {};
    this.state.invoices = context.data;
    this.state.searchString = '';
    this.state.loggedIn = auth.loggedIn();

    this._onChange = this._onChange.bind( this );
    this._getFoundInvoices = this._getFoundInvoices.bind( this );
    this._handleRemoveInvoices = this._handleRemoveInvoices.bind( this );
    this._handleRowSelection = this._handleRowSelection.bind( this );
    this._handleCellClick = this._handleCellClick.bind( this );
  }

  componentWillMount() {
    InvoiceStore.onChange(this._onChange);
  }

  componentWillUnmount() {
    InvoiceStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    this.setState({
      invoices: getInvoices()
    });
  }

  _handleSearch(e) {
    this.setState({
      searchString: e.target.value
    });
  }

  _handleRemoveInvoices(index) {
    InvoiceAction.delete(this.state.invoices[index]);
  }

  _handleRowSelection(indexes) {
  }

  _handleCellClick(rowIndex, cellIndex) {
  }

  _getFoundInvoices(data, searchString) {
    return data.filter((invoice) => {
      let result = false;

      Object.keys(invoice).map((field) => {
        if (this.searchFields.indexOf(field) >= 0 && invoice[field].toString().toLowerCase().match( searchString )) {
          result = true;
          return;
        }
      });

      return result;
    });
  }

  render() {
    let invoices = this.state.invoices,
      searchString = this.state.searchString.trim().toLowerCase(),
      rowControlsStyle = {};

    if(searchString.length > 0){
      invoices = this._getFoundInvoices(invoices, searchString);
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
                    Search by name
                  </span>
                }
                hintStyle={{color: 'rgba(0, 0, 0, 0.41)'}}
              />
              <Link to={'invoices/add'}>
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
              {invoices.map((row, index) => {

                if (!row.contact) {
                  row.contact = {};
                }

                return (
                  <tr key={index}>
                    <td>{row.name}</td>
                    <td>
                      {row.contact.name}<br/>
                      {row.contact.companyName}<br/>
                      {row.contact.email}<br/>
                      {row.contact.phone}<br/>
                    </td>
                    <td>{row.dueDate && dateFormat(row.dueDate, 'm/d/yyyy')}</td>
                    <td>{row.paidDate && dateFormat(row.paidDate, 'm/d/yyyy')}</td>
                    <td>
                      {row.items.map((item, index) => {
                        return (
                          <div key={index}>
                            {item.name}
                          </div>
                        )
                      })}
                    </td>
                    <td>{row.totalPrice}</td>
                    <td>{row.totalTax}</td>
                    <td>{row.created && dateFormat(row.created, 'm/d/yyyy')}</td>

                    <td style={rowControlsStyle}>
                      <IconButton
                        iconClassName="fa fa-trash fa-fw"
                        onTouchTap={() => this._handleRemoveInvoices.call(this, index)}
                        />
                    </td>
                    <td style={rowControlsStyle}>
                      <Link to={`/invoices/${row._id}`}>
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

Invoice.contextTypes = {
  data: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.array
  ]).isRequired
};

export default Invoice;
