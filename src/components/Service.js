import React, {Component} from 'react';
import '../App.css';
import axios from 'axios';
import {Grid, Card, CardContent, Typography} from '@material-ui/core/'
import * as config from "../config/config";
import {Link} from "react-router-dom";
import {withStyles} from '@material-ui/core/styles';
import classNames from 'classnames';
import {CardMedia, CircularProgress} from "@material-ui/core";
import Image from "react-bootstrap/Image";
import {UserProvider} from "./User";
import {MetaTags} from "react-meta-tags";

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
    progress: {
        margin: theme.spacing.unit * 2,
        color: "white"

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
        backgroundColor: "#2c2c36",
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: "all .2s ease-in-out",
        "&:hover": {
            transform: "scale(1.1, 1.1)"
        }
    },
    cardTitle: {
        color: "white",
        fontWeight: "bold",
        textDecoration: "none",
        "&:hover": {
            textDecoration: "inherit",
        }
    },
    cardMedia: {
        backgroundColor: "#55595c"
    },
    cardContent: {
        flexGrow: 1,
    }
});

class Services extends Component {

    constructor(props) {
        super(props);
        this.endpoint = normalizeUrl(config.apiUrl + '/services', {stripAuthentication: false});
        this.state = {
            services: [],
            loading: true,
            isLoaded: false,
            error: false
        };
    }

    componentDidMount() {
        axios.get(this.endpoint)
            .then(res => this.setState({services: res.data, loading: false, isLoaded: true, error: false}));
    }

    generateSeo() {
        return (
            <MetaTags>
                <meta charSet="utf-8"/>
                <title>{config.pageName}</title>
                <meta name="description"
                      content="Hledáte svůj vysněný herní server? Pak stačí hledat zde! ServerList Vám pomůže najít místo ke hraní!"/>
                <meta property="og:title" content={config.pageName}/>
                <meta property="keywords"
                      content="minecraft, counter-ctrike: global offensive, rust, csgo, cs:go, mc, server, serverlist, list, hry, servery"/>
                <meta name="robots" content="index,follow"/>
            </MetaTags>
        )
    }

    renderBackgroundCardImage(service) {
        const {classes} = this.props;
        if (service.thumbnailImageUrl) {
            return (

                <CardMedia
                    className={classes.cardMedia} title={service.name}>
                    <Image src={service.thumbnailImageUrl} fluid/>
                </CardMedia>
            );
        } else {
            return (
                <CardMedia
                    className={classes.cardMedia}
                    title={service.name}
                    image="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22288%22%20height%3D%22225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20288%20225%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_164edaf95ee%20text%20%7B%20fill%3A%23eceeef%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_164edaf95ee%22%3E%3Crect%20width%3D%22288%22%20height%3D%22225%22%20fill%3D%22%2355595c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2296.32500076293945%22%20y%3D%22118.8%22%3EThumbnail%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E"
                    />)
        }
    }

    render() {

        const {isLoaded, loading, services, error} = this.state;
        const {classes} = this.props;
        let data = <Grid><CircularProgress className={classes.progress} /></Grid>;
        if (isLoaded && !loading)
        {
            data = services.map((service) => (
                <Grid item xs={12} sm={6} md={4} key={service.id}>
                    <Link className={classes.cardTitle}  to={{pathname: '/services/' + service.id, state: {service: service}}}>
                        <Card className={classes.card}>
                            {this.renderBackgroundCardImage(service)}
                            <CardContent>
                                <Typography className={classes.cardTitle} component={"h5"}>
                                    {service.name}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Link>
                </Grid>
            ))
        }
        else if (error && !loading)
        {
            data = "Error while downloading data!";
        }
        return (
            <main>
                {this.generateSeo()}
                <div className={classes.heroUnit}>
                    <div className={classes.heroContent}>
                        <Typography component="h1" variant="h2" align="center" color={"inherit"} gutterBottom>
                            Server-List
                        </Typography>
                        <Typography variant={"h6"} align={"center"} color={"inherit"} paragraph>
                            Webová aplikace vytvořená v Reactu sloužící k monitorování herních serverů. Tato aplikace
                            byla vytvořena pro účely bakalářské práce `Game Server Monitoring Portal`.
                        </Typography>
                    </div>
                </div>
                <div className={classNames(classes.layout, classes.cardGrid)}>
                    <Grid container spacing={40} justify={"center"}>
                        {data}
                    </Grid>
                </div>
            </main>
        );
    }
}


export default withStyles(styles)(Services);
