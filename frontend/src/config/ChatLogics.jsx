const getSender = (loggedUser, users) => {
  const sender = users[0]?._id === loggedUser?._id ? users[1] : users[0];

  return {
    name: sender.name,
    username: sender.username,
  };
};
export default getSender;
