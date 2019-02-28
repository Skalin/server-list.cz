import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import 'normalize-url';
import normalizeUrl from "normalize-url";

export class BaseComponent extends Component
{

    ApiUrl = 'http://localhost/serverlist-api/';
    ApiVersion = 'v1/';
    ApiController = '';

    constructor(props)
    {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            items: []
        };
    }

    componentDidMount() {
        let url = this.ApiUrl+this.ApiVersion;
        url = normalizeUrl(url);

        let method = this.props.method;

        fetch(
            url,
            {
                method: method,
            }
        )
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        items: result
                    });
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }
/*
    render() {
        const { error, isLoaded, items } = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <ul>
                    {items.map(item => (
                        <li key={item.name}>
                            {item.name} {item.price}
                        </li>
                    ))}
                </ul>
            );
        }
    }
    */
}