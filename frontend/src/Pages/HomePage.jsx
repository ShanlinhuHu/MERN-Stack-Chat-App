import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../components/Login";
import Signup from "../components/Signup";

const HomePage = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  const navigateTo = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (userInfo) navigateTo("/chats");
  }, [navigateTo]);

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="text-center border border-primary rounded-4  border-5 p-4">
        <div>
          <h1 className="text-center mb-4">Chat App</h1>
          <div className="text-center">
            <button
              className="btn btn-primary mr-2"
              onClick={() => setShowLoginModal(true)}
            >
              Log In
            </button>
            <button
              className="btn btn-primary"
              onClick={() => setShowSignupModal(true)}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Login Modal */}
        <Login
          show={showLoginModal}
          handleClose={() => setShowLoginModal(false)}
        />

        {/* Signup Modal */}
        <Signup
          show={showSignupModal}
          handleClose={() => setShowSignupModal(false)}
        />
      </div>
    </div>
  );
};

export default HomePage;
