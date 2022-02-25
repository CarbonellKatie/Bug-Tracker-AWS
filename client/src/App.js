import Login from "./components/Login/Login.jsx";
import Inventory from "./components/Inventory/Inventory.jsx";
import EditTicket from "./components/EditTicket/EditTicket.jsx";
import CreateTicket from "./components/CreateTicket/CreateTicket";
import OptionScreen from "./components/OptionScreen/OptionScreen.jsx";
import { useEffect, useState } from "react";

//TODO: prevent states from defaulting when one state changed

function App() {
  //issue before was that on refresh of inventory page, we would revert back to default state
  //(login screen visibility true, inventory visiblity false), would require user to login again

  const [state, setState] = useState({
    userId: 0,
    username: "none",
    ticket: null,
    showLogin: true,
    showInventory: false,
    showEditTicket: false,
    showCreateTicket: false,
    showOptionScreen: false,
    showTeamInventory: false,
    teamSelected: 0,
    teamName: "none",
  });

  //set user data in the App.js state, do not change the rest of the state
  const setUserData = (id, user) => {
    const obj = { ...state, userId: id, username: user.username };
    setState(obj);
  };

  //set the visibility of the loginsuccess page to true, and hide all other components
  const loginSuccess = (userId, username, loginVis, optionVis) => {
    const obj = {
      ...state,
      userId: userId,
      username: username,
      showLogin: loginVis,
      showOptionScreen: optionVis,
    };
    setState(obj);
  };

  //fetch all tickets associalted with the current userId stored in the state via http request
  const fetchTicketsIndividual = async () => {
    console.log(state.userId);
    const res = await fetch(
      `http://localhost:8080/inventory/getAll/${state.userId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    const data = res.json();
    return data;
  };

  //fetch all tickets associated with the given teamid via http request
  const fetchTicketsTeam = async () => {
    console.log(state.teamSelected);
    const res = await fetch(
      `http://localhost:8080/inventory/teams/tickets/${state.teamSelected}`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    const data = res.json();
    return data;
  };

  //change visibility of login component in App.js state and hide all other components
  const showLoginPage = () => {
    const obj = {
      ...state,
      showLogin: true,
      showInventory: false,
      showEditTicket: false,
      showCreateTicket: false,
      showOptionScreen: false,
      showTeamInventory: false,
    };
    setState(obj);
  };

  //change visibility of inventory component in App.js state
  const showInventoryPage = () => {
    const obj = {
      ...state,
      showLogin: false,
      showInventory: true,
      showEditTicket: false,
      showCreateTicket: false,
      showOptionScreen: false,
      showTeamInventory: false,
    };
    setState(obj);
  };

  //show the edit ticket page for the given ticket and hide all other components
  const showEditTicketPage = (ticketObj) => {
    const obj = {
      ...state,
      ticket: ticketObj,
      showLogin: false,
      showInventory: false,
      showEditTicket: true,
      showCreateTicket: false,
      showOptionScreen: false,
      showTeamInventory: false,
    };
    setState(obj);
  };

  //show the create ticket component, hide all other components
  const showCreateTicketPage = () => {
    const obj = {
      ...state,
      showLogin: false,
      showInventory: false,
      showEditTicket: false,
      showCreateTicket: true,
      showOptionScreen: false,
      showTeamInventory: false,
    };
    setState(obj);
  };

  //go to the option screen page, make everything else invisible
  const showOptionPage = () => {
    const obj = {
      ...state,
      showLogin: false,
      showInventory: false,
      showEditTicket: false,
      showCreateTicket: false,
      showOptionScreen: true,
      showTeamInventory: false,
    };
    setState(obj);
  };

  //show tickets for the selected team with the given team id
  const showTeamInventoryPage = (teamSelected, teamName) => {
    const obj = {
      ...state,
      teamSelected: teamSelected,
      teamName: teamName,
      showLogin: false,
      showInventory: false,
      showEditTicket: false,
      showCreateTicket: false,
      showOptionScreen: false,
      showTeamInventory: true,
    };
    setState(obj);
  };

  //change the value of the current selected team in state
  const setTeamSelected = (teamId) => {
    setState({ ...state, teamSelected: teamId });
  };

  return (
    <div className="cover">
      <div className="login-component">
        {/* if showLogin is true, render a Login component and pass it a function that will
        be executed on successful login */}
        {state.showLogin && <Login loginSuccess={loginSuccess} />}
        {state.showOptionScreen && (
          <OptionScreen
            username={state.username}
            userId={state.userId}
            showInventoryPage={showInventoryPage}
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
        {/* if team inventory page is selected, show only tickets with corresponding team id */}
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
        )}
      </div>
    </div>
  );
}

export default App;
