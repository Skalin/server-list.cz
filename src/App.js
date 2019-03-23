import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './layout/Header';
import Footer from './layout/Footer';
import Services from './components/Service';
import servers from './components/Servers';
import { UserProvider } from './components/User';

import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import {Auth} from "./components/Auth";

import axios from 'axios';

axios.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';


class App extends Component {

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return true;
    }

    render() {
        return (

            <Router>
                <UserProvider>
                    <Header/>
                    <div className="App">
                        <div className="content">
                            <Route exact path="/" render={props => (
                                <Services />
                            )} />
                            <Route path="/auth" component={Auth}/>
                            <Route path="/services/:id" component={servers} />
                            <Route path="/account" component={UserProvider} />
                        </div>
                        <Footer />
                    </div>
                </UserProvider>
            </Router>
        );
    }
}

export default App;