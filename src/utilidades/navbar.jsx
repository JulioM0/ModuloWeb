import React from "react";
import "../estilos/NavbarStyle.css"
const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <img src="../../public/nova.svg" alt=""/>
            </div>
            <ul className="opciones">
                <li><a className="link" href="">Agregar Atributos</a></li>
            </ul>
        </nav>
    )
}
export default Navbar;