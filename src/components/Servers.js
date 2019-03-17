import React, { Component } from 'react';
import '../App.css';
import axios from 'axios';
import normalizeUrl from "normalize-url";
import {BrowserRouter as Switch, Link, Route} from "react-router-dom";
import * as config from '../config/config.js';
import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import {Context} from "./User";
import Holder from 'react-holder'


const servers = (props) => (
    <Switch>
        <div>
            <Route exact path={props.match.url} component={Servers} />
            <Route path={`${props.match.url}/servers/:serverId`} component={Server}/>
        </div>
    </Switch>
);

class Servers extends Component
{
    constructor(props)
    {
        super(props);
        this.ApiUrl = normalizeUrl(config.apiUrl+"/"+this.props.match.url+"/servers");
        this.state = {
            page: 1,
            error: null,
            isLoaded: false,
            loading: false,
            service: this.props.match.params.id,
            servers: [],
        };
    }

    componentDidMount() {
        axios.get(this.ApiUrl)
            .then((res)=> this.setState({isLoaded: true, servers: res.data}), (error) => this.setState({isLoaded: true, error}));
    }

    loadServers()
    {
        if (!this.state.loading)
        {
            this.setState({loading: true});
            this.state.page = this.state.page+1;
            console.log(this.state.page);
            axios.get(this.ApiUrl+'?page='+this.state.page)
                .then((res) => this.setState({isLoaded: true, servers: [...this.state.servers, ...res.data]}), (error) => this.setState({isLoaded: true, error}))
                .then((res) => this.setState({loading: false}))
        }
    }

    render() {
        return (
            <Context.Consumer>
                {
                    content => {
                        const { error, isLoaded, servers } = this.state;
                        const { user, logIn, logOut } = content;

                        if (error)
                        {
                            return <Container>Error: {error.message}</Container>;
                        }
                        else if (!isLoaded)
                        {
                            return <Container>Loading...</Container>;
                        }
                        else {
                            return (
                                <Container>
                                    <h1>Servers</h1>
                                    <Row>
                                        {
                                            servers.map((server) => (
                                                <Col xs={12} lg={6} key={server.id}>
                                                    <Link to={this.props.match.url + "/servers/" + server.id}>
                                                        <Card style={{border: 'none'}}>
                                                            <Card.Img variant="top" src={server.image_url} width="64px"
                                                                      height="64px"/>
                                                            <Card.Body>
                                                                <Card.Title>{server.name}</Card.Title>
                                                                <Card.Text>{server.description}</Card.Text>
                                                            </Card.Body>
                                                        </Card>
                                                    </Link>
                                                </Col>
                                            ))
                                        }
                                        <Button variant={"primary"} xs={6} md={4} onClick={this.loadServers.bind(this)} disabled={this.state.loading} block>Load more</Button>
                                    </Row>
                                </Container>
                            )
                        }
                    }

                }
            </Context.Consumer>
        );
    }
}

class Server extends Component
{

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            match: this.props.match,
            server: null,
            isLoggedIn: false,
            isOwner: false,
        };
        this.ApiUrl = normalizeUrl(config.apiUrl+this.state.match.url);
    }


    componentDidMount() {
        axios.get(this.ApiUrl)
            .then((res) => this.setState({isLoaded: true, server: res.data}), (error) => this.setState({isLoaded: true, error}))

    }

    render() {
        const { error, isLoaded, server } = this.state;
        if (error)
        {
            return <div>Error: {error.message}</div>;
        }
        else if (!isLoaded)
        {
            return <div>Loading...</div>;
        }
        else
        {
            return (
                    <Container>
                        <Row>
                            <Col xs={12}>
                                <h1>{server.name}</h1>
                                <h3>{server.ip}:{server.port}</h3>
                                <p>{server.description}
                                </p>
                            </Col>
                        </Row>
                    </Container>
            );
        }
    }
}

export default servers;