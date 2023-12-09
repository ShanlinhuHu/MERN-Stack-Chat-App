import { ChatState } from "../../Context/ChatProvider";

const SearchUserResult = (user, handleFunction) => {
  console.log(user.name);
  return (
    <ul className="list-group">
      <li className="list-group-item">{user.name}</li>
      <li className="list-group-item">{user.username}</li>
    </ul>
  );
};
export default SearchUserResult;
