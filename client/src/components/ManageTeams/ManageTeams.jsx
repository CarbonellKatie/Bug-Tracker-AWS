import Navbar from "../Navbar/Navbar.jsx";
import "./ManageTeams.css";
import { useState, useContext, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import TeamMember from "./TeamMember";

import { LoginContext } from "../../Contexts/LoginContext";

const ManageTeams = () => {
  //keep track of the team names that will be put in the drop down menu and the name of the team selected
  const [teams, setTeams] = useState({
    teamObjects: [], //array of team objects
    teamSelected: 0,
    teamSelectedName: "",
    showMemberTable: false,
    teamMembers: [], //array of team member objects {user_id, username}
  });

  const { state, setState } = useContext(LoginContext);

  const history = useHistory();

  //on page load, fetch all teams from the user and display team names as options in a
  //drop down menu. Users can select from teams they are part of and view tickets created by members
  //of that team, or they can choose to view all tickets they have personally created, regardless
  //of what team the user created the ticket for
  useEffect(() => {
    const getTeams = async () => {
      const teams = await fetchTeams(state.userId);
      //if the array of teams for this user is not empty, set the default team selected
      //to the first team in the list

      setTeams({
        ...teams,
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
    const results = await fetch(
      `${state.API}/inventory/teams/${userId}`,
      params
    );
    const teams = await results.json();

    return teams;
  };

  //fetch all member objects from the currently selected team (teamId stored in state)
  const fetchMembers = async (teamId) => {
    const params = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const results = await fetch(
      `${state.API}/inventory/teams/members/${teamId}`,
      params
    );
    const memberObjects = await results.json();
    console.log(memberObjects.members);
    // return memberObjects.members;
    setTeams({
      ...teams,
      teamMembers: memberObjects.members,
      showMemberTable: true,
    });
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

  const leaveTeam = () => {
    console.log(`leaving team: ${teams.teamSelected}`);
  };

  ////display member table for this team and allow user to edit member list
  const editTeam = () => {
    // const members = fetchMembers(teams.teamSelected);
    fetchMembers(teams.teamSelected);
    // setTeams({ ...teams, showMemberTable: true, teamMembers: members });
    console.log(teams.teamMembers);
  };

  return (
    <div>
      <Navbar></Navbar>
      {/* <h1 className="mx-auto">
        IN PROGRESS... this page will display the user's teams, allow them to
        leave or join teams, and create a new team{" "}
      </h1> */}
      <div className="container">
        <div className="row ">
          <div className="col-lg-5">
            {/* sub-row 1 for personal tickets button */}
            <div className="row ">
              <div className="col-lg-12">
                <h1 id="head1">Team Options</h1>
              </div>
            </div>

            <div className="row ">
              <div className="col-lg-12">
                <h4 id="head2">
                  Access team tickets or manage team membership
                </h4>
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
                {/* button to leave the team currently selected in the drop down menu */}
                <button id="edit-team" onClick={editTeam}>
                  Edit Team Member List
                </button>
              </div>
            </div>

            <div className="row no-gutters">
              <div className="col-lg-12">
                {/* button to leave the team currently selected in the drop down menu */}
                <button id="leave-team" onClick={leaveTeam}>
                  Leave Selected Team
                </button>
              </div>
            </div>
          </div>

          {/* <div className="row-lg-1">
            <div className="row">
              <div className="col-lg-12">
                <br></br>
                <hr></hr>
                <h1></h1>
              </div>
            </div>
          </div> */}

          <div id="pad" className="row-lg-6 ml-40">
            <div className="row">
              <div className="col-lg-12">
                <h1 id="head1">Team Members</h1>
                <h4 id="head2">Add or Remove Team Members</h4>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12">
                {teams.showMemberTable && (
                  <table id="team-members-table" className="table">
                    <thead class="thead-light">
                      <tr>
                        <th scope="col">User Id</th>
                        <th scope="col">Name</th>
                        {/* <th scope="col">Remove from Team</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {teams.teamMembers?.map((member, index) => (
                        <TeamMember key={index} member={member} />
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageTeams;
