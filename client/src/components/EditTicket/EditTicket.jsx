import { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import "./EditTicket.css";
import { LoginContext } from "../../Contexts/LoginContext.js";
import Navbar from "../Navbar/Navbar.jsx";

//if we are in production mode, do not prepend localhost:3001, nginx will do that for us
const API_URL =
  process.env.NODE_ENV == "production" ? "" : "http://localhost:3001";

const EditTicket = () => {
  //hooks must be inside body of functional component
  const { state, setState } = useContext(LoginContext);
  const history = useHistory();

  const [ticketInfo, setTicketInfo] = useState({
    shortDescription: state.ticketObj.short_description,
    fullDescription: state.ticketObj.full_description,
    status: state.ticketObj.status,
    message: "",
  });

  //set pieces of the state without resetting other pieces of state to default values on rerender
  const setShortDescription = (value) => {
    console.log(value);
    let info = { ...ticketInfo, shortDescription: value };
    setTicketInfo(info);
  };
  const setFullDescription = (value) => {
    setTicketInfo({ ...ticketInfo, fullDescription: value });
  };
  const setStatus = (value) => {
    setTicketInfo({ ...ticketInfo, status: value });
  };
  const setMessage = (message) => {
    console.log(message);
    let obj = { ...ticketInfo, message: message };
    setTicketInfo(obj);
  };

  const submitClick = async () => {
    //get the ticket object that was clicked on (stored in context when ticket is clicked)
    const ticket = state.ticketObj;

    const params = {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        ticketId: state.ticketObj.ticket_id,
        shortDescription: ticketInfo.shortDescription,
        fullDescription: ticketInfo.fullDescription,
        status: ticketInfo.status,
      }),
    };
    //make PUT request to backend to update the ticket with this ticketid using information from state
    const res = await fetch(`${API_URL}/inventory`, params);
    const response = await res.json();
    if (response.success == true) {
      setMessage("Ticket successfully updated.");
    } else {
      setMessage("Error: Ticket could not be updated with given information");
    }
  };

  const deleteClick = async () => {
    const params = {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        ticketId: state.ticketObj.ticket_id,
      }),
    };

    const res = await fetch(`${API_URL}/inventory`, params);
    const response = await res.json();
    if (response.success == true) {
      setMessage("Ticket successfully deleted.");
    } else {
      setMessage("Error: Ticket with given ID could not be found");
    }
    history.push("/inventory");
  };

  //additional styling if wanted later
  //<h1 id="h1class">Edit Ticket Information</h1>
  // <span className="heading-primary-sub">
  //             Edit Ticket With Id: {ticket.ticket_id}
  //           </span>

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="back-box">
          <button id="back" onClick={() => history.push("/inventory")}>
            Back to Inventory
          </button>
        </div>

        <p id="editMessage">{ticketInfo.message}</p>

        <table className="table align-middle mb-0 my-3 bg-white table-striped">
          <thead className="bg-light">
            <tr>
              <th>Ticket Number</th>
              <th>Ticket Creator ID</th>
              <th>Date Created</th>
              <th>Short Description</th>
              <th>Full Description</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody id="table-body">
            <tr>
              <td>{state.ticketObj.ticket_id}</td>
              <td>{state.ticketObj.creator_id}</td>
              <td>{new Date(state.ticketObj.date_created).toLocaleString()}</td>
              <td>
                <textarea
                  className="textarea"
                  rows={4}
                  maxLength={200}
                  value={ticketInfo.shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                />
              </td>
              <td>
                <textarea
                  name="fullDesc"
                  id="textarea"
                  maxLength={2000}
                  rows={4}
                  value={ticketInfo.fullDescription}
                  onChange={(e) => setFullDescription(e.target.value)}
                />
              </td>
              <td>
                {/* set initial setting for select menu */}
                {state.ticketObj.status.toLowerCase() == "open" && (
                  <select onChange={(e) => setStatus(e.target.value)}>
                    <option value="open" selected>
                      Open
                    </option>
                    <option value="closed">Closed</option>
                    <option value="In Progress">In Progress</option>
                  </select>
                )}
                {state.ticketObj.status.toLowerCase() == "closed" && (
                  <select onChange={(e) => setStatus(e.target.value)}>
                    <option value="Open">Open</option>
                    <option selected value="Closed">
                      Closed
                    </option>
                    <option value="In Progress">In Progress</option>
                  </select>
                )}
                {state.ticketObj.status.toLowerCase() == "in progress" && (
                  <select onChange={(e) => setStatus(e.target.value)}>
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                    <option selected value="In Progress">
                      In Progress
                    </option>
                  </select>
                )}
              </td>
            </tr>
          </tbody>
        </table>
        <div id="buttons">
          <div id="center">
            <button id="edit-ticket" onClick={submitClick}>
              Submit
            </button>
            <button id="delete-ticket" onClick={deleteClick}>
              Delete Ticket
            </button>
          </div>
        </div>

        <br></br>
      </div>
    </div>
  );
};

export default EditTicket;
