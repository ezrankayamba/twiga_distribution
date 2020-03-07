import React, {Component} from 'react';
import Header from "../../../header";
import Pages from "../../Pages";
import {IconContext} from "react-icons";
import TopHeader from "../../TopHeader";
import SideMenu from "../../SideMenu";

class MainLayout2 extends Component {
    render() {
        return (
            <>
                <div className="br-logo"><a href=""><span> </span>Bulk Payment<span> </span></a></div>
                <SideMenu/>
                <div className="br-header">
                    <TopHeader/>
                </div>
                <div className="br-mainpanel p-2">
                    <Pages/>
                </div>
            </>
        );
    }
}

export default MainLayout2;
