import EditTicket from "../EditTicket/EditTicket.jsx";
import { LoginContext } from "../../Contexts/LoginContext.js";
import { useContext } from "react";
import { useHistory } from "react-router-dom";

const Ticket = ({ ticketObj, clickTicket }) => {
  //ticket info
  const ticketId = ticketObj.ticket_id;
  const creatorId = ticketObj.creator_id;
  const dateCreated = new Date(ticketObj.date_created).toLocaleString();
  const shortDescription = ticketObj.short_description;
  const longDescription = ticketObj.long_description;
  const status = ticketObj.status;

  //creator information / team information
  const teamId = ticketObj.team_id > 0 ? `Team ID: ${ticketObj.team_id}` : "";
  const teamName = ticketObj.name != null ? ticketObj.name : "No Team Assigned";
  const creatorName = ticketObj.username;

  const { state, setState } = useContext(LoginContext);
  const history = useHistory();

  //return a new row in the table containing all information for this ticket
  return (
    <tr id="trow" onClick={() => clickTicket(ticketObj)}>
      <td>{ticketId}</td>
      <td>
        <p className="fw-bold mb-1">{creatorName}</p>
        <p className="text-muted mb-0">User Id: {creatorId}</p>
      </td>
      <td>
        <p className="fw-bold mb-1">{teamName}</p>
        <p className="text-muted mb-0">{teamId}</p>
      </td>
      <td>{new Date(dateCreated).toLocaleString()}</td>
      <td className="description">{shortDescription}</td>
      <td>
        {status == "open" && (
          <span className="badge badge-success rounded-pill">Open</span>
        )}
        {status == "closed" && (
          <span className="badge badge-secondary rounded-pill">Closed</span>
        )}
      </td>
    </tr>
  );
};

export default Ticket;
