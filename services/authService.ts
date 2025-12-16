import { User } from '../types';

const STORAGE_KEY = 'ascend_user_session';
const USERS_DB_KEY = 'ascend_users_db'; // Simulates a database in local storage

export const login = async (email: string, password: string): Promise<User> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const users = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '[]');
  const user = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

  if (user) {
    const sessionUser: User = { id: user.id, name: user.name, email: user.email };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionUser));
    return sessionUser;
  }
  throw new Error('Invalid email or password');
};

export const signup = async (name: string, email: string, password: string): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  const users = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '[]');
  if (users.find((u: any) => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('User with this email already exists');
  }

  const newUser = { id: Math.random().toString(36).substr(2, 9), name, email, password };
  users.push(newUser);
  localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));

  const sessionUser: User = { id: newUser.id, name: newUser.name, email: newUser.email };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionUser));
  return sessionUser;
};

export const logout = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export const getCurrentUser = (): User | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (e) {
    return null;
  }
};
