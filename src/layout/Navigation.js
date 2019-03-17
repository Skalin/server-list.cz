import React, { Component } from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap'


// TODO add printing name in navigation bar, store info in tokens, get info about user for server
export class Navigation extends Component
{

    render()
    {
        return (
            <Navbar collapseOnSelect expand={false} bg="dark" variant="dark">
                <Navbar.Brand href="/">Server-list.cz</Navbar.Brand>
                <NavDropdown.Divider/>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="flex-column">
                        <Nav.Link href="/auth">Logged in as: Dominik Skála</Nav.Link>
                        <Nav.Link href="/">Home</Nav.Link>
                        <NavDropdown.Divider />
                        <Nav.Link href="#pricing">Pricing</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        )
    }

}