"use strict";

import React from 'react';
import ReactDom from 'react-dom';
import injectTapEventPlugin from "react-tap-event-plugin";
import App from './components/App.jsx';
import DataWrapper from './components/DataWrapper.jsx';

injectTapEventPlugin();

var data = [];

ReactDom.render(<DataWrapper data={data}><App/></DataWrapper>,document.getElementById('mount'));
