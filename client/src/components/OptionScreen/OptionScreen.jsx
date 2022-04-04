//OptionScreen component will display the user menu upon successful login. Users will be
//given the option to view personal tickets or tickets for one of their teams

import { useEffect, useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { LoginContext } from "../../Contexts/LoginContext";
import home from "../../images/home-art.png";
import meeting from "../../images/meeting.png";
import Navbar from "../Navbar/Navbar.jsx";
import "./OptionScreen.css";

//if we are in production mode, do not prepend localhost:3001, nginx will do that for us
const API_URL =
  process.env.NODE_ENV == "development" ? "http://localhost:3001" : "";

const OptionScreen = () => {
  const history = useHistory();
  //keep track of the team names that will be put in the drop down menu and the name of the team selected
  const [teams, setTeams] = useState({
    teamObjects: [],
    teamSelected: 0,
    teamSelectedName: "",
  });
  const { state, setState } = useContext(LoginContext);

  //go to inventory page and display tickets for only this user (only tickets with their user id)
  //resetting teamSelected to 0 since we do not want to view tickets for any team. teamSelected being
  //0 in the App state will indicate to the Inventory component that we want to view individual tickets only

  const showPersonalTickets = () => {
    //pass history.push as a callback function of setState that will be executed after the state is successfully updated
    setState({ ...state, teamSelectedId: 0, teamSelectedName: "" }),
      history.push("/inventory");
  };

  const manageTeams = () => {
    history.push("/manageTeams");
  };

  return (
    <div>
      <Navbar />
      {/* <div className="back-box">
        <Link id="back" to="/">
          Back to Login
        </Link>
      </div> */}
      <div className="container">
        {/* view individual ticket button, take user to individual tickets page and show tickets
            that are associated with their userID in the database. Calling the showIndividualPage fuction will
            set the value of teamSelected to 0 in app.js state and show all tickets associated with this user's userId */}
        <div className="row ">
          <div className="col-lg-5">
            {/* sub-row 1 for personal tickets button */}
            <div className="row ">
              <div className="col-lg-12">
                <h1 id="head1">Ticket Manager</h1>
              </div>
            </div>

            <div className="row ">
              <div className="col-lg-12">
                <h4 id="head2">Access team or individual tickets</h4>
              </div>
            </div>

            <div className="row no-gutters">
              <div className="col-lg-12">
                {/* <h4 id="individual-label">Individual Tickets</h4> */}
                <button
                  id="individual"
                  className="option-button"
                  onClick={showPersonalTickets}
                >
                  View Personal Tickets
                </button>

                <br></br>
              </div>
            </div>

            <div className="row no-gutters">
              <div className="col-lg-12">
                {/* button to view the selected team's tickets */}
                <button id="manage-teams" onClick={manageTeams}>
                  Manage Teams
                </button>
                <br></br>
                <br></br>
                <br></br>
              </div>
            </div>
          </div>

          <div className="col-lg-7">
            <img id="home-img" src={meeting} alt="person sitting at desk"></img>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptionScreen;
