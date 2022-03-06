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
  });

  return (
    <LoginContext.Provider value={{ state, setState }}>
      <div className="App">
        <Router>
          {/* all routes go inside Routes component, makes sure that only one route shows at a time  */}
          <Switch>
            {/* default route, route for login page */}

            <Route exact path="/" component={Login}></Route>
            <Route path="/options" component={OptionScreen}></Route>
            <Route path="/inventory" component={Inventory}></Route>
          </Switch>

          {/* {state.showLogin && <Login loginSuccess={loginSuccess} />}
          {state.showOptionScreen && (
            <OptionScreen
              username={state.username}
              userId={state.userId}
              showIndividualPage={showIndividualPage}
              showLoginPage={showLoginPage}
              setTeamSelected={setTeamSelected}
              showTeamInventoryPage={showTeamInventoryPage}
            />
          )}
          {state.showInventory && (
            <Inventory
              userId={state.userId}
              username={state.username}
              showEditTicketPage={showEditTicketPage}
              showCreateTicketPage={showCreateTicketPage}
              showOptionPage={showOptionPage}
              fetchTickets={fetchTicketsIndividual}
              isTeamPage={false}
              teamName={"none"}
            />
          )}
          if team inventory page is selected, show only tickets with corresponding team id
          {state.showTeamInventory && (
            <Inventory
              userId={state.userId}
              username={state.username}
              showEditTicketPage={showEditTicketPage}
              showCreateTicketPage={showCreateTicketPage}
              showOptionPage={showOptionPage}
              fetchTickets={fetchTicketsTeam}
              teamName={state.teamName}
              isTeamPage={true}
            />
          )}
          {state.showEditTicket && (
            <EditTicket
              ticket={state.ticket}
              showInventoryPage={showInventoryPage}
            />
          )}
          {state.showCreateTicket && (
            <CreateTicket
              userId={state.userId}
              showInventoryPage={showInventoryPage}
              teamSelected={state.teamSelected}
            />
          )} */}
        </Router>
      </div>
    </LoginContext.Provider>
  );
}

export default App;
