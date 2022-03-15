import Login from "./components/Login/Login.jsx";
import Inventory from "./components/Inventory/Inventory.jsx";
import EditTicket from "./components/EditTicket/EditTicket.jsx";
import CreateTicket from "./components/CreateTicket/CreateTicket";
import OptionScreen from "./components/OptionScreen/OptionScreen.jsx";
import { LoginContext } from "./Contexts/LoginContext.js";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

//TODO: prevent states from defaulting when one state changed

function App() {
  //issue before was that on refresh of inventory page, we would revert back to default state
  //(login screen visibility true, inventory visiblity false), would require user to login again

  const [state, setState] = useState({
    userId: -1,
    username: "",
    loggedIn: false,
    teamSelectedId: -1,
    teamSelectedName: "",
    ticketObj: null,
  });

  return (
    // every time we change a value in one of the contexts provider's consumers, all consumers rerender
    <LoginContext.Provider value={{ state, setState }}>
      <div className="App mx-auto">
        <Router>
          {/* all routes go inside Routes component, makes sure that only one route shows at a time  */}
          <Switch>
            {/* default route, route for login page */}

            <Route exact path="/" component={Login}></Route>
            <Route path="/options" component={OptionScreen}></Route>
            <Route path="/inventory" component={Inventory}></Route>
            <Route path="/edit" component={EditTicket}></Route>
            <Route path="/create" component={CreateTicket}></Route>
          </Switch>
        </Router>
      </div>
    </LoginContext.Provider>
  );
}

export default App;
