import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const API_BASE_URL = "http://localhost:5000/api/auth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('fm_token');
      
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          localStorage.removeItem('fm_token');
          setUser(null);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('fm_token', data.token);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };
  const logout = () => {
    localStorage.removeItem('fm_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
// import { createContext, useContext, useState, useEffect } from 'react'

// const AuthContext = createContext(null)

// const API_URL = import.meta.env.VITE_API_URL

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     // Simulate checking stored JWT
//     const stored = localStorage.getItem('fm_user')
//     if (stored) setUser(JSON.parse(stored))
//     setLoading(false)
//   }, [])

//   const login = async (email, password) => {
//     // Replace with: const res = await fetch('/api/auth/login', { method:'POST', body: JSON.stringify({email,password}) })
//     // const data = await res.json(); localStorage.setItem('fm_token', data.token)
//     await new Promise(r => setTimeout(r, 800))
//     localStorage.setItem('fm_user', JSON.stringify(MOCK_USER))
//     setUser(MOCK_USER)
//     return { success: true }
//   }

//   const register = async (name, email, password) => {
//     await new Promise(r => setTimeout(r, 900))
//     const newUser = { ...MOCK_USER, name, email, initials: name.split(' ').map(n=>n[0]).join('').toUpperCase() }
//     localStorage.setItem('fm_user', JSON.stringify(newUser))
//     setUser(newUser)
//     return { success: true }
//   }

//   const logout = () => {
//     localStorage.removeItem('fm_user')
//     localStorage.removeItem('fm_token')
//     setUser(null)
//   }

//   return (
//     <AuthContext.Provider value={{ user, login, register, logout, loading }}>
//       {!loading && children}
//     </AuthContext.Provider>
//   )
// }

// export const useAuth = () => useContext(AuthContext)
