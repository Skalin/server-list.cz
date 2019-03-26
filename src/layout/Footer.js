import  React from 'react';
import '../App.css'
import { Navbar, Nav } from "react-bootstrap";
import NavLink from "react-bootstrap/NavLink";

function Footer() {

    return (
        <Navbar fixed={"bottom"}>
            <Nav>
                <NavLink href="/conditions">Podmínky</NavLink>
            </Nav>
        </Navbar>
    )
}
export default Footer;