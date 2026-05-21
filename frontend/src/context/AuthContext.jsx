import {
  createContext,
  useEffect,
  useState,
} from "react";

import { supabase } from "../services/supabase";

export const AuthContext =
  createContext();

export const AuthProvider = ({
  children,
}) => {

  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const getSession = async () => {

      const {
        data: { session },
      } =
        await supabase.auth.getSession();

      setUser(session?.user || null);

      setLoading(false);
    };

    getSession();

    const {
      data: listener,
    } =
      supabase.auth.onAuthStateChange(
        (_, session) => {

          setUser(
            session?.user || null
          );
        }
      );

    return () => {
      listener.subscription.unsubscribe();
    };

  }, []);

  // REGISTER

  const signup = async (
    email,
    password
  ) => {

    const response =
      await supabase.auth.signUp({
        email,
        password,
      });

    return response;
  };

  // LOGIN

  const login = async (
    email,
    password
  ) => {

    const response =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    return response;
  };

  // LOGOUT

  const logout = async () => {

    await supabase.auth.signOut();

    localStorage.removeItem(
      "user"
    );
  };

  return (

    <AuthContext.Provider
      value={{
        user,
        signup,
        login,
        logout,
        loading,
      }}
    >

      {children}

    </AuthContext.Provider>
  );
};