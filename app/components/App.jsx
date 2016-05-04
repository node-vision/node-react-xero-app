import React from 'react';
import ShowCase from './ShowCase.jsx';
import Contact from './Contact.jsx';
import ContactUpdate from './ContactUpdate.jsx';
import ContactAdd from './ContactAdd.jsx';
import Invoice from './Invoice.jsx';
import InvoiceUpdate from './InvoiceUpdate.jsx';
import InvoiceAdd from './InvoiceAdd.jsx';
import ShowPiece from './ShowPiece.jsx';
import Signin from './Signin.jsx';
import SignOut from './SignOut.jsx';
import About from './About.jsx';
import Header from './Header.jsx';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

export default (props) => {
  return (
    <Router history={browserHistory}>
      <Route path="/" component={Header}>
        <IndexRoute component={ShowCase}/>
        <Route path="contacts" component={Contact} />
        <Route path="contacts/add" component={ContactAdd} />
        <Route path="contacts/:id" component={ContactUpdate} />
        <Route path="invoices" component={Invoice} />
        <Route path="invoices/add" component={InvoiceAdd} />
        <Route path="invoices/:id" component={InvoiceUpdate} />
        <Route path="signin" component={Signin} />
        <Route path="signout" component={SignOut} />
        <Route path="about" component={About} />
        <Route
          path="showpiece/:id"
          component={ShowPiece} />
      </Route>
    </Router>
  );
}
