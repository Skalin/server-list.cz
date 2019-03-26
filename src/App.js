import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './layout/Header';
import Footer from './layout/Footer';
import Services from './components/Service';
import servers from './components/Servers';
import {UserProvider} from './components/User';
import ReactGA from 'react-ga';

import {BrowserRouter as Router, Route} from "react-router-dom";
import {Auth} from "./components/Auth";

import axios from 'axios';
import Account from "./components/Account";
import { MetaTags } from 'react-meta-tags';

axios.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';

ReactGA.initialize('UA-136848512-1');
ReactGA.pageview(window.location.pathname + window.location.search);

class App extends Component {

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return true;
    }

    render() {
        return (

            <Router>
                <UserProvider>
                    <MetaTags>
                        <meta name="google-site-verification" content="rt71yUokFLvt4XliIoFwte_B8Yw10YcRoVyiq7om5Gk" />
                    </MetaTags>
                    <Header/>
                    <div className="App">
                        <div className="content">
                            <Route exact path="/" render={props => (
                                <Services />
                            )} />
                            <Route path="/auth" component={Auth}/>
                            <Route path="/services/:id" component={servers} />
                            <Route path="/account" component={Account} />
                        </div>
                        <Footer />
                    </div>
                </UserProvider>
            </Router>
        );
    }
}

export default App;