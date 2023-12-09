import { useState } from "react";
import axios from "axios";
import { ChatState } from "../../Context/ChatProvider";

const ChatNavBar = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [alertMessage, setAlertMessage] = useState("");

  // group users
  const [searchGroup, setSearchGroup] = useState("");
  const [searchGroupResult, setSearchGroupResult] = useState([]);
  const [alertGroupMessage, setAlertGroupMessage] = useState("");
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  const { user, setSelectedChat, chats, setChats } = ChatState();

  // user
  const searchUserHandler = async () => {
    if (!search) {
      setAlertMessage("Please enter the username");
      return;
    } else {
      setAlertMessage("");
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setSearchResult(data);
    } catch (error) {
      console.log(error.message);
      setAlertMessage("An error occurred while processing your search result.");
    }
  };
  //user
  const createChat = async (userId) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post("/api/chat", { userId }, config);
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
    } catch (error) {
      console.log(error.message);

      setAlertMessage(
        "An error occurred while processing your create chat result."
      );
    }
  };
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
  const addGroupUserHandler = (addUser) => {
    if (selectedUsers.includes(addUser)) {
      setAlertGroupMessage("User already added");
      return;
    }

    setSelectedUsers([...selectedUsers, addUser]);
  };

  // group user
  const delGroupUserHandler = (delUser) => {
    setSelectedUsers(
      selectedUsers.filter((selUser) => selUser._id !== delUser._id)
    );
  };

  // group user
  const createGroupChat = async () => {
    if (!groupChatName) {
      setAlertGroupMessage("Please enter a chat name");
      return;
    }
    if (selectedUsers.length < 2) {
      setAlertGroupMessage("Please select 2+ users to form a group chat");
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        `/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
    } catch (error) {
      console.log(error.message);

      setAlertGroupMessage(
        "An error occurred while processing your group chat"
      );
    }
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
      {/* search user/group offcanvas  */}
      <div className="container text-center">
        <div className="row">
          <div className="col-9">
            {/*search user*/}
            <button
              className="btn btn-primary"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#SearchUsers"
              aria-controls="SearchUsers"
            >
              <i className="bi bi-search" /> Search Users
            </button>
          </div>
          <div className="col-3">
            {/*search group users*/}

            <button
              className="btn btn-primary"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#SearchGrouphUsers"
              aria-controls="SearchGrouphUsers"
            >
              <i className="bi bi-plus"></i>
            </button>
          </div>
        </div>
      </div>
      {/* offcanvas for user and group users  */}
      {/* offcanvas for user  */}
      <div
        className="offcanvas offcanvas-start"
        tabIndex="-1"
        id="SearchUsers"
        aria-labelledby="SearchUsersLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="SearchUsersLabel">
            Search Users
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
                className="form-control"
                type="text"
                placeholder="Enter Username"
                aria-label="username input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              ></input>
            </div>
            <div className="col-md-1">
              <button
                type="button"
                className="btn btn-primary"
                onClick={searchUserHandler}
              >
                Search
              </button>
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

            {/* search user result  */}
            <ul className="list-group">
              {searchResult?.map((user) => (
                <li
                  className="list-group-item list-group-item-action"
                  key={user._id}
                  onClick={() => createChat(user._id)}
                  cursor="pointer"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <p>Name:{user.name}</p>
                  <p>UserName:{user.username}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* offcanvas for group users */}
      <div
        className="offcanvas offcanvas-start"
        tabIndex="-1"
        id="SearchGrouphUsers"
        aria-labelledby="SearchGrouphUsersLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="SearchGrouphUsersLabel">
            Search Group Users
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
                placeholder="Enter chat name"
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
              {selectedUsers.map((user) => (
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
            {/* submit chat Name and selected users  */}
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => createGroupChat()}
            >
              Create Group Chat
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default ChatNavBar;
