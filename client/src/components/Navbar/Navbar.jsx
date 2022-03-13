import Logo from "../../images/logo1.png";
import { Link, useHistory } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <div>
      <nav
        id="mynav"
        className="nav navbar-expand-lg navbar-light bg-light mb-4 py-3"
      >
        {/* <div className="container-fluid"> */}
        <img
          className="logo"
          src="https://img.icons8.com/color/48/000000/insect.png"
        />
        <span id="logo-text">Bug Tracker</span>

        <Link className="nav-item" to="/options">
          Home
        </Link>
        <Link className="nav-item" to="/">
          Logout
        </Link>
        {/* </div> */}
      </nav>
    </div>
  );
};

export default Navbar;
