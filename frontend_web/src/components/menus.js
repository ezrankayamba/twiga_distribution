import HomePage from "./pages/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import LogoutPage from "./pages/auth/LogoutPage";
import ClientsIndexPage from "./pages/clients/ClientsIndexPage";
import PaymentsIndexPage from "./pages/payments/PaymentsIndexPage";
import React from "react";
import {IconClient, IconHome, IconPayment, IconSignIn, IconSignOut} from "./utils/Incons";
import UsersPage from "./pages/auth/UsersPage";

const getMenus = (loggedIn, privileges) => {
    let pFilter = (m) => {
        return m.privilege === 'Anonymous' || (loggedIn && privileges.includes(m.privilege))
    }
    let menus = loggedIn ?
        [
            {id: 1, path: "/home", name: "Home", component: HomePage, Icon: IconHome, privilege: 'Anonymous'},
            {id: 2, path: "/users", name: "Users", component: UsersPage, Icon: IconHome, privilege: 'BackOffice.manageUser'},
            {
                id: 3,
                path: "/clients",
                name: "Clients",
                component: ClientsIndexPage,
                Icon: IconClient,
                privilege: 'BackOffice.viewClients'
            },
            {
                id: 4,
                path: "/payments",
                name: "Payments",
                component: PaymentsIndexPage,
                Icon: IconPayment,
                privilege: 'Payments.viewPayments'
            },
            {
                id: 5,
                path: "/logout",
                name: "Sign Out",
                component: LogoutPage,
                Icon: IconSignOut,
                privilege: 'Anonymous'
            },

        ] : [
            {id: 1, path: "/home", name: "Home", component: HomePage, Icon: IconHome, privilege: 'Anonymous'},
            {
                id: 2,
                path: "/login",
                name: "Sign In",
                component: LoginPage,
                Icon: IconSignIn,
                privilege: 'Anonymous'
            }
        ]
    return menus.filter(pFilter);
}
export default getMenus;
