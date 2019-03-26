import 'babel-polyfill';
import "babel-standalone";
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {BrowserRouter} from 'react-router-dom'
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.css';
import * as config from './config/config.js';

import {MetaTags, ReactTitle} from 'react-meta-tags';

window.onerror = function (message, url, lineNo, colNo, error) {

    console.log(arguments);

    let container = document.createElement('div');

    container.style.color = 'red';
    container.style.position = 'fixed';
    container.style.background = '#eee';
    container.style.padding = '2em';
    container.style.top = '1em';
    container.style.left = '1em';

    let msg = document.createElement('pre');
    msg.innerText = [
        'Message: ' + message,
        'URL: ' + url,
        'Line: ' + lineNo,
        'Column: ' + colNo,
        'Stack: ' + (error && error.stack)
    ].join('\n');

    container.appendChild(msg);

    document.body.appendChild(container);
};

document.title=config.pageName;

ReactDOM.render(
	<BrowserRouter>
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
	</BrowserRouter>
    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
