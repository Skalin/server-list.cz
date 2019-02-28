import React, { Component } from 'react';
import '../App.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class ServiceItem extends Component
{
    state = {
        service: this.props.service,
        url: "service/"+this.props.service.id
    };

    render() {

        return (
            <Link to={this.state.url}>
            <div className="service">
                <h2>{this.state.service.name}</h2>
            </div>
            </Link>
        )
    }
}

export default ServiceItem