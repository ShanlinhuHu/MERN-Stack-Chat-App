import axios from "axios";
import { useNavigate } from "react-router-dom";
import ChatNavBar from "./ChatNavBar";
import { ChatState } from "../../Context/ChatProvider";
import { useState, useEffect } from "react";
import getSender from "../../config/ChatLogics";
import PropTypes from "prop-types";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const [alertMessage, setAlertMessage] = useState("");
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
  {
    /* MyChat */
  }
  const fetchChats = async () => {
    // console.log(user._id);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      console.log(error.message);
      setAlertMessage("An error occurred while processing your fetch chats.");
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  const navigateTo = useNavigate();
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigateTo("/");
  };

  return (
    <>
      <div className="container bg-dark text-light" style={{ height: "100vh" }}>
        {/* Search Users */}
        <div className="row py-2 px-3" style={{ height: "5vh" }}>
          <ChatNavBar />
        </div>

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
        {/* MyChat */}
        {chats ? (
          <div className="row border" style={{ height: "85vh" }}>
            <div className="col">
              <ul className="list-group">
                {chats.map((chat) => (
                  <li
                    className="list-group-item"
                    style={{
                      backgroundColor:
                        selectedChat === chat
                          ? "var(--bs-primary)"
                          : "var(--bs-body-bg)",
                      color: selectedChat === chat ? "white" : "black",
                    }}
                    onClick={() => setSelectedChat(chat)}
                    cursor="pointer"
                    key={chat._id}
                  >
                    {!chat.isGroupChat ? (
                      <>
                        <div>{getSender(loggedUser, chat.users)?.name}</div>
                        <div>
                          @{getSender(loggedUser, chat.users)?.username}
                        </div>
                      </>
                    ) : (
                      chat.chatName
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}

        {/* Logout */}
        <div className="row border" style={{ height: "10vh" }}>
          <div className="col">
            {/* Button to send message */}
            <button
              type="button"
              className="btn btn-primary"
              onClick={logoutHandler}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

MyChats.propTypes = {
  fetchAgain: PropTypes.bool.isRequired,
};

export default MyChats;
