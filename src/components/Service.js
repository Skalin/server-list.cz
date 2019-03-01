import React, { Component } from 'react';
import '../App.css';
import axios from 'axios';
import * as config from "../config/config";
import normalizeUrl from "normalize-url";
import {Link} from "react-router-dom";

class Service extends Component
{
    constructor(props)
    {
        super(props);
        this.endpoint = normalizeUrl(config.apiUrl+'/services');
        this.state = {
            services: [],
        };
    }

    componentDidMount() {
        axios.get(this.endpoint)
            .then(res => this.setState({services: res.data}));
    }

    render() {
        return (
            <div className="wrapper">
                <h2>Services</h2>
                <div className="services">
                {
                    this.state.services.map((service) => (
                        <ServiceItem key={service.id} service={service}/>
                    ))
                }
                </div>
            </div>
        );
    }
}


class ServiceItem extends Component
{
    state = {
        service: this.props.service,
        url: "services/"+this.props.service.id
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

export default Service;
