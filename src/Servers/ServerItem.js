import React, { Component } from 'react';
import '../App.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import axios from "axios";
import normalizeUrl from "normalize-url";

class ServerItem extends Component
{
    ApiUrl = 'http://localhost/serverlist-api/v1/';

    state = {
        server: this.props.server,
        url: this.props.root
    };

    componentDidMount() {
        this.state.url += "/servers/"+this.state.server.id;
        this.ApiUrl = normalizeUrl(this.ApiUrl+this.state.url);
        axios.get(this.ApiUrl)
            .then(res => this.setState({server: res.data}));
    }

    render() {
        return (
            <React.Fragment>
            <Link to={this.state.url}>
            <div className="service">
                <h2>Server {this.state.server.name}</h2>
            </div>
            </Link>
            </React.Fragment>
        )
    }
}

export default ServerItem