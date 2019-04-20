import  React from 'react';
import '../App.css'
import {Link} from 'react-router-dom';
import { Navbar, Nav } from "react-bootstrap";
import NavLink from "react-bootstrap/NavLink";


const styles = {
    link: {
        color: "white",
    }
};

function Footer() {

    return (
        <Navbar fixed={"bottom"}>
            <Nav>
                <Link style={styles.link} to="/conditions">Podmínky</Link>
            </Nav>
        </Navbar>
    )
}
export default Footer;