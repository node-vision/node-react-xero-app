"use strict";

import React from 'react';
import GridList from 'material-ui/lib/grid-list/grid-list';
import GridTile from 'material-ui/lib/grid-list/grid-tile';
import IconButton from 'material-ui/lib/icon-button';
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
  }
  componentWillMount() {

  }
  componentWillUnmount() {

  }
  _onChange() {
    this.setState( {'pieces':getCatalog()} );
  }
  _handleSearch(e){

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
