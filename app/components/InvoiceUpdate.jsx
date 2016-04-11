"use strict";

import React from 'react';
import reactUpdate from 'react-addons-update';
import InvoiceStore from './../stores/InvoiceStore.jsx';
import InvoiceAction from './../stores/InvoiceActionCreator.jsx';
import ContactStore from './../stores/ContactStore.jsx';
import auth from './../services/Authentication';
import dateFormat from 'dateformat';
import { Link } from 'react-router';

import Card from 'material-ui/lib/card/card';
import CardActions from 'material-ui/lib/card/card-actions';
import CardTitle from 'material-ui/lib/card/card-title';
import CardText from 'material-ui/lib/card/card-text';
import TextField from 'material-ui/lib/text-field';
import FlatButton from 'material-ui/lib/flat-button';
import Snackbar from 'material-ui/lib/snackbar';
import DatePicker from 'material-ui/lib/date-picker/date-picker';
import AutoComplete from 'material-ui/lib/auto-complete';
import MenuItem from 'material-ui/lib/menus/menu-item';
import IconButton from 'material-ui/lib/icon-button';

function getInvoice() {
  return InvoiceStore.getInvoice();
}

function getContacts() {
  return ContactStore.getContacts();
}

class InvoiceUpdate extends React.Component {
  constructor(props, context) {
    super(props, context);

    InvoiceStore.fetchInvoice(props.params.id);
    ContactStore.fetchContacts();

    this.newItem = {};
    this.state = {};
    this.state.invoice = context.data.invoice;
    this.state.contacts = context.data.contacts;
    this.state.loggedIn = auth.loggedIn();
    this.state.snackbarOpen = false;

    this._onSubmit = this._onSubmit.bind(this);
    this._onChange = this._onChange.bind(this);
    this.getContactList = this.getContactList.bind(this);
    this.handleSnackbarClose = this.handleSnackbarClose.bind(this);

    this._handleNameChange = this._handleNameChange.bind(this);
    this._handleContactChange = this._handleContactChange.bind(this);
    this._handleDueDateChange = this._handleDueDateChange.bind(this);
    this._handlePaidDateChange = this._handlePaidDateChange.bind(this);
    this._handleTotalPriceChange = this._handleTotalPriceChange.bind(this);
    this._handleTotalTaxChange = this._handleTotalTaxChange.bind(this);
    this._handleCreatedChange = this._handleCreatedChange.bind(this);

    this.addItem = this.addItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this._handleItemNameChange = this._handleItemNameChange.bind(this);
    this._handleItemPriceChange = this._handleItemPriceChange.bind(this);
    this._handleItemQuantityChange = this._handleItemQuantityChange.bind(this);
    this._handleItemUnitPriceChange = this._handleItemUnitPriceChange.bind(this);
    this._handleItemTaxChange = this._handleItemTaxChange.bind(this);

    this._handleItemInlineNameChange = this._handleItemInlineNameChange.bind(this);
    this._handleItemInlinePriceChange = this._handleItemInlinePriceChange.bind(this);
    this._handleItemInlineQuantityChange = this._handleItemInlineQuantityChange.bind(this);
    this._handleItemInlineUnitPriceChange = this._handleItemInlineUnitPriceChange.bind(this);
    this._handleItemInlineTaxChange = this._handleItemInlineTaxChange.bind(this);
  }

  componentWillMount() {
    InvoiceStore.onChange(this._onChange);
    ContactStore.onChange(this._onChange);
  }

  componentWillUnmount() {
    InvoiceStore.removeChangeListener(this._onChange);
    ContactStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    this.setState({
      invoice: getInvoice(),
      contacts: getContacts()
    });
  }

  _onSubmit() {
    InvoiceAction.update({
      _id: this.state.invoice._id,
      name: this.state.invoice.name,
      contact: this.state.invoice.contact._id,
      dueDate: this.state.invoice.dueDate,
      paidDate: this.state.invoice.paidDate,
      items: this.state.invoice.items,
      totalPrice: this.state.invoice.totalPrice,
      totalTax: this.state.invoice.totalTax,
      created: this.state.invoice.created,
    });

    this.setState({
      snackbarOpen: true,
    });
  }

  addItem() {
    let newState = reactUpdate(this.state, {
      invoice: {
        items: {
          $push: [this.newItem]
        }
      }
    });

    this.setState(newState);

    this.newItem = {};
  }
  
  removeItem(index) {
    let newState = reactUpdate(this.state, {
      invoice: {
        items: {$splice: [[index, 1]]}
      }
    });

    this.setState(newState);
  }

  getContactList(contacts) {
    let arr = [];

    contacts.forEach((item) => {
      arr.push(item.name);
    });

    return arr;
  }

  handleSnackbarClose() {
    this.setState({
      snackbarOpen: false,
    });
  }

  render() {
    if (!this.state.invoice || !this.state.contacts) {
      return (<div>data not found</div>);
    }

    if (Object.keys(this.state.invoice).length <= 0 || this.state.contacts.length <= 0) {
      return (<div>data not found</div>);
    }

    let contactsList = this.getContactList(this.state.contacts);

    let textFieldStyle = {
      display: 'block',
      margin: 'auto',
    };

    return (
      <div className="container marginTop">
        <Card>
          <CardTitle title="Update invoice" subtitle="" />
          <CardText>
            <form>
              <TextField
                hintText="Enter name"
                errorText={this.state.nameErrorText}
                floatingLabelText="Name"
                onChange={this._handleNameChange}
                value={this.state.invoice.name}
                fullWidth={true}
                style={textFieldStyle}
                />
              <AutoComplete
                hintText="Select contact"
                floatingLabelText="Contact"
                errorText={this.state.contactErrorText}
                searchText={this.state.invoice.contact.name}
                dataSource={contactsList}
                onUpdateInput={this._handleContactChange}
                onNewRequest={this._handleContactChange}
                filter={AutoComplete.noFilter}
                fullWidth={true}
                showAllItems={true}
                />
              <DatePicker
                floatingLabelText="Due date"
                hintText="Due date"
                onChange={this._handleDueDateChange}
                defaultDate={(this.state.invoice.dueDate) ? new Date(this.state.invoice.dueDate) : new Date()}
                fullWidth={true}
                style={textFieldStyle}
                autoOk={true}
                />
              <DatePicker
                floatingLabelText="Paid date"
                hintText="Paid date"
                onChange={this._handlePaidDateChange}
                defaultDate={new Date(this.state.invoice.paidDate)}
                fullWidth={true}
                style={textFieldStyle}
                autoOk={true}
                />
              <TextField
                hintText="Total price"
                floatingLabelText="Total price"
                errorText={this.state.totalPriceErrorText}
                onChange={this._handleTotalPriceChange}
                value={this.state.invoice.totalPrice}
                fullWidth={true}
                type={'number'}
                style={textFieldStyle}
                />
              <TextField
                hintText="Total tax"
                floatingLabelText="Total tax"
                errorText={this.state.totalTaxErrorText}
                onChange={this._handleTotalTaxChange}
                value={this.state.invoice.totalTax}
                fullWidth={true}
                type={'number'}
                style={textFieldStyle}
                />
              <DatePicker
                floatingLabelText="Created"
                hintText="Created"
                onChange={this._handleCreatedChange}
                defaultDate={new Date(this.state.invoice.created)}
                fullWidth={true}
                style={textFieldStyle}
                autoOk={true}
                />
              <br/>
            </form>
            <h5>Items</h5>
            <form>
              <TextField
                hintText="Enter name"
                errorText={this.state.itemNameErrorText}
                floatingLabelText="Name"
                onChange={this._handleItemNameChange}
                value={this.newItem.name}
                fullWidth={true}
                style={textFieldStyle}
                />
              <br/>
              <TextField
                hintText="Enter price"
                errorText={this.state.itemPriceErrorText}
                floatingLabelText="Price"
                onChange={this._handleItemPriceChange}
                value={this.newItem.price}
                fullWidth={true}
                style={textFieldStyle}
                type={'number'}
                />
              <br/>
              <TextField
                hintText="Enter quantity"
                errorText={this.state.itemQuantityErrorText}
                floatingLabelText="Quantity"
                onChange={this._handleItemQuantityChange}
                value={this.newItem.quantity}
                fullWidth={true}
                style={textFieldStyle}
                type={'number'}
                />
              <br/>
              <TextField
                hintText="Enter unit price"
                errorText={this.state.itemUnitPriceErrorText}
                floatingLabelText="Unit price"
                onChange={this._handleItemUnitPriceChange}
                value={this.newItem.unitPrice}
                fullWidth={true}
                style={textFieldStyle}
                type={'number'}
                />
              <br/>
              <TextField
                hintText="Enter tax"
                errorText={this.state.itemTaxErrorText}
                floatingLabelText="Tax"
                onChange={this._handleItemTaxChange}
                value={this.newItem.tax}
                fullWidth={true}
                style={textFieldStyle}
                type={'number'}
                />
              <br/>
              <FlatButton label="Add item" onTouchTap={this.addItem}/>
            </form>
            <table className="u-full-width">
              <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Unit price</th>
                <th>Tax</th>
                <th>Remove</th>
              </tr>
              </thead>
              <tbody>
                {this.state.invoice.items.map((row, index) => {
                  return (
                    <tr key={index}>
                      <td>
                        <TextField
                          hintText="Enter name"
                          floatingLabelText="Name"
                          value={row.name}
                          fullWidth={true}
                          onChange={(e) => this._handleItemInlineNameChange.call(this, e, index)}
                          />
                      </td>
                      <td>
                        <TextField
                          hintText="Price"
                          floatingLabelText="Price"
                          value={row.price}
                          fullWidth={true}
                          type={'number'}
                          onChange={(e) => this._handleItemInlinePriceChange.call(this, e, index)}
                          />
                      </td>
                      <td>
                        <TextField
                          hintText="Quantity"
                          floatingLabelText="Quantity"
                          value={row.quantity}
                          fullWidth={true}
                          type={'number'}
                          onChange={(e) => this._handleItemInlineQuantityChange.call(this, e, index)}
                          />
                      </td>
                      <td>
                        <TextField
                          hintText="Unit price"
                          floatingLabelText="Unit price"
                          value={row.unitPrice}
                          fullWidth={true}
                          type={'number'}
                          onChange={(e) => this._handleItemInlineUnitPriceChange.call(this, e, index)}
                          />
                      </td>
                      <td>
                        <TextField
                          hintText="Tax"
                          floatingLabelText="Tax"
                          value={row.tax}
                          fullWidth={true}
                          type={'number'}
                          onChange={(e) => this._handleItemInlineunitTaxChange.call(this, e, index)}
                          />
                      </td>
                      <td>
                        <IconButton
                          iconClassName="fa fa-trash fa-fw"
                          onTouchTap={() => this.removeItem.call(this, index)}
                          />
                      </td>
                    </tr>
                  )})
                }
              </tbody>
            </table>
          </CardText>
          <CardActions>
            <FlatButton label="Update" onTouchTap={this._onSubmit}/>
          </CardActions>
          <Snackbar
            open={this.state.snackbarOpen}
            message="Invoice updated"
            autoHideDuration={4000}
            onRequestClose={this.handleSnackbarClose}
            />
        </Card>
      </div>
    )
  }

  _handleItemInlineNameChange(e, index) {
    let newState = reactUpdate(this.state, {
      invoice: {
        items: {
          [index]: {
            name: {$set: e.target.value}
          }
        }
      }
    });

    this.setState(newState);
  }
  
  _handleItemInlinePriceChange(e, index) {
    let newState = reactUpdate(this.state, {
      invoice: {
        items: {
          [index]: {
            price: {$set: e.target.value}
          }
        }
      }
    });
    
    this.setState(newState);
  }
  
  _handleItemInlineQuantityChange(e, index) {
    let newState = reactUpdate(this.state, {
      invoice: {
        items: {
          [index]: {
            quantity: {$set: e.target.value}
          }
        }
      }
    });
    
    this.setState(newState);
  }
  
  _handleItemInlineUnitPriceChange(e, index) {
    let newState = reactUpdate(this.state, {
      invoice: {
        items: {
          [index]: {
            unitPrice: {$set: e.target.value}
          }
        }
      }
    });
    
    this.setState(newState);
  }
  
  _handleItemInlineTaxChange(e, index) {
    let newState = reactUpdate(this.state, {
      invoice: {
        items: {
          [index]: {
            tax: {$set: e.target.value}
          }
        }
      }
    });
    
    this.setState(newState);
  }

  _handleItemNameChange(e) {
    this.newItem.name = e.target.value;
  }

  _handleItemPriceChange(e) {
    this.newItem.price = e.target.value;
  }

  _handleItemQuantityChange(e) {
    this.newItem.quantity = e.target.value;
  }

  _handleItemUnitPriceChange(e) {
    this.newItem.unitPrice = e.target.value;
  }

  _handleItemTaxChange(e) {
    this.newItem.tax = e.target.value;
  }

  _handleNameChange(e) {
    let newState = reactUpdate(this.state, {
      invoice: {
        name: {$set: e.target.value}
      }
    });

    this.setState(newState);
  }

  _handleDueDateChange(a, value) {
    let newState = reactUpdate(this.state, {
      invoice: {
        dueDate: {$set: value}
      }
    });

    this.setState(newState);
  }

  _handlePaidDateChange(a, value) {
    let newState = reactUpdate(this.state, {
      invoice: {
        paidDate: {$set: value}
      }
    });

    this.setState(newState);
  }

  _handleTotalPriceChange(e) {
    let newState = reactUpdate(this.state, {
      invoice: {
        totalPrice: {$set: e.target.value}
      }
    });

    this.setState(newState);
  }

  _handleTotalTaxChange(e) {
    let newState = reactUpdate(this.state, {
      invoice: {
        totalTax: {$set: e.target.value}
      }
    });

    this.setState(newState);
  }

  _handleCreatedChange(a, value) {
    let newState = reactUpdate(this.state, {
      invoice: {
        created: {$set: value}
      }
    });

    this.setState(newState);
  }

  _handleContactChange(value) {
    let contactId,
      errorMsg;

    this.state.contacts.forEach((item) => {
      if (item.name === value) {
        contactId = item._id;
        return;
      }
    });

    if (!contactId) {
      contactId = this.state.invoice.contact._id;
      errorMsg ='Contact not found';
    }

    let newState = reactUpdate(this.state, {
      invoice: {
        contact: {_id: {$set: contactId}}
      },
      contactErrorText: {$set: errorMsg}
    });

    this.setState(newState);
  }
}

InvoiceUpdate.contextTypes = {
  data: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.array
  ]).isRequired
};

export default InvoiceUpdate;
