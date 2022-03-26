import { createContext, useState, useEffect } from 'react'
import jwt_decode from 'jwt-decode'
import {useNavigate} from 'react-router-dom'

const AuthContext = createContext()

export default AuthContext

export const AuthProvider =  ({children}) => {

  // to ze tam je ta funkce (() =>) znamena ze se to pouzije pouze na prvnim nacteni a nebude to furt volat
  let [user, setUser] = useState( // pokud jsou tokeny v localstorage tak je priradim else nic
    () => localStorage.getItem('authTokens')
    ? jwt_decode(localStorage.getItem('authTokens'))
    : null
  )
  let [authTokens, setAuthTokens] = useState(
    () => localStorage.getItem('authTokens')
    ? JSON.parse(localStorage.getItem('authTokens'))
    : null
  )
  let [loading, setLoading] = useState(true);
  let [registerValidation, setRegisterValidation] = useState(null);
  let [loginValidation, setLoginValidation] = useState(null);
  const navigate = useNavigate();


  let loginUser = async (e, password) => {
    e.preventDefault()
    if (!password) {
      password = e.target.password.value;
    }
    let response = await fetch('/api/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({'username': e.target.username.value, 'password': password})
    })
    let data = await response.json()

    if (response.status === 200) {
      setAuthTokens(data)
      setUser(jwt_decode(data.access))
      localStorage.setItem('authTokens', JSON.stringify(data))
      navigate('/')
    } else {
      setLoginValidation("Wrong credentials.")
    }
  }

  let registerUser = async (e) => {
    e.preventDefault()
    let password = null;
    let email = null;

    // if the account is temporary, create random credentials and add temp_ to username string
    if (e.target.password) {
      password = e.target.password.value;
      email = e.target.email.value;
    } else {
      e.target.username.value = '#temp_' + e.target.username.value
      // generate random password and email
      const uuid = require('uuid');
      password = uuid.v4();
      email = uuid.v4() + '@gmail.com'
    }
    let response = await fetch('/api/user/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({'username': e.target.username.value, 'email': email, 'password': password})
    })
    let data = await response.json()
    if (response.status === 201) {
        loginUser(e, password)

    } else if (response.status === 400) {
      setRegisterValidation(data);
    }
  }

  let deleteUser = async () => {
    let response = await fetch('/api/user/delete/', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + String(authTokens.access)
      }
    })
  }

  let updateToken = async () => {
    if (user) {
      let response = await fetch('/api/token/refresh/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({'refresh': authTokens?.refresh})
      })
      let data = await response.json()
      if (response.status === 200) {
        setAuthTokens(data)
        setUser(jwt_decode(data.access))
        localStorage.setItem('authTokens', JSON.stringify(data))
      } else {
        if (data.detail === 'Token is blacklisted') {
          logoutUser()
        }
        if (data.access) {
          logoutUser()
        }
      }
    }
    if (loading) {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (loading) {
      updateToken()
    }
    let time = 1000 * 60 * 4
    let interval = setInterval(() => {
      if(authTokens) {
        updateToken()
      }
    }, time)
    return () => clearInterval(interval)
  }, [authTokens, loading])

  let logoutUser = () => {
     const temp = user['username'].split('_')[0]
     if (temp === '#temp') {
       deleteUser() // NOTE dodelat vymazani uzivatele
     }
     setAuthTokens(null)
     setUser(null)
     localStorage.removeItem('authTokens')
     navigate('/login')
  }

  let contextData = {
    user: user,
    loginUser : loginUser,
    loginValidation: loginValidation,
    registerUser: registerUser,
    registerValidation: registerValidation,
    logoutUser : logoutUser,
    authTokens : authTokens
  }

  return(
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  )
}
