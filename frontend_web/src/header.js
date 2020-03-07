import {NavLink} from "react-router-dom";
import React, {Component} from 'react';
import getMenus from "./components/menus";
import {logout} from "./redux/auth/actions";
import {connect} from "react-redux";

@connect((state) => {
    return {
        loggedIn: state.auth.loggedIn,
        user: state.auth.user
    }
}, {logout: logout})
class Header extends Component {
    render() {
        let {loggedIn, user} = this.props

        let privileges = loggedIn && user && user.profile ? user.profile.role.privileges : []
        return (
            <>
                {getMenus(loggedIn, privileges).map((item) => {
                    return (
                        <li key={item.id} className="nav-item">
                            <NavLink to={item.path}
                                     className="nav-link text-secondary btn btn-light ml-1 mr-1">{item.Icon &&
                            <item.Icon/>} {item.name}</NavLink>
                        </li>
                    )
                })}
            </>
        );
    }
}

export default Header
