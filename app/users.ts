export type User = {
  id: string;
  password: string;
};

export const users: User[] = [
  {
    id: 'admin',
    password: '1234',
  },
];

export function validateUser(id: string, password: string) {
  return users.some((user) => user.id === id && user.password === password);
}

export function addUser(user: User) {
  const exists = users.some((item) => item.id === user.id);
  if (!exists) {
    users.push(user);
  }
}

export function deleteUser(id: string) {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    users.splice(index, 1);
  }
}
