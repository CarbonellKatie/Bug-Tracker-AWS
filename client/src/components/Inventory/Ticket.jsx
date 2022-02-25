import EditTicket from "../EditTicket/EditTicket.jsx";
const Ticket = ({ ticketObj, showEditTicketPage }) => {
  //todo:clean this up
  const ticketId = ticketObj.ticket_id;
  const creatorId = ticketObj.creator_id;
  const dateCreated = new Date(ticketObj.date_created).toLocaleString();
  const shortDescription = ticketObj.short_description;
  const longDescription = ticketObj.long_description;
  const status = ticketObj.status;

  //open up ticket editor component and edit this ticket
  const editTicket = (e) => {
    e.preventDefault();
    showEditTicketPage(ticketObj);
  };

  //return a new row in the table containing all information for this ticket
  return (
    <tr onClick={editTicket} id="trow">
      <td>{ticketId}</td>
      <td>{creatorId}</td>
      <td>{new Date(dateCreated).toLocaleString()}</td>
      <td className="description">{shortDescription}</td>
      <td>{status}</td>
    </tr>
  );
};

export default Ticket;
