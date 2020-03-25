import React, {Component} from 'react';
import Pages from "../../menus/Pages";
import TopHeader from "../../menus/TopHeader";
import SideMenu from "../../menus/SideMenu";

class MainLayout extends Component {
    render() {
        return (
            <>
                <div className="br-logo"><a href="">Twiga - DTT</a></div>
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

export default MainLayout;
