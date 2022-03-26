import {useState, useEffect, useContext} from 'react'
import {w3cwebsocket as W3CWebSocket} from 'websocket'
import ChatRoom from './ChatRoom'

import { Grid, TextField, Button, Paper, CardHeader, Card, Avatar} from '@mui/material'
import AuthContext from '../context/AuthContext'

const ChatRoomLogin = () => {
    const btnStyle = {margin: '10px auto'}
    const {user} = useContext(AuthContext)
    const [room, setRoom] = useState({room: ''})
    const [roomSet, setRoomSet] = useState({roomSet: false})

    const handleRoomChange = (e) => {
      e.preventDefault()
      const re = /^[A-Za-z-1-9]+$/; // Regex
      if (e.target.value === "" || re.test(e.target.value)) {
        setRoom({
          room: e.target.value
        })
      }
    }

    const handleSubmit = (e) => {
      e.preventDefault()
      setRoomSet({
        roomSet: true
      })
    }

    return(
        <div>
          {
            roomSet?.roomSet ?
              <ChatRoom
                roomName = {room?.room}
                btnStyle={btnStyle}
              />
            :
            <Grid>
                <Grid align='center'>
                    <h2>Join a chatroom</h2>
                </Grid>
                <Grid align='left'>
                  <h4>user: {user.username}</h4>
                </Grid>
                <form onSubmit={handleSubmit}>
                  <TextField
                    label='Room'
                    placeholder='Enter room name'
                    fullWidth
                    color='secondary'
                    required
                    onChange={handleRoomChange}
                    value={room?.room}
                    inputProps={{maxLength: 50}}
                    />
                  <Button
                    type='submit'
                    color='secondary'
                    variant="outlined"
                    style={btnStyle}
                    fullWidth>
                    Join
                  </Button>
                </form>

            </Grid>
          }
        </div>
      )
  }

export default ChatRoomLogin;
