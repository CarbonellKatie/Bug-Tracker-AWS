import { useState, useEffect, useContext } from "react";
import { useHistory, Link } from "react-router-dom";
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

  const [ticketInfo, setTicketInfo] = useState(
    state.ticketObj != null
      ? {
          shortDescription: state.ticketObj.short_description,
          fullDescription: state.ticketObj.full_description,
          status: state.ticketObj.status,
          message: "",
        }
      : {
          shortDescription: "ticket deleted",
          fullDescription: "deleted",
          status: "closed",
        }
  );

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

  const submitClick = async (e) => {
    e.preventDefault;
    //get the ticket object that was clicked on (stored in context when ticket is clicked)
    const ticket = state.ticketObj;

    console.log("in submit click");
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

  const deleteClick = async (e) => {
    e.preventDefault;
    console.log("got here");
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
      console.log("success");
      history.push("/inventory");

      // setMessage("Ticket successfully deleted.");
    } else {
      setMessage("Error: Ticket with given ID could not be found");
    }
    // history.push("/inventory");
  };

  //additional styling if wanted later
  //<h1 id="h1class">Edit Ticket Information</h1>
  // <span className="heading-primary-sub">
  //             Edit Ticket With Id: {ticket.ticket_id}
  //           </span>
  // if (state.ticketObj != null) {
  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="col-md-10 form-parent">
          <div className="row no-gutters">
            <div className="col-md-8">
              <h2>Edit Ticket</h2>
            </div>
            <div className="col-lg-3 create-div">
              {/* create ticket button, switch to Create Ticket Page on click */}
              <Link id="create-ticket-btn" to="/inventory">
                Back to Inventory
              </Link>
            </div>
          </div>

          <hr className="mb-2 mt-1"></hr>
          {/* <p id="addMessage">{ticketInfo.message}</p> */}
          {ticketInfo.message == "Ticket successfully updated." && (
            <div className="alert alert-success" role="alert">
              {ticketInfo.message}
            </div>
          )}

          <div className="row no-gutters">
            <div className="col-md-12">
              <form id="edit-form">
                {/* row 2 */}
                <div className="row no-gutters">
                  <div className="col-md-10 ml-5 mt-3">
                    <table className="table align-middle mb-0 my-3 bg-white table-striped table-bordered display-table">
                      <thead className="bg-light">
                        <tr>
                          <th>Ticket Number</th>
                          <th>Ticket Creator ID</th>
                          <th>Date Created</th>
                        </tr>
                      </thead>

                      <tbody id="table-body">
                        <tr>
                          <td>
                            {state.ticketObj != null
                              ? state.ticketObj.ticket_id
                              : ""}
                          </td>
                          <td>
                            {state.ticketObj != null
                              ? state.ticketObj.creator_id
                              : ""}
                          </td>
                          <td>
                            {new Date(
                              state.ticketObj != null
                                ? state.ticketObj.date_created
                                : ""
                            ).toLocaleString()}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="form-row px-5">
                  <div className="form-group col-md-6 pt-3">
                    <label htmlFor="short-description">Short Description</label>
                    <textarea
                      className="form-control"
                      id="short-description"
                      rows="5"
                      value={ticketInfo.shortDescription}
                      onChange={(e) => setShortDescription(e.target.value)}
                      // placeholder="summary"
                    ></textarea>
                  </div>
                  <div className="form-group col-md-6 pt-3">
                    <label htmlFor="full-description">Full Description</label>
                    <textarea
                      rows="5"
                      className="form-control"
                      id="full-description"
                      value={ticketInfo.fullDescription}
                      onChange={(e) => setFullDescription(e.target.value)}
                      // placeholder="long description"
                    />
                  </div>
                </div>
                {/* row 3 */}
                {state.ticketObj != null && (
                  <div className="form-row">
                    <div class="form-group px-5 col-md-4 pt-3">
                      <label htmlFor="inputState">Status</label>

                      {state.ticketObj.status.toLowerCase() == "open" && (
                        <select
                          id="edit-status"
                          onChange={(e) => setStatus(e.target.value)}
                        >
                          <option value="open" selected>
                            Open
                          </option>
                          <option value="closed">Closed</option>
                          <option value="In Progress">In Progress</option>
                        </select>
                      )}
                      {state.ticketObj.status.toLowerCase() == "closed" && (
                        <select
                          id="edit-status"
                          onChange={(e) => setStatus(e.target.value)}
                        >
                          <option value="Open">Open</option>
                          <option selected value="Closed">
                            Closed
                          </option>
                          <option value="In Progress">In Progress</option>
                        </select>
                      )}
                      {state.ticketObj.status.toLowerCase() ==
                        "in progress" && (
                        <select
                          id="edit-status"
                          onChange={(e) => setStatus(e.target.value)}
                        >
                          <option value="Open">Open</option>
                          <option value="Closed">Closed</option>
                          <option selected value="In Progress">
                            In Progress
                          </option>
                        </select>
                      )}
                      <br></br>
                      <br></br>
                    </div>
                  </div>
                )}
              </form>
              <br></br>
              <div className="form-row px-5 pb-5 color my-0">
                <button id="submit-edit-btn" onClick={(e) => submitClick(e)}>
                  Submit
                </button>
                <button id="delete-btn" onClick={(e) => deleteClick(e)}>
                  Delete Ticket
                </button>
              </div>
            </div>
          </div>
        </div>

        <br></br>
      </div>
    </div>
  );
  // } else {
  //   return <div></div>;
  // }
};

export default EditTicket;
