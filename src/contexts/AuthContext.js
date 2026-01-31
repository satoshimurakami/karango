import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]); // [{email, password}]

  useEffect(() => {
    checkToken();
    loadUsers();
  }, []);

  const USERS_KEY = 'users';

  const loadUsers = async () => {
    const usersJson = await AsyncStorage.getItem(USERS_KEY);
    if (usersJson) {
      setUsers(JSON.parse(usersJson));
    }
  };

  const saveUsers = async (newUsers) => {
    setUsers(newUsers);
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(newUsers));
  };

  const checkToken = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        await AsyncStorage.removeItem('token');
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    // Verifica se usuário existe
    const found = users.find(u => u.email === email && u.password === password);
    if (found) {
      // Gera um token fake com o email
      const mockToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
        btoa(JSON.stringify({ email, name: email.split('@')[0] })) +
        '.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      await AsyncStorage.setItem('token', mockToken);
      const decoded = jwtDecode(mockToken);
      setUser(decoded);
    } else {
      throw new Error('Invalid credentials');
    }
  };

  // Se update=true, atualiza senha. Se remove=true, remove usuário.
  const register = async (email, password, update = false, remove = false) => {
    if (remove) {
      const newUsers = users.filter(u => u.email !== email);
      await saveUsers(newUsers);
      return;
    }
    if (!email || (!password && !update)) throw new Error('Email and password required');
    if (update) {
      const newUsers = users.map(u => u.email === email ? { ...u, password } : u);
      await saveUsers(newUsers);
      return;
    }
    if (users.find(u => u.email === email)) throw new Error('Email already registered');
    const newUsers = [...users, { email, password }];
    await saveUsers(newUsers);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, register, users }}>
      {children}
    </AuthContext.Provider>
  );
};