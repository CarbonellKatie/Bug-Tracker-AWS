import { useState, useEffect, useContext } from "react";
import { LoginContext } from "../../Contexts/LoginContext";
import { useHistory, Link } from "react-router-dom";
import Navbar from "../Navbar/Navbar.jsx";
import "./CreateTicket.css";
//if we are in production mode, do not prepend localhost:3001, nginx will do that for us
const API_URL =
  process.env.REACT_APP_NODE_ENV == "development"
    ? "http://localhost:3001"
    : "";

const CreateTicket = ({ userId, showInventoryPage, teamSelected, header }) => {
  const { state } = useContext(LoginContext);

  //ticket properties and message to alert user that ticket was/was not added successfully
  const [ticketInfo, setTicketInfo] = useState({
    status: "open",
    message: "",
    submitVis: true,
  });

  const teamName =
    state.teamSelectedId > 0 ? state.teamSelectedName : "No Team Selected";
  const teamId =
    state.teamSelectedId > 0 ? `Team Id: ${state.teamSelectedId}` : "";

  //set pieces of the state without resetting other pieces of state to default values on rerender
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
  const submitClick = async (e) => {
    //await... wait until data is posted so our inventory renders properly w/ new ticket added
    e.preventDefault();
    const shortDescription = e.target.elements[0].value;
    const fullDescription = e.target.elements[1].value;
    const status = e.target.elements[2].value;

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        userId: state.userId,
        teamId: state.teamSelectedId,
        shortDescription: shortDescription,
        fullDescription: fullDescription,
        status: status,
      }),
    };

    //make http request and await response, then evaluate response success and display
    //message to indicate success or failure of ticket add
    const res = await fetch(`/inventory`, requestOptions);
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
        <br></br>
        <div className="col-md-10 form-parent">
          <div className="row no-gutters mrow">
            <div className="col-md-9">
              <div className="row no-gutters">
                <h3>Create New Ticket</h3>
              </div>
              <div className="row no-gutters mrow">
                <h5>
                  {state.teamSelectedId > 0
                    ? `Associated Team: ${state.teamSelectedName}`
                    : `Create Individual Ticket for ${state.username}`}
                </h5>
              </div>
            </div>
            <div className="col-md-3 back-class">
              {/* return to inventory page */}
              <div id="center-parent">
                <div id="center-link">
                  <Link id="back-to-inv" to="/inventory">
                    Back to Inventory
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <hr className="mt-1"></hr>
          {/* <p id="addMessage">{ticketInfo.message}</p> */}
          {ticketInfo.message != "" && (
            <div className="alert alert-success" role="alert">
              {ticketInfo.message}
            </div>
          )}

          {/*  display input fields for user to create a ticket */}
          <form onSubmit={submitClick} id="create-form">
            <div className="form-row px-5">
              <div className="form-group col-md-12 pt-5">
                <h2 id="enter-ticket-info">Enter Ticket Information</h2>
              </div>
            </div>

            <div className="form-row px-5">
              <div className="form-group col-md-6 pt-3">
                <label id="l1" for="short-description">
                  Short Description
                </label>
                <textarea
                  class="form-control"
                  id="short-description"
                  rows="5"
                  // placeholder="summary"
                ></textarea>
              </div>
              <div class="form-group col-md-6 pt-3">
                <label id="l2" for="full-description">
                  Full Description
                </label>
                <textarea
                  rows="5"
                  class="form-control"
                  id="full-description"
                  // placeholder="long description"
                />
              </div>
            </div>
            {/* row 3 */}
            <div className="form-row">
              <div class="form-group px-5 col-md-6">
                <label for="inputState">Status</label>
                <select
                  id="status-select"
                  class="form-control"
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option selected>Open</option>
                  <option>In Progress</option>
                  <option>Closed</option>
                </select>
              </div>
            </div>
            <div className="form-row px-5 pb-5">
              {ticketInfo.submitVis && (
                <button
                  type="submit"
                  id="create-btn"
                  className="btn btn-primary"
                  // onClick={submitClick}
                >
                  Submit Ticket
                </button>
              )}
            </div>
            {/* <div class="form-group">
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="gridCheck"
                />
                <label class="form-check-label" for="gridCheck">
                  Check me out
                </label>
              </div>
            </div> */}
          </form>

          {/* do not show the submit button if the tickets has already been submitted */}
        </div>
        <br></br>
      </div>
    </div>
  );
};

export default CreateTicket;
