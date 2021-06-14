// create users list database
const users = [];

// add user
const addUser = ({ id, name, room }) => {
  // get the name and room
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  // check user
  const existingUser = users.find(
    (user) => (user.room === room) & (user.name === name)
  );

  // name and room check
  if (!name || !room) return { error: 'Username and room are required.' };
  if (existingUser) {
    return { error: 'Username is taken' };
  }

  // create user with id, name, room
  const user = { id, name, room };

  // add the user to the list
  users.push(user);
  return { user };
};

// remove user
const removeUser = (id) => {
  // find user
  const index = users.findIndex((user) => user.id === id);

  // removing the user
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

// get user
const getUser = (id) => users.find((user) => user.id === id);

// get user in certain room
const getUsersInRoom = (room) => users.filter((user) => user.room === room);

export { addUser, removeUser, getUser, getUsersInRoom };
