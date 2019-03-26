import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './layout/Header';
import Footer from './layout/Footer';
import Services from './components/Service';
import servers from './components/Servers';
import {UserProvider} from './components/User';
import ReactGA from 'react-ga';

import {Route} from "react-router-dom";
import {Auth} from "./components/Auth";

import axios from 'axios';
import Account from "./components/Account";
import { MetaTags } from 'react-meta-tags';
import * as config from "./config/config";

axios.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';

ReactGA.initialize('UA-136848512-1');
ReactGA.pageview(window.location.pathname + window.location.search);

class App extends Component {

    generateSeo()
    {
        return (
            <MetaTags>
                <meta charSet="utf-8" />
                <title>{config.pageName}</title>
                <meta name="description" content="Hledáte svůj vysněný herní server? Pak stačí hledat zde! ServerList Vám pomůže najít místo ke hraní!" />
                <meta property="og:title" content={config.pageName} />
                <meta property="keywords" content="minecraft, counter-ctrike: global offensive, rust, csgo, cs:go, mc, server, serverlist, list, hry, servery"/>
                <meta name="robots" content="index,follow"/>
            </MetaTags>
        )
    }
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return true;
    }

    render() {
        return (
                <UserProvider>
                    {this.generateSeo()}
                    <Header/>
                    <div className="App">
                        <div className="content">
                        </div>
                        <Footer />
                    </div>
                </UserProvider>
        );
    }
}

export default App;
