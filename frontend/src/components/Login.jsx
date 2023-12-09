import axios from "axios";
import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ show, handleClose }) => {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [alertMessage, setAlertMessage] = useState("");
  const navigateTo = useNavigate();

  // Login
  const submitHandler = async () => {
    if (!username || !password) {
      setAlertMessage("Please fill out all required fields.");
      return;
    } else {
      setAlertMessage("");
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user/login",
        {
          username,
          password,
        },
        config
      );
      setAlertMessage("Login Successful");
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigateTo("/chats");
    } catch (error) {
      console.log("in error");
      console.log(error.message);
      setAlertMessage("An error occurred while processing your request.");
    }
  };

  return (
    <div
      className={`modal${show ? " d-block" : ""}`}
      tabIndex="-1"
      role="dialog"
    >
      {/* Alert */}
      {alertMessage && (
        <div
          className="alert alert-danger alert-dismissible fade show"
          role="alert"
        >
          {alertMessage}
          <button
            type="button"
            className="close"
            data-dismiss="alert"
            aria-label="Close"
            onClick={() => setAlertMessage("")}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      )}
      {/* Login Form */}
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Login</h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
              onClick={handleClose}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <form>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  Username *
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  name="username"
                  placeholder="Enter your username"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password *
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-primary"
              onClick={submitHandler}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

Login.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};
export default Login;
