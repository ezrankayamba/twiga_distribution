import HomePage from "../pages/HomePage";
import LoginPage from "../pages/auth/LoginPage";
import LogoutPage from "../pages/auth/LogoutPage";
import CustomersIndex from "../pages/customers/IndexPage";
import RecordsIndex from "../pages/records/IndexPage";
import SetupsIndex from "../pages/setups/IndexPage";
import MapIndex from "../pages/map/IndexPage";
import {
  IconClient,
  IconFile,
  IconHome,
  IconSignIn,
  IconSignOut,
  IconSettings,
  IconUsers,
  IconMap,
  IconMapReport,
} from "../utils/icons/Incons";
import UsersPage from "../pages/auth/UsersPage";

const getMenus = (loggedIn, privileges) => {
  let pFilter = (m) => {
    return (
      m.privilege === "Anonymous" ||
      (loggedIn && privileges.includes(m.privilege))
    );
  };
  let id = 0;
  const getId = () => id++;
  let menus = loggedIn
    ? [
        {
          id: getId(),
          path: "/home",
          name: "Home",
          component: HomePage,
          Icon: IconHome,
          privilege: "Anonymous",
        },
        {
          id: getId(),
          path: "/users",
          name: "Users",
          component: UsersPage,
          Icon: IconUsers,
          privilege: "Users.manage",
        },
        {
          id: getId(),
          path: "/customers",
          name: "Customers",
          component: CustomersIndex,
          Icon: IconClient,
          privilege: "Customers.manage",
        },
        {
          id: getId(),
          path: "/setups",
          name: "Setups",
          component: SetupsIndex,
          Icon: IconSettings,
          privilege: "Setups.manage",
        },
        {
          id: getId(),
          path: "/map",
          name: "Map",
          component: MapIndex,
          Icon: IconMapReport,
          privilege: "Customers.manage",
        },
        {
          id: getId(),
          path: "/logout",
          name: "Sign Out",
          component: LogoutPage,
          Icon: IconSignOut,
          privilege: "Anonymous",
        },
      ]
    : [
        {
          id: getId(),
          path: "/home",
          name: "Home",
          component: HomePage,
          Icon: IconHome,
          privilege: "Anonymous",
        },
        {
          id: getId(),
          path: "/login",
          name: "Sign In",
          component: LoginPage,
          Icon: IconSignIn,
          privilege: "Anonymous",
        },
      ];
  return menus.filter(pFilter);
};
export default getMenus;
