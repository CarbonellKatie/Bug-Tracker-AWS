import { useState } from "react";
import "./login.css";
// import API from "../../apis/API";

const Login = ({ loginSuccess }) => {
  //states updated as soon as text is changed in input fields

  //if the value of the error message is changed (if we go from error being "" to "incorrect username",
  //we need to rerender to update the view to show the error text)
  //need to keep username and password stored in state so we can keep the current values when
  //the error message (part of state) changes & the component rerenders
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
    errorMsg: "",
  });

  //removed...
  //username and password are constants instead of part of the state: we dont need to rerender the
  //login page every time the username and password are changed

  //pass in entire data object that was returned with user info from successful login
  function successLogin(data) {
    //update state to include this user's data, hide login screen, create and show inventory screen for this user
    //update state in app (userId, username, showLogin, showOptionScreen)
    loginSuccess(data.user_id, data.username, false, true);
  }

  function setErrorMessage(error) {
    setLoginData({ ...loginData, error: error });
  }

  //when submit button is clicked on login page
  const onSubmit = (e) => {
    e.preventDefault();

    // VALIDATE INPUT and update app state with user id
    fetch("http://localhost:3001/login/getUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        //convert JS object into a json string
        username: loginData.username,
        password: loginData.password,
      }),
    })
      .then((response) => response.json()) //convert results into javascript object {id:4, permissions:admin}
      .then((data) => {
        if (!data.hasOwnProperty("error")) {
          //if there is no error object in the response

          successLogin(data.data[0]);
        } else {
          setErrorMessage("Username or Password is Incorrect");
          console.log("ERRO");
        }
      });
  };

  return (
    <div id="cover" className="min-vh-100">
      <div id="cover-caption">
        <div className="container">
          <div className="row text-white">
            <div className="col-xl-5 col-lg-6 col-md-8 col-sm-10 mx-auto text-center form p-4">
              <h1 className="display-4 py-2 text-truncate">Login</h1>
              <div className="px-2">
                <form
                  action=""
                  className="justify-content-center"
                  onSubmit={onSubmit}
                >
                  <div className="form-group">
                    <input
                      type="text"
                      id="username-input"
                      className="form-control"
                      placeholder="Enter Username"
                      onChange={(e) =>
                        setLoginData({
                          ...loginData,
                          username: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      id="password-input"
                      className="form-control"
                      placeholder="Enter Password"
                      onChange={(e) =>
                        setLoginData({ ...loginData, password: e.target.value })
                      }
                    />
                  </div>
                  <p id="error-username">{loginData.error}</p>
                  {/* <p id="error-password"></p> */}

                  <button type="submit" id="submit-btn" className="btn-lg">
                    Login
                  </button>
                  {/* <LoginBtn /> */}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <script
        src="https://code.jquery.com/jquery-3.2.1.slim.min.js"
        integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN"
        crossorigin="anonymous"
      ></script>
      <script
        src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js"
        integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q"
        crossorigin="anonymous"
      ></script>
      <script
        src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"
        integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl"
        crossorigin="anonymous"
      ></script>
      <script src="./script.js"></script>
    </div>
  );
};

export default Login;
