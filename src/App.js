import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './layout/Header';
import Footer from './layout/Footer';
import Service from './components/Service';
import servers from './components/Servers';
import { withCookies } from 'react-cookie';

import { BrowserRouter as Switch, Route } from "react-router-dom";


class App extends Component {
    render() {
        return (
            <Switch>
            <div className="App">
                <Header />
                <Route exact path="/" render={props => (
                    <Service />
                )} />
                <Route path="/services/:id" component={servers} />
                <Footer />
            </div>
            </Switch>
        );
    }
}

export default withCookies(App);