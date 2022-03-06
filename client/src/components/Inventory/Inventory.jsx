import { useEffect, useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import Ticket from "./Ticket";
import "./Inventory.css";
import { LoginContext } from "../../Contexts/LoginContext.js";

// purpose of this component is to take in a user id and get all the users tickets from the database
// via the fetchTickets function (passed as a prop from App.js)
// based on their id, then display them in a table
// dont need to user local storage here to store tickets, we can query from database on rerender w/ useEffect
const Inventory = () => {
  const [tickets, setTickets] = useState([]);
  const { state, setState } = useContext(LoginContext);

  //on page load... get tickets from backend by making http request and update the state to hold tickets
  //getTickets function is passed in from App component, and will fetch tickets from backend via
  //http request
  useEffect(() => {
    const fetchTickets =
      state.teamSelectedId <= 0 ? fetchTicketsIndividual : fetchTicketsTeam;

    //await promise to get tickets from backend, then update the state of this component to contain the tickets
    const getTickets = async () => {
      const ticketsFromBackend = await fetchTickets();
      setTickets(ticketsFromBackend.tickets);
    };
    getTickets();
  }, []);

  //fetch all tickets associalted with the current userId stored in the state via http request
  const fetchTicketsIndividual = async () => {
    console.log(state.userId);
    const res = await fetch(
      `http://localhost:3001/inventory/getAll/${state.userId}`,
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
      `http://localhost:3001/inventory/teams/tickets/${state.teamSelected}`,
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
  return (
    <div className="body">
      <header className="header">
        <div className="back-box">
          {/* button to return to previous page */}
          <Link id="back" to="/options">
            Back to Menu
          </Link>
        </div>

        <div className="text-box">
          <h1 className="heading-primary">
            <span className="heading-primary-main">
              Ticket Management System
            </span>
            {/* change header to display info about current page */}
            <span className="heading-primary-sub">
              {state.isTeamPage
                ? `Showing Tickets for Team: ${state.teamName}`
                : `Showing Tickets for ${state.username}`}
            </span>
          </h1>
        </div>
      </header>
      {/* create ticket button, switch to Create Ticket Page on click */}
      <Link to="/create" id="create-ticket">
        Create New Ticket
      </Link>
      {/* create tickets table to display user or team tickets */}
      <table className="table">
        <thead className="thead-dark">
          <tr>
            <th>Ticket #</th>
            <th>Ticket Creator ID</th>
            <th>Date Created</th>
            <th>Short Description</th>
            <th>Status</th>
          </tr>
        </thead>
        {/* map through tickets array and create a ticket component for every ticket object */}
        {/* pass Ticket component the ticket information (in the form of a ticket object) and a 
        function to toggle the visibility of the edit ticket page */}
        <tbody id="table-body">
          {tickets?.map((ticket, index) => (
            <Ticket key={index} ticketObj={ticket} />
          ))}
        </tbody>
      </table>
      <br></br>
    </div>
  );
};

export default Inventory;
