import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import Header from './layout/Header';
import Footer from './layout/Footer';
import Services from './Services/Services';
import Servers from './Servers/Servers';
import Server from './Servers/Server';

import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class App extends Component {
  render() {
    return (
        <Router>
        <div className="App">
            <Header />
            <Route exact path="/" render={props => (
                <React.Fragment>
                <Services />
                </React.Fragment>
            )} />
            <Route exact path="/services/:id" component={Servers}/>
            <Route path="/services/:id/servers/:id" component={Server}/>
            <Footer />
        </div>
        </Router>

    );
  }
}

export default App;