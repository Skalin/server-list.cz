import React, {Component} from 'react';
import '../../App.css';
import {ServerReview} from './ServerReview';
import axios from 'axios';
import {Link, Route, Switch, withRouter} from "react-router-dom";
import * as config from '../../config/config.js';
import {styles} from '../../config/styles.js';
import withWidth from '@material-ui/core/withWidth';
import {SupervisorAccount, Visibility, VisibilityOff} from '@material-ui/icons';
import {Button, Card, CardContent, CardMedia, Grid, Typography} from '@material-ui/core/'
import {MetaTags} from 'react-meta-tags';
import withStyles from "@material-ui/core/es/styles/withStyles";
import classNames from 'classnames';
import {UserContext} from "../User";
import {CircularProgress} from "@material-ui/core";
import Image from "react-bootstrap/Image";
import {View} from "./View";

function servers(props) {
    return (
        <Switch>
            <Route exact path={props.match.url} component={withStyles(styles)(withRouter(Servers))}/>
            <Route exact path={`${props.match.url}/servers/:serverId`}
                   component={withWidth({resizeInterval: 20})(withStyles(styles)(View))}/>
            <Route path={`${props.match.url}/servers/:serverId/review`}
                   component={withWidth()(withStyles(styles)(ServerReview))}/>
        </Switch>
    );
}

class Servers extends Component {
    constructor(props) {
        super(props);
        this.url = config.normalizeUrl(config.apiUrl + "/" + this.props.match.url, {stripAuthentication: false});
        this.ApiUrl = config.normalizeUrl(this.url + "/servers", {stripAuthentication: false});
        this.state = {
            page: 2,
            error: null,
            serviceLoaded: false,
            serviceLoading: false,
            serversLoaded: false,
            serversLoading: false,
            service: this.props.match.params.id,
            servers: [],
            serviceObject: (typeof this.props.location.state !== 'undefined') ? this.props.location.state.service : null
        };
    }

    componentDidMount() {

        if (!this.state.serviceObject) {
            this.setState({serviceLoading: true});
            axios.get(this.url)
                .then((res) => {
                    this.setState({serviceLoaded: true, serviceObject: res.data}, () => (
                        this.setState({serviceLoading: false})
                    ));
                });

        } else {
            this.setState({serviceLoaded: true})
        }

        this.setState({serversLoading: true});
        axios.get(this.ApiUrl)
            .then((res) => {
                    this.setState({serversLoaded: true, servers: res.data}, () => (this.setState({serversLoading: false})))
                },
                (error) => {
                    this.setState({serversLoaded: true, error})
                });
    }

    loadServers() {
        if (!this.state.serversLoading) {
            this.setState({serversLoading: true});
            this.setState({page: (1 + this.state.page)});
            axios.get(this.ApiUrl + '?page=' + this.state.page)
                .then((res) => {
                    this.setState({serversLoaded: true, servers: [...this.state.servers, ...res.data]},
                        () => {
                            this.setState({serversLoading: false})
                        })
                }, (error) => {
                    this.setState({serversLoaded: true, error})
                });
        }
    }


    renderBackgroundCardImage(server) {
        const {classes} = this.props;
        if (server.imageUrl) {
            return (

                <CardMedia
                    className={classes.cardMedia} title={server.name}>
                    <Image src={server.imageUrl} fluid/>
                </CardMedia>
            );
        } else {
            return (
                <CardMedia
                    component="img"
                    image="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22288%22%20height%3D%22225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20288%20225%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_164edaf95ee%20text%20%7B%20fill%3A%23eceeef%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_164edaf95ee%22%3E%3Crect%20width%3D%22288%22%20height%3D%22225%22%20fill%3D%22%2355595c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2296.32500076293945%22%20y%3D%22118.8%22%3EThumbnail%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E"
                    className={classes.cardMedia}
                    title={server.name}
                />)
        }
    }

    renderPlayersBadge(server) {

        const {stats} = server;
        const {classes} = this.props;

        if (stats && stats.StatusStat && stats.StatusStat.value && stats.PlayersStat && stats.PlayersStat.value !== null && stats.PlayersStat.maxValue !== null) {
            let data = stats.PlayersStat.value + "/" + stats.PlayersStat.maxValue;
            return (
                <div className={classes.header}>
                    <SupervisorAccount/>
                    <Typography color={"inherit"}>
                        {data}
                    </Typography>
                </div>
            )
        }
    }

    renderStatusBadge(server) {

        const {classes} = this.props;

        if (server.stats && server.stats.StatusStat) {
            const icon = server.stats.StatusStat.value ? <Visibility color={"inherit"}/> :
                <VisibilityOff color={"inherit"}/>;
            return (
                <div className={classes.header}>
                    {icon}
                    <Typography color={"inherit"}>
                        {server.stats.StatusStat.value ? "Online" : "Offline"}
                    </Typography>
                </div>
            );
        }
    }

    renderStats(server) {
        let data =
            <Grid container justify={"center"}>
                <Grid item xs={server.stats.StatusStat.value ? 6 : 12}>
                    {this.renderStatusBadge(server)}
                </Grid>
                {
                    server.stats.StatusStat.value ?
                        <Grid item xs={6}>
                            {this.renderPlayersBadge(server)}
                        </Grid>
                        : null
                }
            </Grid>;
        return (data)
    }

    generateSeo() {
        if (this.state.serviceObject) {
            return (
                <MetaTags>
                    <title>{this.state.serviceObject.name + " servery" + config.titlePageName}</title>
                    <meta name="description" content={this.state.serviceObject.description}/>
                    <meta property="og:title" content={this.state.serviceObject.name}/>
                </MetaTags>
            )
        }
    }


    getIp = (server) => {
        return ((!server.show_port && server.domain && server.domain.length) ? server.domain : server.ip + ":" + server.port);
    };

    renderServers() {
        const {servers} = this.state;
        const {classes} = this.props;

        if (servers.length > 0) {
            return (
                servers.map((server) => (
                    <Grid item xs={12} sm={6} md={4} key={server.id}>
                        <Card className={classes.card}>
                            <Link to={this.props.match.url + "/servers/" + server.id} className={styles.serverItem}>
                                {
                                    this.renderBackgroundCardImage(server)
                                }
                            </Link>
                            <CardContent>
                                <Grid container justify={"center"}>
                                    <Grid item xs={12}>
                                        <Link to={this.props.match.url + "/servers/" + server.id}
                                              className={classNames(styles.serverItem, classes.cardTitle)}>
                                            <Typography className={classes.cardTitle} component={"h5"}>
                                                {server.name}
                                            </Typography>
                                        </Link>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography style={{color: "white", margin: "1em"}}>
                                            IP: {this.getIp(server)}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        {
                                            this.renderStats(server)
                                        }
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                )))
        } else {
            return (<Grid item xs={12}>Momentálně zde nejsou žádné servery.</Grid>)
        }
    }

    renderLoadButton() {
        const {servers} = this.state;
        const {classes} = this.props;

        if ((servers.length > 0) && (servers.length < this.state.serviceObject.serverCount)) {
            return (
                this.state.serversLoading ? <Grid><CircularProgress className={classes.progress}/></Grid> :
                    <Button variant={"contained"} size={"large"} color={"primary"} onClick={this.loadServers.bind(this)}
                            disabled={this.state.serversLoading} className={classes.button}>
                        Načíst další
                    </Button>
            )
        }

    }

    renderService = (classes) => {
        return (
            <>
                {this.generateSeo()}
                <div className={classes.heroUnit}>
                    <div className={classes.heroContent}>
                        <Typography component="h1" variant="h2" align="center" color={"inherit"} gutterBottom>
                            {this.state.serviceObject.name}
                        </Typography>
                        <Typography variant={"h6"} align={"center"} color={"inherit"} paragraph>
                            {this.state.serviceObject.description}
                        </Typography>
                    </div>
                </div>
            </>
        )
    };


    render() {
        const {classes} = this.props;
        return (
            <UserContext.Consumer>
                {
                    content => {
                        const {error} = this.state;
                        let data, service = null;
                        if (error) {
                            data = <Grid>Error: {error.message}</Grid>;
                        } else if (!this.state.serversLoaded) {
                            data = <Grid><CircularProgress className={classes.progress}/></Grid>;
                        } else {
                            data = (this.renderServers())
                        }

                        if (!this.state.serviceLoaded) {
                            service = <Grid><CircularProgress className={classes.progress}/></Grid>;
                        } else {
                            service = (this.renderService(classes));
                        }

                        return (
                            <main>
                                {service}
                                <div className={classNames(classes.layout, classes.cardGrid)}>
                                    <Grid container spacing={40} justify={"center"}>
                                        {data}
                                    </Grid>
                                    <Grid item xs={12}>
                                        {this.renderLoadButton()}
                                    </Grid>
                                </div>
                            </main>

                        )
                    }

                }
            </UserContext.Consumer>
        );
    }
}


export default servers;
