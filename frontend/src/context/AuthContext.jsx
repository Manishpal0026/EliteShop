import React, {
  createContext,
  useState,
  useEffect
} from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  // ==========================================
  // LOAD USER WHEN APP STARTS
  // ==========================================

  useEffect(() => {

    try {

      const savedUser =
        localStorage.getItem("userInfo");

      if (savedUser) {

        const parsedUser =
          JSON.parse(savedUser);

        setUser(parsedUser);

      }

    } catch (error) {

      console.error(
        "Error loading user information:",
        error
      );

      localStorage.removeItem("userInfo");
      localStorage.removeItem("adminInfo");

    } finally {

      setLoading(false);

    }

  }, []);


  // ==========================================
  // LOGIN
  // ==========================================

  const login = (userData) => {

    if (!userData) {
      console.error("Login failed: No user data received");
      return false;
    }

    console.log(
      "AuthContext login data:",
      userData
    );


    // Save user in React state
    setUser(userData);


    // Save user information
    localStorage.setItem(
      "userInfo",
      JSON.stringify(userData)
    );


    // ==========================================
    // IF ADMIN, ALSO SAVE adminInfo
    // ==========================================

    const role =
      userData?.role ||
      userData?.user?.role;

    if (role === "admin") {

      localStorage.setItem(
        "adminInfo",
        JSON.stringify(userData)
      );

      console.log(
        "Admin information saved successfully"
      );

    }


    return true;
  };


  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = () => {

    console.log("Logging out...");

    setUser(null);

    localStorage.removeItem("userInfo");
    localStorage.removeItem("adminInfo");

  };


  // ==========================================
  // CONTEXT
  // ==========================================

  return (

    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading
      }}
    >

      {children}

    </AuthContext.Provider>

  );

};


export default AuthContext;

