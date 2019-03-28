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


const styles = {
    root: {
        width: '100%',
    },
    heading: {
        backgroundColor: 'rgba(0,0,0,.03)',
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
                            <TableCell>IP</TableCell>
                            <TableCell>Tlačítka</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {servers.map(server => (
                            <TableRow key={server.id}>
                                <TableCell component={"th"} scope={"row"}>
                                    {server.name}
                                </TableCell>
                                <TableCell>
                                    {server.ip}:{server.port}
                                </TableCell>
                                <TableCell align={"right"}>
                                    <Button component={Link} to={`services/${server.service_id}/servers/${server.id}`} >
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
        let { user } = this.context;
        return (
            <Paper>
                <Grid container justify={"center"} spacing={16}>
                    <Grid item xs={12} spacing={50}>
                        <Typography variant={"h3"}>Účet</Typography>
                    </Grid>
                    <Grid item xs={12} sm={10} md={8}>
                        <ExpansionPanel>
                            <ExpansionPanelSummary style={styles.heading}>
                                Osobní údaje
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                //
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    </Grid>
                    <Grid item  xs={12} sm={10} md={8}>
                        <ExpansionPanel>
                            <ExpansionPanelSummary style={styles.heading}>
                                Nastavení účtu
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                // odhlášení z účtu + odhlášení ze všech zařízení
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    </Grid>
                    <Grid item xs={12} sm={10} md={8}>
                        <ExpansionPanel>
                            <ExpansionPanelSummary style={styles.heading}>
                                Servery
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <Grid container justify={"center"}>
                                    <Grid item xs={12}>
                                        <Button component={Link} to={'/servers/add'}>
                                            Přidat server
                                        </Button>
                                    </Grid>
                                    <Grid item xs={12}>
                                        {
                                            this.renderServers()
                                        }
                                    </Grid>
                                </Grid>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    </Grid>
                </Grid>
            </Paper>
        )
    }

    render()
    {
        return(
            this.context.user.actions.checkLogin() ? this.renderAccount() : <Redirect to={"/auth"} />
        );
    }
}

export default Account;