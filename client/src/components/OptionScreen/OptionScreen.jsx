//OptionScreen component will display the user menu upon successful login. Users will be
//given the option to view personal tickets or tickets for one of their teams

import { useEffect, useState } from "react";
import "./OptionScreen.css";
const OptionScreen = ({
  username,
  userId,
  showInventoryPage,
  showLoginPage,
  setTeamSelected,
  showTeamInventoryPage,
}) => {
  const [state, setState] = useState({
    buttonMenuVis: true,
    individualVis: false,
    teamVis: false,
    teamNames: [],
    teamSelected: 0,
    teamSelectedName: "non",
  });

  //on page load, fetch all teams from the user and display team names as options in a
  //drop down menu. Users can select from teams they are part of and view tickets created by members
  //of that team, or they can choose to view all tickets they have personally created, regardless
  //of what team the user created the ticket for
  useEffect(() => {
    const getTeams = async () => {
      const teams = await fetchTeams(userId);
      //if the array of teams for this user is not empty, set the default team selected
      //to the first team in the list
      console.log(teams.teams);
      setState({
        ...state,
        teamNames: teams.teams,
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
    const results = await fetch(
      `http://localhost:8080/inventory/teams/${userId}`,
      params
    );
    const teams = await results.json();
    return teams;
  };

  //set team selected in Inventory component state and App state
  //change team selected when user selects a different team in the drop down menu
  const setTeam = (e) => {
    const teamSelected = e.nativeEvent.target.value;
    const obj = {
      ...state,
      teamSelected: teamSelected,
      teamSelectedName: e.target.value,
    };
    console.log(obj);
    setState(obj);
  };

  //called when "view team tickets" button is pressed after user selects team from slider
  //view all tickets associated with the team selected, from any user that created a ticket
  //as part of that team
  const showTeamTickets = () => {
    showTeamInventoryPage(state.teamSelected, state.teamSelectedName);
  };

  return (
    <div className="body">
      <header className="header">
        <div className="back-box">
          {/* back button to return to login screen */}
          <button id="back" onClick={showLoginPage}>
            Back to Login
          </button>
        </div>

        <div className="text-box">
          <h1 className="heading-primary">
            <span className="heading-primary-main">
              Ticket Management System
            </span>
            <span className="heading-primary-sub">Options for {username}</span>
          </h1>
        </div>
      </header>
      {state.buttonMenuVis && (
        <div className="container">
          <div className="buttons-class">
            {/* view individual ticket button, take user to individual tickets page and show tickets
            that are associated with their userID in the database */}
            <button
              id="individual"
              className="option-button"
              onClick={showInventoryPage}
            >
              View Personal Tickets
            </button>
            <br></br>
            <p>Select Team</p>
            <div id="team-div">
              <select
                id="select-team"
                className="option-button"
                onChange={(e) => setTeam(e)}
              >
                {/* display all teams the user is in as options in the teams drop down menu */}
                {state.teamNames.map((team, index) => (
                  <option
                    value={team.team_id}
                    key={index}
                    className="option-button"
                  >
                    {team.name}
                  </option>
                ))}
              </select>
              {/* button to view the selected team's tickets */}
              <button id="view-team" onClick={showTeamTickets}>
                View Team Tickets
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptionScreen;
