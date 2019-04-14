import React, {Component} from 'react';
import {UserContext} from "./User";
import {Link, Redirect} from "react-router-dom";
import Paper from '@material-ui/core/Paper';
import * as config from "../config/config";
import axios from 'axios';
import {
    Grid,
    Button,
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    Table, TableBody, TableCell, TableHead, TableRow,
    Typography
} from "@material-ui/core";
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import {MetaTags} from "react-meta-tags";


const styles = {
    root: {
        width: '100%',
    },
    heading: {
        backgroundColor: "rgba(0, 120, 255, 1)",
        color: 'white',
    },
    white: {
        color: 'white',
    },
    black: {
        color: 'black',
    },
    icon: {
        verticalAlign: 'bottom',
        height: 20,
        width: 20,
    },
    details: {
        alignItems: 'center',
    },
    column: {
        flexBasis: '33.33%',
    },
};

class Account extends Component
{

    static contextType = UserContext;

    constructor(props)
    {
        super(props);
        this.classes = props;
        this.state = {
            servers: [],
        }
    }

    componentDidMount()
    {
            if (this.context.user.actions.getUser())
            {
                axios.post(config.apiUserUrl+'/servers', {login_token: this.context.user.actions.getRawToken()})
                    .then((res) => {this.setState({servers: res.data})});
            }
    }

    generateSeo()
    {
        return (
            <MetaTags>
                <title>{"Nastavení účtu" + config.titlePageName}</title>
                <meta name="robots" content="noindex, nofollow"/>
            </MetaTags>
        )
    }

    renderServers = () =>
    {

        let { servers } = this.state;
        let data = [];
        if (servers.length)
        {
            data =
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Server</TableCell>
                            {
                                isWidthUp('md', this.props.width) ?
                                    <TableCell>IP</TableCell> : ''
                            }
                            <TableCell>Tlačítka</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {servers.map(server => (
                            <TableRow key={server.id}>
                                <TableCell>
                                    {server.name}
                                </TableCell>
                                {
                                    isWidthUp('md', this.props.width) ?
                                    <TableCell>
                                        {server.ip}:{server.port}
                                    </TableCell> : ''
                                }
                                <TableCell align={"right"}>
                                    <Button style={styles.heading} component={Link} to={`services/${server.service_id}/servers/${server.id}`} >
                                        Detail
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>;
        }
        return (data);
    };

    renderAccount()
    {
        return (
                <Grid container justify={"center"} style={{marginTop: '25px'}}>
                    {this.generateSeo()}
                    <Grid item xs={10} >
                            <Grid container justify={"center"} spacing={16}>
                                <Grid item xs={12}>
                                    <Typography style={styles.white} variant={"h3"}>Účet</Typography>
                                </Grid>
                                <Grid item xs={12} sm={10} md={8}>
                                    <ExpansionPanel expanded={true}>
                                        <ExpansionPanelSummary style={styles.heading}>
                                            Osobní údaje
                                        </ExpansionPanelSummary>
                                        <ExpansionPanelDetails style={styles.black}>
                                            <Grid container justify={"center"}>
                                                <Grid item xs={12}>
                                                    Zde bude formulář s vypsanými údaji, bude možnost editace dat.
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Button style={styles.heading} onClick={this.context.user.actions.updateUser.bind(this)}>
                                                        Uložit
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </ExpansionPanelDetails>
                                    </ExpansionPanel>
                                </Grid>
                                <Grid item  xs={12} sm={10} md={8}>
                                    <ExpansionPanel expanded={true}>
                                        <ExpansionPanelSummary style={styles.heading}>
                                            Přihlášená zařízení
                                        </ExpansionPanelSummary>
                                        <ExpansionPanelDetails style={styles.black}>
                                            <Grid container justify={"center"}>
                                                <Grid item xs={12} md={6}>
                                                    <Button style={styles.heading} onClick={this.context.user.actions.logout.bind(this)}>
                                                        Odhlásit se
                                                    </Button>
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <Button style={styles.heading} onClick={this.context.user.actions.logoutAll.bind(this)}>
                                                        Odhlásit ze všech zařízení
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </ExpansionPanelDetails>
                                    </ExpansionPanel>
                                </Grid>
                                <Grid item xs={12} sm={10} md={8}>
                                    <ExpansionPanel expanded={true}>
                                        <ExpansionPanelSummary style={styles.heading}>
                                            Servery
                                        </ExpansionPanelSummary>
                                        <ExpansionPanelDetails style={styles.black}>
                                            <Grid container justify={"center"}>
                                                <Grid item xs={12}>
                                                    Klepnutím na tlačítko přidat můžete přidat další server!
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Button style={styles.heading} component={Link} to={'/servers/add'}>
                                                        Přidat server
                                                    </Button>
                                                </Grid>
                                                <Grid item xs={10}>
                                                    {
                                                        this.renderServers()
                                                    }
                                                </Grid>
                                            </Grid>
                                        </ExpansionPanelDetails>
                                    </ExpansionPanel>
                                </Grid>
                            </Grid>
                    </Grid>
                </Grid>
        );
    }

    render()
    {
        return(
            <>
            {this.context.user.account ? this.renderAccount() : <Redirect to={"/auth"} />}
            </>
        );
    }
}

export default withWidth()(Account);