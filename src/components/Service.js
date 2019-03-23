import React, { Component } from 'react';
import '../App.css';
import axios from 'axios';
import { Grid, Card, Button, Icon, Paper, CardHeader, CardContent, CardMedia, Typography } from '@material-ui/core/'
import * as config from "../config/config";
import normalizeUrl from "normalize-url";
import {Link} from "react-router-dom";

class Services extends Component
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
            <Grid>
                <h2>Services</h2>
                <Grid container spacing={16}>
                    {
                        this.state.services.map((service) => (
                            <ServiceItem key={service.id} service={service}/>
                        ))
                    }
                </Grid>
            </Grid>
        );
    }
}


class ServiceItem extends Component
{
    state = {
        service: null,
        url: "services/"+this.props.service.id
    };
    componentWillMount() {
        this.setState({service: this.props.service})
    }

    render() {
        return (
            <Grid item xs={6} lg={3}>
                <Link to={this.state.url}>
                    <Card>
                        <CardContent>
                            <Typography component={"h5"}>
                                {this.state.service.name}
                            </Typography>
                        </CardContent>
                    </Card>
                </Link>
            </Grid>
        )
    }
}

export default Services;
