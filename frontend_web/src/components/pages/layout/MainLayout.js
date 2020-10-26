import React, { Component } from "react";
import Pages from "../../menus/Pages";
import SideMenu from "../../menus/SideMenu";

class MainLayout extends Component {
  state = { avatarOn: false };
  componentDidMount() {
    document.querySelector("body").addEventListener("click", (e) => {
      this.setState({ avatarOn: false });
    });
  }
  toggleAvatar(e) {
    const { avatarOn } = this.state;
    this.setState({ avatarOn: !avatarOn });
  }
  render() {
    const { avatarOn } = this.state;
    return (
      <>
        <header className="navbar">
          <div className="menu sidebar-menu-toggle">
            <i className="material-icons">menu</i>
          </div>
          <div className="navbar-title">
            DISTRIBUTION <i className="small text-warning">TRACKING TOOL</i>
          </div>
          <div className={`avatar${avatarOn ? " on" : ""}`}>
            <img
              src="https://via.placeholder.com/150"
              alt=""
              onClick={this.toggleAvatar.bind(this)}
            />
            <ul className="avatar-menu">
              <li>
                <a href="#">My Profile</a>
              </li>
              <li>
                <a href="/logout">Logout</a>
              </li>
            </ul>
          </div>
        </header>
        <SideMenu />
        <section className="main-content-wraper">
          <div className="main-content">
            <Pages />
          </div>
        </section>
      </>
    );
  }
}

export default MainLayout;
