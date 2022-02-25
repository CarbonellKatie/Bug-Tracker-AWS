import { useState, useEffect } from "react";
import "./CreateTicket.css";

const CreateTicket = ({ userId, showInventoryPage, teamSelected, header }) => {
  //ticket properties and message to alert user that ticket was/was not added successfully
  const [ticketInfo, setTicketInfo] = useState({
    shortDescription: "",
    fullDescription: "",
    status: "open",
    message: "",
    submitVis: true,
  });

  //set pieces of the state without resetting other pieces of state to default values on rerender
  const setShortDescription = (value) => {
    let info = { ...ticketInfo, shortDescription: value };
    setTicketInfo(info);
  };
  const setFullDescription = (value) => {
    setTicketInfo({ ...ticketInfo, fullDescription: value });
  };
  const setStatus = (value) => {
    setTicketInfo({ ...ticketInfo, status: value });
  };
  //we do need to rerender when we update the error message
  const setMessage = (message) => {
    let obj = { ...ticketInfo, message: message };
    setTicketInfo(obj);
  };

  //when ticket is added successfully, call this function to hide the submit button and display success message
  const addSuccess = () => {
    setTicketInfo({
      ...ticketInfo,
      message: "Ticket successfully added to inventory.",
      submitVis: false,
    });
  };

  //call this function when the user clicks the submit button on the Create Ticket page
  //make POST http request to backend to create a new ticket with this info
  const submitClick = async () => {
    //await... wait until data is posted so our inventory renders properly w/ new ticket added

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        teamId: teamSelected,
        shortDescription: ticketInfo.shortDescription,
        fullDescription: ticketInfo.fullDescription,
        status: ticketInfo.status,
      }),
    };

    //make http request and await response, then evaluate response success and display
    //message to indicate success or failure of ticket add
    const res = await fetch("http://localhost:8080/inventory", requestOptions);
    const response = await res.json();
    if (response.success == true) {
      addSuccess();
    } else {
      setMessage("Error: Ticket could not be added to database");
    }
  };

  return (
    <div className="body">
      <header className="header">
        <div className="back-box">
          {/* return to inventory page */}
          <button id="back" onClick={showInventoryPage}>
            Back to Inventory
          </button>
        </div>

        <div className="text-box">
          <h1 className="heading-primary">
            <span className="heading-primary-main">Create New Ticket</span>
          </h1>
        </div>
      </header>

      <p id="addMessage">{ticketInfo.message}</p>
      {/* table to display input fields for user to create a ticket */}
      <table id="EditTable">
        <thead className="thead-dark">
          <tr>
            <th>Short Description</th>
            <th>Full Description</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody id="table-body">
          <tr>
            <td>
              <textarea
                name="shortDescription"
                className="textarea"
                rows={4}
                maxLength={200}
                value={ticketInfo.shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
              />
            </td>
            <td>
              <textarea
                name="fullDescription"
                id="textarea"
                maxLength={2000}
                rows={4}
                value={ticketInfo.fullDescription}
                onChange={(e) => setFullDescription(e.target.value)}
              />
            </td>
            <td>
              <select
                id="status-select"
                defaultValue="open"
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
      {/* do not show the submit button if the tickets has already been submitted */}
      {ticketInfo.submitVis && (
        <button id="create-ticket" onClick={submitClick}>
          Submit Ticket
        </button>
      )}

      <br></br>
    </div>
  );
};

export default CreateTicket;
