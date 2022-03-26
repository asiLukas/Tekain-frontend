import React, {useState, useContext} from 'react'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import Button from '@mui/material/Button'

import {SidebarContainer, Icon, CloseIcon, SidebarWrapper, SidebarMenu, SidebarLink, SidebarForm} from './SidebarElements'
import AuthContext from '../../context/AuthContext'
import UpdateDeleteForm from '../UpdateDeleteForm'


const SideBar = ({isOpen, toggle}) => {
  let {user, logoutUser, authTokens} = useContext(AuthContext)
  let navigate = useNavigate()

  let [caption, setCaption] = useState('')
  let [image, setImage] = useState(null)

  const handleChange = (e) => {
    setCaption({
      caption: e.target.value
    })
  }

  const handleImageChange = (e) => {
    setImage({
      image: e.target.files[0]
    })
  }

  let createPost = (e) => {
      e.preventDefault()
      if (caption.caption && image) {
        let form_data = new FormData();
        form_data.append('image', image.image, image.image.name);
        form_data.append('caption', caption.caption);
        console.log(form_data.image)
        axios.post('/api/p/n/', form_data, {
          headers: {
            'content-type': 'multipart/form-data',
            'Authorization': 'Bearer ' + String(authTokens.access)
          }
        })
            .then(res => {
              // console.log(res.data);
              navigate('/')
              window.location.reload()
            })
            .catch(err => console.log(err))
        }
      }
  return (
    <SidebarContainer isOpen={isOpen}>
      <Icon onClick={toggle}>
        <CloseIcon />
      </Icon>
      <SidebarWrapper>
        <SidebarMenu>
            {
              user &&
              <>
                <SidebarForm to='#'>
                    <UpdateDeleteForm
                    value="create"
                    handleSubmit={createPost}
                    handleChange={handleChange}
                    handleImageChange={handleImageChange}
                    />
                </SidebarForm>

                <SidebarLink to='/chat' onClick={toggle}>
                    <Button style={{textTransform: 'lowercase'}} color='secondary'>chat</Button>
                </SidebarLink>
              </>
            }

            {
              user ?
                <SidebarLink to='/login' onClick={toggle}>
                  <Button onClick={logoutUser} style={{textTransform: 'lowercase'}} color='secondary'>Logout</Button>
                </SidebarLink>
              :
                <SidebarLink to='/register' onClick={toggle}>
                  <Button style={{textTransform: 'lowercase'}} color='secondary' variant='contained'>Sign Up</Button>
                </SidebarLink>
            }

        </SidebarMenu>
      </SidebarWrapper>
    </SidebarContainer>
  )
}

export default SideBar
