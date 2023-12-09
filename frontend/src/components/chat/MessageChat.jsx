import PropTypes from "prop-types";
import ScrollableFeed from "react-scrollable-feed";
import { ChatState } from "../../Context/ChatProvider";
import getSender from "../../config/ChatLogics";

const MessageChat = ({ messages, selectedChat }) => {
  const { user } = ChatState();

  return (
    <div style={{ overflowY: "scroll", height: "85vh" }}>
      <ScrollableFeed>
        {messages &&
          messages.map((m, i) => (
            <div key={i} className="d-flex align-items-center mb-2">
              {m.sender._id === user._id ? (
                <>
                  {/* user */}
                  <p className={"badge ms-auto bg-info"}>{m.content}</p>
                  <div className="rounded-circle bg-primary text-light p-2">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </>
              ) : (
                <>
                  {/* sender */}
                  <div className="rounded-circle bg-primary text-light p-2">
                    {getSender(user, selectedChat.users)
                      .name.charAt(0)
                      .toUpperCase()}
                  </div>
                  <p className="badge bg-secondary">{m.content}</p>
                </>
              )}
            </div>
          ))}
      </ScrollableFeed>
    </div>
  );
};

MessageChat.propTypes = {
  messages: PropTypes.array,
  selectedChat: PropTypes.object,
};
export default MessageChat;
