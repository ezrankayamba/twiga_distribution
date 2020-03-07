import React, {Component} from 'react';
import Header from "../../../header";
import Pages from "../../Pages";
import { IconContext } from "react-icons";
class MainLayout extends Component {
    render() {
        return (
            <IconContext.Provider value={{ className: 'react-icons', size:"1.0rem" }}>
                <header className="app-bg-primary sticky-top main-nav">
                    <nav className="container text-light navbar navbar-dark navbar-expand-md">
                        <a href="#" className="navbar-brand">BULK PAYMENT</a>
                        <button
                            className="navbar-toggler"
                            data-toggle="collapse"
                            data-target="#navMenu"
                            aria-controls="navMenu"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                            id="menu-toggle-btn"
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navMenu">
                            <ul className="navbar-nav ml-auto">
                                <Header/>
                            </ul>
                        </div>
                    </nav>
                </header>
                <main className="container">
                    <Pages/>
                </main>
            </IconContext.Provider>
        );
    }
}

export default MainLayout;
