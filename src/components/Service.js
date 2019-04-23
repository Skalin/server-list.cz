import React, { Component } from 'react';
import '../App.css';
import axios from 'axios';
import { Grid, Card, CardContent, Typography } from '@material-ui/core/'
import * as config from "../config/config";
import {Link} from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import {CardMedia} from "@material-ui/core";

const normalizeUrl = require('normalize-url');

const styles = theme => ({

    heroUnit: {
        color: theme.palette.background.paper,
        backgroundColor: "#02182B",
    },
    heroContent: {
        maxWidth: 600,
        margin: '0 auto',
        padding: `${theme.spacing.unit * 8}px 0 ${theme.spacing.unit * 6}px`,
    },
    heroButtons: {
        marginTop: theme.spacing.unit * 4,
    },
    layout: {
        width: 'auto',
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
            width: 1100,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    cardGrid: {
        padding: `${theme.spacing.unit * 8}px 0`,
    },
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    cardMedia: {
        paddingTop: '56.25%', // 16:9
    },
    cardContent: {
        flexGrow: 1,
    },
});

class Services extends Component
{

    constructor(props)
    {
        super(props);
        this.endpoint = normalizeUrl(config.apiUrl+'/services', {stripAuthentication: false});
        this.state = {
            services: [],
        };
    }

    componentDidMount() {
        axios.get(this.endpoint)
            .then(res => this.setState({services: res.data}));
    }

    render() {

        const {classes} = this.props;
        let services = this.state.services;
        return (
            <main>
                <div className={classes.heroUnit}>
                    <div className={classes.heroContent}>
                        <Typography component="h1" variant="h2" align="center" color={"inherit"} gutterBottom>
                            Server-List
                        </Typography>
                        <Typography variant={"h6"} align={"center"} color={"inherit"} paragraph>
                            Webová aplikace vytvořená v Reactu sloužící k monitorování herních serverů. Tato aplikace byla vytvořena pro účely bakalářské práce `Game Server Monitoring Portal`.
                        </Typography>
                    </div>
                </div>
                <div className={classNames(classes.layout, classes.cardGrid)}>
                    <Grid container spacing={40}>
                        {
                            this.state.services.map((service) => (
                                <Grid item xs={12} sm={6} md={4} key={service.id}>
                                    <Link to={{pathname: '/services/'+service.id, state: {service: service}}}>
                                        <Card className={classes.card}>
                                            <CardMedia/>
                                            <CardContent>
                                                <Typography component={"h5"}>
                                                    {service.name}
                                                </Typography>
                                                <Typography component={"p"}>
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </Grid>
                            ))
                        }
                    </Grid>
                </div>
            </main>
        );
    }
}


export default withStyles(styles)(Services);
