
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { database } from '@/lib/database';

export type UserRole = 'patient' | 'caretaker';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  signup: (userData: SignupData) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

export interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      const foundUser = database.getUserByEmailAndRole(email, role);
      
      if (foundUser && foundUser.password === password) {
        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword as User);
        setIsLoading(false);
        return true;
      } else {
        setError('Invalid credentials or role');
        setIsLoading(false);
        return false;
      }
    } catch (err) {
      setError('Database error');
      setIsLoading(false);
      return false;
    }
  };

  const signup = async (userData: SignupData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      // Check if user already exists
      const existingUser = database.getUserByEmailAndRole(userData.email, userData.role);
      if (existingUser) {
        setError('User already exists');
        setIsLoading(false);
        return false;
      }

      const newUser = database.createUser(userData);
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword as User);
      setIsLoading(false);
      return true;
    } catch (err) {
      setError('Database error');
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      logout,
      isLoading,
      error
    }}>
      {children}
    </AuthContext.Provider>
  );
};
