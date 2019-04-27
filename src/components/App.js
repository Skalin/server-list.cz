import React, { Component } from 'react';
import '../App.css';
import Header from './../layout/Header';
import Footer from './../layout/Footer';
import Services from './Service';
import servers from './Servers';
import { Conditions }from './Conditions';
import ServerWidgetGenerator  from './Generator';
import { ServerForm } from './Servers';
import {UserProvider} from './User';
import ReactGA from 'react-ga';

import {Route} from "react-router-dom";
import {Auth} from "./Auth";

import axios from 'axios';
import Account from "./Account";
import { MetaTags } from 'react-meta-tags';
import * as config from "./../config/config";

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
                                    <Route exact path="/" render={props => (
                                        <Services />
                                    )} />
                                    <Route path="/auth" component={Auth}/>
                                    <Route path="/services/:id" component={servers} />
                                    <Route path="/account" component={Account} />
                                    <Route path="/servers/generator" component={ServerWidgetGenerator} />
                                    <Route path="/servers/add" component={ServerForm} />
                                    <Route path="/conditions" component={Conditions} />
                        </div>
                        <Footer />
                    </div>
                </UserProvider>
        );
    }
}
export default App;
