"use strict";

import React from 'react';
import GridList from 'material-ui/lib/grid-list/grid-list';
import GridTile from 'material-ui/lib/grid-list/grid-tile';
import IconButton from 'material-ui/lib/icon-button';
import FlatButton from 'material-ui/lib/flat-button';
import XeroStore from './../stores/XeroStore.jsx';
import XeroAction from './../stores/XeroActionCreator.jsx';
import { Link } from 'react-router';

function getCatalog() {
  return [{
    title: "Contacts",
    url: "https://pixabay.com/static/uploads/photo/2015/11/03/09/10/meeting-1020177_960_720.jpg",
    link: "contacts"
  },{
    title: "Invoices",
    url: "https://pixabay.com/static/uploads/photo/2015/10/31/21/41/stapler-1016310_960_720.jpg",
    link: "invoices"
  }];
}


class ShowCase extends React.Component {
  constructor(props, context){
    super(props, context);
    this.state = {};
    this.state.pieces = getCatalog();
    this._onChange = this._onChange.bind( this );
    this._xeroAuthenticate = this._xeroAuthenticate.bind( this );
  }
  componentWillMount() {

  }
  componentWillUnmount() {

  }
  _onChange() {
    this.setState( {'pieces':getCatalog(), 'xeroAuthenticated':false} );
  }
  _handleSearch(e){

  }
  _xeroAuthenticate(){    
    var strWindowFeatures = "menubar=no,location=no,resizable=yes,scrollbars=no,status=no,width=1000,height=480";
    window.open("/api/xero/authenticate", "Authorize App to connect with XERO", strWindowFeatures);
    //this should poll server or wait for notification that user authenticated to Xero.
    this.setState({'pieces':getCatalog(), 'xeroAuthenticated':true});
  }
  _xeroStartSync(){
    XeroAction.startSync();
  }
  render(){
    var pieces = this.state.pieces;
    return (
      <div>
        <div className="container marginTop">
          <GridList
            cellHeight={250}>
            {pieces.map((tile) => {
              return(
                <Link
                  to={`/${tile.link}`}
                  key={tile.link}>
                  <GridTile
                    title={
                      <span>
                        <span className="title-showcase">
                          {tile.title}
                        </span>
                        {tile.medium ? '|' : ''} {tile.medium}
                      </span>
                    }

                    subtitle={
                      <div>

                    </div>
                  }
                  actionIcon={
                    <IconButton>
                    </IconButton>
                  }>
                  <img src={tile.url} />
                </GridTile>
              </Link>
            )
          })}
        </GridList>
        <br/>
        { ! this.state.xeroAuthenticated ? <FlatButton label="Authenticate with Xero" onTouchTap={this._xeroAuthenticate} secondary={true} style={{
          margin: 'auto',
          display: 'block'
        }}/> : <FlatButton label="Sync with Xero" onTouchTap={this._xeroStartSync} primary={true} style={{
          margin: 'auto',
          display: 'block'
        }}/> }

      </div>

    </div>
  )
}
}

ShowCase.contextTypes = {
  data: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.array
  ]).isRequired
};


export default ShowCase;
