import { useEffect, useState } from "react";
import Ticket from "./Ticket";
import "./Inventory.css";

// purpose of this component is to take in a user id and get all the users tickets from the database
// via the fetchTickets function (passed as a prop from App.js)
// based on their id, then display them in a table
// dont need to user local storage here to store tickets, we can query from database on rerender w/ useEffect
const Inventory = ({
  userId,
  username,
  showEditTicketPage, //go to the Edit Ticket Page
  showCreateTicketPage, //go to the Create Ticket Page
  showOptionPage,
  fetchTickets,
  isTeamPage,
  teamName,
}) => {
  const [tickets, setTickets] = useState([]);

  //on page load... get tickets from backend by making http request and update the state to hold tickets
  //getTickets function is passed in from App component, and will fetch tickets from backend via
  //http request
  useEffect(() => {
    const getTickets = async () => {
      const ticketsFromBackend = await fetchTickets();
      setTickets(ticketsFromBackend.tickets);
    };
    getTickets();
  }, []);

  return (
    <div className="body">
      <header className="header">
        <div className="back-box">
          {/* button to return to previous page */}
          <button id="back" onClick={showOptionPage}>
            Back to Menu
          </button>
        </div>

        <div className="text-box">
          <h1 className="heading-primary">
            <span className="heading-primary-main">
              Ticket Management System
            </span>
            {/* change header to display info about current page */}
            <span className="heading-primary-sub">
              {isTeamPage
                ? `Showing Tickets for Team: ${teamName}`
                : `Showing Tickets for ${username}`}
            </span>
          </h1>
        </div>
      </header>
      {/* create ticket button, switch to Create Ticket Page on click */}
      <button id="create-ticket" onClick={showCreateTicketPage}>
        Create New Ticket
      </button>
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
        <tbody id="table-body">
          {tickets?.map((ticket, index) => (
            <Ticket
              key={index}
              ticketObj={ticket}
              showEditTicketPage={showEditTicketPage}
            />
          ))}
        </tbody>
      </table>
      <br></br>
    </div>
  );
};

export default Inventory;
