import { useState, useEffect, useContext } from "react";
import { LoginContext } from "../../Contexts/LoginContext";
import { useHistory, Link } from "react-router-dom";
import Navbar from "../Navbar/Navbar.jsx";
import "./CreateTicket.css";
//if we are in production mode, do not prepend localhost:3001, nginx will do that for us
const API_URL =
  process.env.NODE_ENV == "production" ? "" : "http://localhost:3001";

const CreateTicket = ({ userId, showInventoryPage, teamSelected, header }) => {
  const { state } = useContext(LoginContext);

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
        userId: state.userId,
        teamId: state.teamSelectedId,
        shortDescription: ticketInfo.shortDescription,
        fullDescription: ticketInfo.fullDescription,
        status: ticketInfo.status,
      }),
    };

    //make http request and await response, then evaluate response success and display
    //message to indicate success or failure of ticket add
    const res = await fetch(`${API_KEY}/inventory`, requestOptions);
    const response = await res.json();
    if (response.success == true) {
      addSuccess();
    } else {
      setMessage("Error: Ticket could not be added to database");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="back-box">
          {/* return to inventory page */}
          <Link id="back" to="/inventory">
            Back to Inventory
          </Link>
        </div>
        <br></br>
        <h3>Create new Ticket</h3>
        <hr></hr>
        <p id="addMessage">{ticketInfo.message}</p>
        {/* table to display input fields for user to create a ticket */}
        {/* <table id="EditTable">
          <thead className="bg-light">
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
        </table> */}

        <form>
          <div class="form-row">
            <div class="form-group col-md-6">
              <label for="inputEmail4">Email</label>
              <input
                type="email"
                class="form-control"
                id="inputEmail4"
                placeholder="Email"
              />
            </div>
            <div class="form-group col-md-6">
              <label for="inputPassword4">Password</label>
              <input
                type="password"
                class="form-control"
                id="inputPassword4"
                placeholder="Password"
              />
            </div>
          </div>
          <div class="form-group">
            <label for="inputAddress">Address</label>
            <input
              type="text"
              class="form-control"
              id="inputAddress"
              placeholder="1234 Main St"
            />
          </div>
          <div class="form-group">
            <label for="inputAddress2">Address 2</label>
            <input
              type="text"
              class="form-control"
              id="inputAddress2"
              placeholder="Apartment, studio, or floor"
            />
          </div>
          <div class="form-row">
            <div class="form-group col-md-6">
              <label for="inputCity">City</label>
              <input type="text" class="form-control" id="inputCity" />
            </div>
            <div class="form-group col-md-4">
              <label for="inputState">State</label>
              <select id="inputState" class="form-control">
                <option selected>Choose...</option>
                <option>...</option>
              </select>
            </div>
            <div class="form-group col-md-2">
              <label for="inputZip">Zip</label>
              <input type="text" class="form-control" id="inputZip" />
            </div>
          </div>
          <div class="form-group">
            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="gridCheck" />
              <label class="form-check-label" for="gridCheck">
                Check me out
              </label>
            </div>
          </div>

          {ticketInfo.submitVis && (
            <button
              id="create-ticket"
              className="btn btn-primary"
              onClick={submitClick}
            >
              Submit Ticket
            </button>
          )}
        </form>

        {/* do not show the submit button if the tickets has already been submitted */}

        <br></br>
      </div>
    </div>
  );
};

export default CreateTicket;
