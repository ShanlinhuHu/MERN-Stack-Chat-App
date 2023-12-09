import { ChatState } from "../../Context/ChatProvider";
import PropTypes from "prop-types";
import getSender from "../../config/ChatLogics";
import UpdateGroupChat from "./UpdateGroupChat";
import { useState, useEffect } from "react";
import axios from "axios";
import MessageChat from "../chat/MessageChat";

// socket.io
import io from "socket.io-client";
const ENDPOINT = "http://localhost:5000";
let socket, selectedChatCompare;

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat } = ChatState();
  const [alertMessage, setAlertMessage] = useState("");
  const [messages, setMessages] = useState();
  const [newMessage, setNewMessage] = useState();
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      //console.log(messages);
      setMessages(data);

      socket.emit("join_chat", selectedChat._id);
    } catch (error) {
      console.log(error.message);
      setAlertMessage("An error occurred while fetching your messages");
    }
  };

  const sendMessage = async () => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      setNewMessage("");
      const { data } = await axios.post(
        "/api/message",
        {
          content: newMessage,
          chatId: selectedChat._id,
        },
        config
      );
      socket.emit("new message", data);
      setMessages([...messages, data]);
    } catch (error) {
      console.log(error.message);
      setAlertMessage("An error occurred while processing your sent message");
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    let timerLength = 3000;
    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      sendMessage();
    }
  };

  const handleButtonClick = () => {
    if (newMessage) {
      socket.emit("stop typing", selectedChat._id);
      sendMessage();
    }
  };

  // socket.io
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  });
  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);
  useEffect(() => {
    socket.on("new Message", (newMessage) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessage.chat._id
      ) {
        // notification
      } else {
        setMessages([...messages, newMessage]);
      }
    });
  });

  return (
    <>
      {selectedChat ? (
        <div className="container">
          {/* Show the selected chat user's Name */}
          {selectedChat.isGroupChat ? (
            <>
              <div className="row border " style={{ height: "5vh" }}>
                <div className="col d-flex justify-content-between ">
                  <h1 className="my-1">{selectedChat.chatName}</h1>
                  <UpdateGroupChat
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                    fetchMessages={fetchMessages}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="row border" style={{ height: "5vh" }}>
                <div className="col">
                  <h1>{getSender(user, selectedChat.users).name}</h1>
                </div>
              </div>
            </>
          )}

          {/* Chat histroy */}
          <div className="row border" style={{ height: "85vh" }}>
            <div className="col">
              <MessageChat messages={messages} selectedChat={selectedChat} />
            </div>
          </div>

          {/* Textarea for typing messages */}
          <div
            className="row border"
            style={{ height: "10vh", position: "relative" }}
          >
            {isTyping ? <div>Typing...</div> : <div></div>}
            <div className="col-11">
              <textarea
                className="form-control flex-grow-1"
                rows="3"
                style={{ height: "100%" }}
                onKeyDown={handleKeyPress}
                onChange={typingHandler}
                value={newMessage}
              />
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
            </div>
            <div
              className="col-1"
              style={{
                position: "absolute",
                bottom: "0",
                right: "0",
                padding: "8px",
              }}
            >
              {/* Button to send message */}
              <button className="btn btn-primary" onClick={handleButtonClick}>
                Send
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ height: "100vh", flexDirection: "column" }}
        >
          <h1>
            No chat selected <i className="bi bi-chat"></i>
          </h1>
          <h1>Clicked the user to start chatting</h1>
        </div>
      )}
    </>
  );
};

ChatBox.propTypes = {
  fetchAgain: PropTypes.bool.isRequired,
  setFetchAgain: PropTypes.func.isRequired,
};

export default ChatBox;
