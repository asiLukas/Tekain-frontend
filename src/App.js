import {Route, Routes, Navigate} from 'react-router-dom'
import {useContext, useState} from 'react'
import './App.css'

import { AuthProvider } from './context/AuthContext'
import AuthContext from './context/AuthContext'
import Navbar from './components/Navbar/'
import SideBar from './components/Sidebar'
import Footer from './components/Footer'
import ChatRoomLogin from './components/ChatRoomLogin'
// import UpdateDeleteForm from './components/UpdateDeleteForm'
import PostListPage from './pages/PostListPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import TempUserPage from './pages/TempUserPage'

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';


function App() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleNav = () => {
    setIsOpen(!isOpen)
  }

  let {user} = useContext(AuthContext)
  const auth = true

  return (
      <div className="App simple">
        <SideBar isOpen={isOpen} toggle={toggleNav}/>
        <Navbar toggle={toggleNav}/>
        <Container maxWidth='lg' style={{marginTop: '10px'}}>
        <Typography variant="body2" color="text.secondary" align="center" >
          <b>early release</b>: not meant for production<br/>
          <b>known issues</b>: ugly post view and chatroom design, user displayer in chatroom doesn't work on mobile, problems with commenting on safari, several security issues, weak error handling<br/>
          <b>important note: when logging in or registering, it may take a minute, due to the server having to load</b> (I'm not gonna pay any fees for the server to run all the time)
        </Typography>
        {
          !user ?
          <Routes>
            <Route exact path='/' element={<Navigate to="/login" />} />
            <Route path='/chat' element={<Navigate to="/login" />} />
            <Route path='/temp' element={<TempUserPage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />
          </Routes>
          :
          <Routes>
              <Route exact path='/' element={<PostListPage />} />
              <Route path='/chat' element={<ChatRoomLogin />} />
              <Route path='/login' element={<Navigate to="/" />} />
              <Route path='/register' element={<Navigate to="/" />} />
              <Route path='/temp' element={<Navigate to="/" />} />
          </Routes>
        }
        <Footer />
        </Container>
      </div>
  );
}
// 1:33
export default App;
