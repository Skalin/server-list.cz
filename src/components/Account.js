import React, {Component} from 'react';
import {UserContext} from "./User";
import {Link, Redirect} from "react-router-dom";
import * as config from "../config/config";
import axios from 'axios';
import {
    Grid,
    Button,
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    Table, TableBody, TableCell, TableHead, TableRow,
    Typography, Dialog, DialogTitle, DialogActions, IconButton, DialogContent, DialogContentText, Tooltip
} from "@material-ui/core";
import withWidth, {isWidthUp} from '@material-ui/core/withWidth';
import {MetaTags} from "react-meta-tags";
import DeleteIcon from '@material-ui/icons/Delete';
import PageviewIcon from '@material-ui/icons/Pageview';

const normalizeUrl = require('normalize-url');

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
    headingButton: {
        backgroundColor: "rgba(0, 120, 255, 1)",
        color: 'white',
        margin: "1em",
    },
    column: {
        flexBasis: '33.33%',
    },
    headingButtonRed: {
        backgroundColor: "rgba(209, 10, 60, 1)",
        color: 'white',
        margin: "1em",
    }
};

class Account extends Component {

    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.classes = props;
        this.state = {
            servers: [],
            dialogOpen: false,
        }
    }

    componentDidMount() {
        if (this.context.user.actions.getUser()) {
            this.setServers();
        }
    }

    setServers = () => {

        axios.post(config.apiUserUrl + '/servers', {login_token: this.context.user.actions.getRawToken()})
            .then((res) => {
                this.setState({servers: res.data})
            });
    };

    generateSeo = () => {
        return (
            <MetaTags>
                <title>{"Nastavení účtu" + config.titlePageName}</title>
                <meta name="robots" content="noindex, nofollow"/>
            </MetaTags>
        )
    };

    renderServers = () => {

        let {servers} = this.state;
        let data = [];
        if (servers.length) {
            data =
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Server</TableCell>
                            {
                                isWidthUp('md', this.props.width) ?
                                    <TableCell>IP</TableCell> : null
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
                                        </TableCell> : null
                                }
                                <TableCell align={"right"}>
                                    {this.renderDetailButton(server)}
                                    {this.renderDeleteButton(server)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>;
        }
        return (data);
    };

    renderDetailButton = (server) => {
        return (
            <Tooltip title="Detail">
                <IconButton style={styles.headingButton} component={Link}
                            to={`services/${server.service_id}/servers/${server.id}`}>
                    <PageviewIcon/>
                </IconButton>
            </Tooltip>
        )
    };

    handleDeleteButton = () => {
        this.setState({dialogOpen: true});
    };

    handleDialogClose = () => {
        this.setState({dialogOpen: false})
    };

    handleDeleteServer = (server) => {
        let deleteServerUrl = normalizeUrl(config.apiUrl + "/services/" + server.service_id + "/servers/" + server.id, {stripAuthentication: false});
        axios.delete(deleteServerUrl, {data: {'login_token': this.context.user.actions.getRawToken()}})
            .then((res) => {
                    this.setServers();
                    this.handleDialogClose();
                }
            );
    };

    renderDeleteButton = (server) => {
        return (
            <>

                <Tooltip title="Smazat">
                    <IconButton variant={"outlined"} style={styles.headingButtonRed} onClick={this.handleDeleteButton}>
                        <DeleteIcon/>
                    </IconButton>
                </Tooltip>
                <Dialog open={this.state.dialogOpen} onClose={this.handleDialogClose}>
                    <DialogTitle>Opravdu si přejete smazat server?</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Smazáním serveru `{server.name}` - {server.ip}:{server.port} dojde k jeho nenávratnému
                            smazání. Nebude dostupný ve výpisu serveru, nikdo jej nebude moci najít a nebudou o něm
                            sbírány žádné statistiky.
                        </DialogContentText>
                        <DialogActions>
                            <Button onClick={this.handleDialogClose}>
                                Ne
                            </Button>
                            <Button onClick={this.handleDeleteServer.bind(this, server)}>
                                Ano
                            </Button>
                        </DialogActions>
                    </DialogContent>
                </Dialog>
            </>
        )
    };


    renderAccount() {
        return (
            <Grid container justify={"center"} style={{marginTop: '25px'}}>
                {this.generateSeo()}
                <Grid item xs={12} sm={10}>
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
                                    <Grid container justify={"center"} spacing={16}>
                                        <Grid item xs={12}>
                                            Zde bude formulář s vypsanými údaji, bude možnost editace dat.
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Button style={styles.heading}
                                                    onClick={this.context.user.actions.updateUser.bind(this)}>
                                                Uložit
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        </Grid>
                        <Grid item xs={12} sm={10} md={8}>
                            <ExpansionPanel expanded={true}>
                                <ExpansionPanelSummary style={styles.heading}>
                                    Nástroje
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails style={styles.black}>
                                    <Grid container justify={"center"} spacing={16}>
                                        <Grid item xs={12}>
                                            <Typography variant={"h3"} style={{margin: "1em"}}>
                                                Odhlášení
                                            </Typography>
                                            <Typography>
                                                Využitím jednoho z těchto nástrojů se můžete odhlásit z tohoto zařízení
                                                a nebo se odhlásit ze všech zařízení, na kterých jste se v průběhu
                                                posledních 30 dní přihlásil.
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Button style={styles.headingButton}
                                                    onClick={this.context.user.actions.logout.bind(this)}>
                                                Odhlásit se
                                            </Button>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Button style={styles.headingButtonRed}
                                                    onClick={this.context.user.actions.logoutAll.bind(this)}>
                                                Odhlásit ze všech zařízení
                                            </Button>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant={"h3"} style={{margin: "1em"}}>
                                                Generátor widgetů
                                            </Typography>
                                            <Typography>
                                                Generátor widgetů slouží k tvorbě jednoduchých statusů pro vkládání na
                                                Váš web. Jedná se o jednoduchý nástroj umožňující generování PHP a
                                                jQuery widgetů. Widgety stačí do webu pouze zkopírovat, není nutné nic
                                                dalšího řešit.
                                            </Typography>
                                            <Button component={Link} style={styles.headingButton}
                                                    to={'/servers/generator'}>
                                                Generátor widgetů pro weby
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
                                    <Grid container justify={"center"} spacing={16}>
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

    render() {
        return (
            <>
                {this.context.user.account ? this.renderAccount() : <Redirect to={"/auth"}/>}
            </>
        );
    }
}

export default withWidth()(Account);