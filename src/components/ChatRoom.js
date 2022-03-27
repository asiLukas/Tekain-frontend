import React, {useState, useEffect, useContext, useRef, useMemo, useCallback} from 'react'
import {w3cwebsocket as W3CWebSocket} from 'websocket'

import { Grid, TextField, Button, Paper, CardHeader, Card, Avatar} from '@mui/material'
import AuthContext from '../context/AuthContext'


let perfCount = 0;
let client = null
let initLoad = true;
let closed = false;

const ChatRoom = React.memo(({roomName, btnStyle}) => {

  perfCount++;
  const [messages, setMessages] = useState({messages:[]});
  const [dbMessages, setDbMessages] = useState({messages:[]});
  const [value, setValue] = useState('');
  const messageEndRef = useRef(null);
  const {user} = useContext(AuthContext);
  const [currentUsers, setCurrentUsers] = useState([])

  const scrollToBottom = () => {
    messageEndRef.current.scrollIntoView({behavior: 'smooth'});
  }

// NOTE zlepsi performance

  const handleMsgChange = (e) => {
      e.preventDefault()
      setValue(e.target.value)
      e.target.value = '';
  }

  const onBtnClick = (e) => {
      e.preventDefault();
      if (value !== '' && value !== null) {
        client.send(JSON.stringify({
          type: 'chatroom_message',
          message: value,
          username: user.username,
          user_id: user.user_id,
        }));
        setValue('')
      };
  }

  useEffect(() => {
    scrollToBottom()
    if (initLoad) {
      client = new W3CWebSocket('wss://tekain-api.herokuapp.com/ws/chat/' + roomName + '/')
      client.onopen = () => {
         client.send(JSON.stringify({
           type: 'get_user',
           message: null,
           username: user.username,
           user_id: user.user_id
         }))
      };
    }
    if (closed == false) {
      // console.log('aha')
      window.addEventListener('beforeunload', () => {
        if (closed == false) {
          console.log('disconnect')
          closed = true;
          client.send(JSON.stringify({
            type: 'get_user',
            message: 'disconnect',
            username: user.username,
            user_id: user.user_id,
          }))
        }
      })

    }

    client.onmessage = (e) => {
      const data = JSON.parse(e.data);
      // console.table('onmessage type: ', data)

      if (data) {
        if (data.db_messages) {
          setDbMessages({
            messages: data.db_messages
          })
        } else {
          if(data.message) {
            setMessages((state) =>
            ({
              messages: [...state.messages,
              {
                message: data.message,
                name: data.username,
              }]
            })
            );
          }

          if(data.users) {
            // console.log(data.users)
            setCurrentUsers(data.users)
          }

        }
      }
    };
    initLoad = false;
  }, [messages, dbMessages])


  return (
    <div style={{ marginTop: 50, }}>

    <div style={{display: 'flex', justifyContent: 'flex-start'}}>
      <p style={{marginRight: 20}}>Room Name: <b>{roomName}</b></p>
      <p>current users: </p>
      {
        currentUsers?.map((user, index) => (
            <p key={index} style={{paddingLeft: '10px'}}>{user}</p>
        ))
      }
    </div>
    <Paper scroll='body' color='secondary' variant='outlined' style={{ height: 700, maxHeight: 700, overflow: 'auto', boxShadow: 'none', marginBottom: '13px'}}>
      {
        dbMessages?.messages.map((message, index) =>
        (
          <Card key={index} style={{boxShadow: 'none'}}>
            <CardHeader
              avatar={
                <Avatar>
                  {message.author.username.charAt(0).toUpperCase()}
                </Avatar>
              }
              title={message.author.username}
              subheader={message.message}
              />
          </Card>
        )
        )
      }
      {
        messages?.messages.map((message, index) =>
        (
          <Card key={index} style={{boxShadow: 'none'}}>
            <CardHeader
              avatar={
                <Avatar>
                  {message.name.charAt(0).toUpperCase()}
                </Avatar>
              }
              title={message.name}
              subheader={message.message}
              />
          </Card>
        )
        )
      }
      <div ref={messageEndRef}/>
    </Paper>
    <form onSubmit={onBtnClick}>
      <TextField
        id="chatField"
        label="chat"
        color='secondary'
        onBlur={handleMsgChange}
        variant="outlined"
        fullWidth
      />
      <Button
        type='submit'
        color='secondary'
        variant="outlined"
        style={btnStyle}
        fullWidth>
        Send
      </Button>
    </form>
  </div>
);
});

export default ChatRoom;
