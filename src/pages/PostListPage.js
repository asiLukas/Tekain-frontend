import React, {useState, useEffect, useContext} from 'react'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'

import Link from '@mui/material/Link'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import TextField from '@mui/material/TextField'
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions'
import styled from 'styled-components'
import Typography from '@mui/material/Typography'

import UpdateDeleteForm from '../components/UpdateDeleteForm'

import AuthContext from '../context/AuthContext'
import LazyImage from '../components/LazyImage'
import Post from '../components/Post'

const Caption = styled.p`
  color: var(--main);
  inline-size: 100%;
  overflow-wrap: break-word;
`

const PostListPage = React.memo(() => {
  let [posts, setPosts] = useState([]);
  let [dialogPost, setDialogPost] = useState(null);
  let [image, setImage] = useState(null);
  let [open, setOpen] = useState(false);
  let {authTokens, logoutUser, user} = useContext(AuthContext);
  let [comment, setComment] = useState('');
  const navigate = useNavigate();

  const handleOpen = (id) => {
    setOpen(true);
    getPost(id);
  }

  const handleClose = () => {
    setOpen(false);
  }

  const handleCommentChange = (e) => {
    setComment(e.target.value)
  }

  const handleImageChange = (e) => {
    setImage({
      image: e.target.files[0]
    })
  }

  let getPosts = async () => {
    let response = await fetch('https://tekain-api.herokuapp.com/api/p/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + String(authTokens.access)
      }
    })
    let data = await response.json()
    if (response.status === 200) {
      setPosts(data)
    } else if(response.statusText === 'Unauthorized') {
      logoutUser()
    }
  }

  let getPost = async (id) => {
    let response = await fetch(`https://tekain-api.herokuapp.com/api/p/${id}/`, {
      method: 'GET',
      headers: {
        'content-type': 'multipart/form-data',
        'Authorization': 'Bearer ' + String(authTokens.access)
      }
    });
    let data = await response.json()
    setDialogPost(data)
  }


  useEffect(() => {
    getPosts()
  }, [])

  return (
    <div className='content'>
      <Typography variant="body2" color="text.secondary" align="center" >
        known issues: ugly post view design, laggy input forms, chat doesn't work on safari, last user that exits chatroom appears as if he was still joined
      </Typography>
      {posts.map((post, index) => (
        <Paper elevation={10} key={index} style={
            {
             background: '#e0e0e0',
             padding: '3vw',
             width: '50%',
             margin: '70px auto'
            }
        }>
          <Link onClick={() => handleOpen(post?.id)} style={{textDecoration: 'none', cursor: 'pointer'}}>
          <LazyImage src={post.image} alt=''/>
          <Caption>{post.caption}</Caption>
          </Link>
          <Post
            open={open}
            dialogPost={dialogPost}
            setDialogPost={setDialogPost}
            setOpen={setOpen}
            />
        </Paper>
      ))}

    </div>
  )
})

export default PostListPage
