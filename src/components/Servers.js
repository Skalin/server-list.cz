import React, { Component } from 'react';
import '../App.css';
import axios from 'axios';
import normalizeUrl from "normalize-url";
import {BrowserRouter as Switch, Link, Route} from "react-router-dom";
import * as config from '../config/config.js';
import { Container, Row, Col, Card } from 'react-bootstrap'
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
            service: this.props.match.params.id,
            servers: [],
        };
    }

    componentDidMount() {
        axios.get(this.ApiUrl)
            .then(res => this.setState({servers: res.data}))
    }

    render() {
        return (
            <Context.Consumer>
                {
                    content => {
                        const {user, logIn, logOut} = content;
                        return (
                            <Container>
                                <h1>Servers</h1>
                                    <Row>
                                    {
                                        this.state.servers.map((server) => (
                                            <Col xs={12} lg={6} key={server.id}>
                                                <Link to={this.props.match.url+"/servers/"+server.id}>
                                                    <Card style={{border: 'none'}}>
                                                        <Card.Img variant="top" src={server.image_url}/>
                                                        <Card.Body>
                                                            <Card.Title>{server.name}</Card.Title>
                                                            <Card.Text>{server.description}</Card.Text>
                                                        </Card.Body>
                                                    </Card>
                                                </Link>
                                            </Col>
                                        ))
                                    }
                                    </Row>
                            </Container>
                        )
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