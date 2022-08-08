import React from 'react';
import logo from '../../assets/imgs/logo.png';
import { Link } from 'react-router-dom';
import './Logo.css';

function Logo(props) {
    return(
        <aside className='logo'>
            <Link to="/" className="logo">
                <img src={logo} alt="Logo do site" />
            </Link>
        </aside>
    )
}

export default Logo;