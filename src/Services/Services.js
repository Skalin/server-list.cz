import React, { Component } from 'react';
import '../App.css';
import axios from 'axios';
import ServiceItem from './ServiceItem';

class Services extends Component
{
    ApiUrl = 'http://localhost/serverlist-api/v1/services';
    state = {
        services: [],
    };

    componentDidMount() {
        axios.get(this.ApiUrl)
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

export default Services;