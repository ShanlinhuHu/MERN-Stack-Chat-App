import axios from "axios";
import PropTypes from "prop-types";
import { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";

const UpdateGroupChat = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const [groupChatName, setGroupChatName] = useState("");
  const [searchGroup, setSearchGroup] = useState("");
  const [searchGroupResult, setSearchGroupResult] = useState([]);
  const [alertGroupMessage, setAlertGroupMessage] = useState("");

  const { user, selectedChat, setSelectedChat } = ChatState();

  //group user
  const searchGroupUserHandler = async () => {
    if (!searchGroup) {
      setAlertGroupMessage("Please enter the username");
      return;
    } else {
      setAlertGroupMessage("");
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `/api/user?search=${searchGroup}`,
        config
      );
      setSearchGroupResult(data);
      //console.log("searchG", searchGroupResult);
    } catch (error) {
      console.log(error.message);
      setAlertGroupMessage(
        "An error occurred while processing your group search result."
      );
    }
  };

  // group user
  const updateGroupName = async () => {
    if (!groupChatName) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.patch(
        `/api/chat/renamegroup`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
    } catch (error) {
      console.log(error.message);
      setAlertGroupMessage(
        "An error occurred while updating your group chat name."
      );
    }
    setGroupChatName("");
  };

  // group user
  const addGroupUserHandler = async (addUser) => {
    if (selectedChat.users.find((u) => u._id === addUser._id)) {
      setAlertGroupMessage("User already in the group");
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      setAlertGroupMessage("Only admins can add users");
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.patch(
        `/api/chat/addgroup`,
        {
          chatId: selectedChat._id,
          userId: addUser._id,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
    } catch (error) {
      console.log(error.message);
      setAlertGroupMessage(
        "An error occurred while updating your group chat name."
      );
    }
    setGroupChatName("");
  };

  // group user
  const delGroupUserHandler = async (delUser) => {
    if (selectedChat.groupAdmin._id !== user._id && delUser._id !== user._id) {
      setAlertGroupMessage("Only admins can delete users");
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.patch(
        `/api/chat/removegroup`,
        {
          chatId: selectedChat._id,
          userId: delUser._id,
        },
        config
      );

      delUser._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
    } catch (error) {
      console.log(error.message);
      setAlertGroupMessage("An error occurred while deleting users");
    }
    setGroupChatName("");
  };

  // hover the search user
  const handleMouseEnter = (event) => {
    event.target.style.backgroundColor = "var(--bs-primary)";
  };

  // hover the search user
  const handleMouseLeave = (event) => {
    event.target.style.backgroundColor = "";
  };
  return (
    <>
      <button
        className="btn btn-primary my-2"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#UpdateGrouphUsers"
        aria-controls="UpdateGrouphUsers"
      >
        Update
      </button>
      <div
        className="offcanvas offcanvas-start"
        tabIndex="-1"
        id="UpdateGrouphUsers"
        aria-labelledby="UpdateGrouphUsersLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="UpdateGrouphUsersLabel">
            Update Group Name and Users
          </h5>

          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <div className="row">
            <div className="col-md-9">
              <input
                className="form-control mb-1"
                type="text"
                placeholder={selectedChat.chatName}
                aria-label="chat name input"
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              ></input>
              <input
                className="form-control"
                type="text"
                placeholder="Enter Username"
                aria-label="username input"
                value={searchGroup}
                onChange={(e) => setSearchGroup(e.target.value)}
              ></input>
            </div>

            <div className="col-md-3 align-self-end">
              <button
                type="button"
                className="btn btn-primary mb-1"
                onClick={updateGroupName}
              >
                Update
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={searchGroupUserHandler}
              >
                Search
              </button>
            </div>

            {/* Alert */}
            {alertGroupMessage && (
              <div
                className="alert alert-danger alert-dismissible fade show"
                role="alert"
              >
                {alertGroupMessage}
                <button
                  type="button"
                  className="close"
                  data-dismiss="alert"
                  aria-label="Close"
                  onClick={() => setAlertGroupMessage("")}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
            )}
            {/* show selected users */}
            <div className="d-flex flex-row">
              <p>selected User: </p>
              {selectedChat.users.map((user) => (
                <h6 key={user._id} className="me-2">
                  <span className="badge bg-success" cursor="pointer">
                    {user.username}
                    <i
                      className="bi bi-x"
                      onClick={() => delGroupUserHandler(user)}
                    ></i>
                  </span>
                </h6>
              ))}
            </div>
            {/* search group user result  */}
            <ul className="list-group">
              {searchGroupResult?.map((user) => (
                <li
                  className="list-group-item list-group-item-action"
                  key={user._id}
                  onClick={() => addGroupUserHandler(user)}
                  cursor="pointer"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <p>Name:{user.name}</p>
                  <p>UserName:{user.username}</p>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => delGroupUserHandler(user)}
            >
              Leave Group
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

UpdateGroupChat.propTypes = {
  fetchAgain: PropTypes.bool.isRequired,
  setFetchAgain: PropTypes.func.isRequired,
  fetchMessages: PropTypes.func.isRequired,
};

export default UpdateGroupChat;
