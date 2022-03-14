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
  process.env.NODE_ENV == "production" ? "" : "http://localhost:3001";

const OptionScreen = () => {
  const history = useHistory();
  //keep track of the team names that will be put in the drop down menu and the name of the team selected
  const [teams, setTeams] = useState({
    teamObjects: [],
    teamSelected: 0,
    teamSelectedName: "",
  });
  const { state, setState } = useContext(LoginContext);

  //on page load, fetch all teams from the user and display team names as options in a
  //drop down menu. Users can select from teams they are part of and view tickets created by members
  //of that team, or they can choose to view all tickets they have personally created, regardless
  //of what team the user created the ticket for
  useEffect(() => {
    const getTeams = async () => {
      console.log("rendering Option screen");
      const teams = await fetchTeams(state.userId);
      //if the array of teams for this user is not empty, set the default team selected
      //to the first team in the list
      // console.log(teams.teams);
      setTeams({
        teamObjects: teams.teams,
        teamSelected: teams.teams.length > 0 ? teams.teams[0].team_id : 0,
        teamSelectedName: teams.teams.length > 0 ? teams.teams[0].name : "none",
      });
    };
    getTeams();
  }, []);

  //make http request to fetch all of the user's teams
  const fetchTeams = async (userId) => {
    const params = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const results = await fetch(`${API_URL}/inventory/teams/${userId}`, params);
    const teams = await results.json();
    return teams;
  };

  //set team selected in App state using Contexts
  //change team selected when user selects a different team in the drop down menu
  const setTeam = (e) => {
    const newTeamId = e.nativeEvent.target.value;
    var newTeamName = e.target.options[e.target.selectedIndex].text;
    // console.log(text);
    console.log(newTeamId);
    // console.log(newTeamName);
    const obj = {
      ...teams,
      teamSelectedName: newTeamName,
      teamSelected: newTeamId,
    };
    // console.log(obj);
    setTeams(obj);
  };

  //called when "view team tickets" button is pressed after user selects team from drop down menu
  //view all tickets associated with the team selected, from any user that created a ticket
  //as part of that team
  //sync App state with OptionScreen local component state using setState function given in Context
  const showTeamTickets = () => {
    setState({
      ...state,
      teamSelectedId: teams.teamSelected,
      teamSelectedName: teams.teamSelectedName,
    }),
      history.push("/inventory");
  };

  //go to inventory page and display tickets for only this user (only tickets with their user id)
  //resetting teamSelected to 0 since we do not want to view tickets for any team. teamSelected being
  //0 in the App state will indicate to the Inventory component that we want to view individual tickets only

  const showPersonalTickets = () => {
    //pass history.push as a callback function of setState that will be executed after the state is successfully updated
    setState({ ...state, teamSelectedId: 0, teamSelectedName: "" }),
      history.push("/inventory");
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
        {/* <header className="header"> */}

        {/* </header> */}

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
                <label id="team-label" for="select-team">
                  Select Team
                </label>
              </div>
            </div>

            <div className="row no-gutters">
              <div className="col-lg-12">
                <select
                  id="select-team"
                  className="option-button"
                  onChange={(e) => setTeam(e)}
                >
                  {/* display all teams the user is in as options in the teams drop down menu */}
                  {teams.teamObjects.map((team, index) => (
                    <option
                      value={team.team_id}
                      key={index}
                      className="option-button"
                    >
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="row no-gutters">
              <div className="col-lg-12">
                {/* button to view the selected team's tickets */}
                <button id="view-team" onClick={showTeamTickets}>
                  View Team Tickets
                </button>
              </div>
            </div>

            <div className="row no-gutters">
              <div className="col-lg-12">
                <button
                  id="individual"
                  className="option-button"
                  onClick={showPersonalTickets}
                >
                  View Personal Tickets
                </button>
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
