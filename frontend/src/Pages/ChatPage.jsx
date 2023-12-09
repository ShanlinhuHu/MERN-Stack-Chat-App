//import axios from "axios";
//import { useEffect } from "react";
import { ChatState } from "../Context/ChatProvider";
import MyChats from "../components/chat/MyChats";
import ChatBox from "../components/chat/ChatBox";
import { useState } from "react";

const ChatPage = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3">
            {user ? <MyChats fetchAgain={fetchAgain} /> : <p>please login</p>}
          </div>
          <div className="col-md-9">
            {user ? (
              <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
            ) : (
              <p>please login</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatPage;
