import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.css';
import * as config from './config/config.js';

import {MetaTags, ReactTitle} from 'react-meta-tags';


document.title=config.pageName;

ReactDOM.render(
    <>

        <ReactTitle title={config.pageName} />
        <MetaTags>
            <meta charSet="utf-8" />
            <title>{config.pageName}</title>
            <meta name="description" content="Hledáte svůj vysněný herní server? Pak stačí hledat zde! ServerList Vám pomůže najít místo ke hraní!" />
            <meta property="og:title" content={config.pageName} />
            <meta property="keywords" content="minecraft, counter-ctrike: global offensive, rust, csgo, cs:go, mc, server, serverlist, list, hry, servery"/>
            <meta name="robots" content="index,follow"/>
        </MetaTags>
        <App/>
    </>

    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
