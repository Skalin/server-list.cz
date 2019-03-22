import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './layout/Header';
import Footer from './layout/Footer';
import Service from './components/Service';
import servers from './components/Servers';
import { UserProvider } from './components/User';

import { BrowserRouter as Switch, Route } from "react-router-dom";
import {Auth} from "./components/Auth";

import axios from 'axios';

axios.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';


class App extends Component {
    render() {
        return (
                <Switch>
                    <UserProvider>
                    <div className="App">
                        <Header />
                        <div className="content">
                            <Route exact path="/" render={props => (
                                <Service />
                            )} />
                            <Route path="/auth" component={Auth}/>
                            <Route path="/services/:shortcut" component={servers} />
                        </div>
                        <Footer />
                    </div>
                    </UserProvider>
                </Switch>
        );
    }
}

export default App;