import React, {useState, useContext} from 'react'
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
import Styled from 'styled-components'


import UpdateDeleteForm from '../components/UpdateDeleteForm'

import AuthContext from '../context/AuthContext'
import LazyImage from '../components/LazyImage'


const CommentSection = Styled(Paper)`
  width: 35%;
  overflow: auto;
  height: 500px;
  margin-left: 4vw;

  @media screen and (max-width: 870px) {
    width: 100%;
    max-height: 300px;
  }
`

const StyledImage = styled.img`
  width: 55%;
  height: auto;
  margin-right: 4vw;
  float: right;
  display: block;

  @media screen and (max-width: 1920px) {
    width: 45%
  }
  @media screen and (max-width: 1000px) {
    width: 50%
  }
  @media screen and (max-width: 870px) {
    width: 90%;
  }
  @media screen and (min-width: 2400px) {
    width: 45%;
  }
  @media screen and (min-width: 3000px) {
    width: 35%;
  }
`

const PostSpan = styled.span`
  font-size: 20px;

  @media screen and (max-width: 870px) {
    font-size: 15px;
  }
`

const InputsDiv = styled.div`
  @media screen and (max-width: 870px) {
    float: left;
    width: 100%;
  }
`

const Post = React.memo(({open, dialogPost, setDialogPost, setOpen}) => {
  let [image, setImage] = useState(null);
  let [comment, setComment] = useState('');
  let [caption, setCaption] = useState('');
  let {authTokens, logoutUser, user} = useContext(AuthContext);

  const handleClose = () => {
    setOpen(false);
  }

  const handleChange = (e) => {
    setCaption({
      caption: e.target.value
    })
  }

  const handleCommentChange = (e) => {
    setComment(e.target.value)
  }

  const handleImageChange = (e) => {
    setImage({
      image: e.target.files[0]
    })
  }

  let updatePost = (id) => {
    if (caption.caption && image) {
      if (!image) {
        axios.put(`https://tekain-api.herokuapp.com/api/p/${id}/u/`, JSON.stringify({'caption': caption.caption, 'image': null}), {
          headers: {
            'content-type': 'application/json',
            'Authorization': 'Bearer ' + String(authTokens.access)
          }
        })
          .then(res => {
            window.location.reload()
          })
          .catch(err => console.log(err))
      } else {
        let form_data = new FormData()
        form_data.append('image', image.image, image.image.name)
        form_data.append('caption', caption.caption)
        axios.put(`https://tekain-api.herokuapp.com/api/p/${id}/u/`, form_data, {
          headers: {
            'content-type': 'multipart/form-data',
            'Authorization': 'Bearer ' + String(authTokens.access)
          }
        })
          .then(res => {
            window.location.reload()
          })
          .catch(err => console.log(err))
      }
    }
  }

  let deletePost = (id) => {
    axios.delete(`https://tekain-api.herokuapp.com/api/p/${id}/d/`, {
      headers: {
        'content-type': 'multipart/form-data',
        'Authorization': 'Bearer ' + String(authTokens.access)
      }
    })
    .then(res => {
      //console.log(res.data)
      handleClose()
      window.location.reload()
    })
    .catch(err => console.log(err))

  }

  let addComment = async (id) => {
    let response = await fetch(`https://tekain-api.herokuapp.com/api/p/${id}/`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + String(authTokens.access)
      },
      body: JSON.stringify({'comment': comment})
    });
    let data = await response.json()

    // add new comment to state
    setDialogPost({
      'post': dialogPost.post,
      'comments': [...dialogPost.comments, data]
    })

    // reset input field
    setComment('')

  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='lg'>
      <DialogTitle onClick={handleClose}>
        { dialogPost?.post.caption}
      </DialogTitle>
      <DialogActions>
        {/* <Button onClick={handleClose} style={{textTransform: 'lowercase'}} color='secondary'>Go back</Button>*/}
          {
            user.username === dialogPost?.post.author.username ?
              <div style={{display: 'flex', flex: '1 1 0', justifyContent: 'center'}}>
                <UpdateDeleteForm
                  value='update'
                  handleSubmit={() => updatePost(dialogPost?.post.id)}
                  handleChange={handleChange}
                  handleImageChange={handleImageChange}
                />
                <UpdateDeleteForm
                  value='delete'
                  handleSubmit={() => deletePost(dialogPost?.post.id)}
                  handleChange={handleChange}
                  handleImageChange={handleImageChange}
                />
            </div>
            : null
          }
      </DialogActions>
      <DialogContent>
        {
          dialogPost?.post.image !== null &&
          <StyledImage onClick={handleClose} src={'https://tekain-api.herokuapp.com' + dialogPost?.post.image} alt={``}/>
          
        }
          <CommentSection
            scroll='body'
            elevation={0}
            >

            { /* reverse loop to show comments at the top*/
              dialogPost?.comments.slice(0).reverse().map((comment, index) => (
                <div key={index}>
                <PostSpan>{comment?.author}: </PostSpan>
                <PostSpan style={{inlineSize: '10px', overflowWrap: 'break-word'}}>{comment?.comment}<br/></PostSpan>
                </div>
              ))
            }

        </CommentSection>
        <InputsDiv>
        <TextField
          style={{
            width: '35%',
            maxHeight: 500,
            marginLeft: '4vw'
          }}
          autoFocus
          margin='dense'
          color='secondary'
          label='comment'
          variant='standard'
          onChange={handleCommentChange}
          value={comment}
          />

        <Button
          style={{
            width: '35%',
            maxHeight: 500,
            marginLeft: '4vw',
            marginTop: '20px'
          }}

          margin='dense'
          color='secondary'
          label='comment'
          variant='outlined'
          onClick={() => addComment(dialogPost?.post.id)}
          >
          Add
        </Button>
      </InputsDiv>
      </DialogContent>
  </Dialog>
);
});

export default Post;
