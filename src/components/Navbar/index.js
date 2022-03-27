import React, {useState, useContext} from 'react'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import Button from '@mui/material/Button'

import {Nav, NavbarContainer, NavLogo, MobileIcon, NavMenu, NavItem, NavLinks, NavForm} from './NavbarElements'
import UpdateDeleteForm from '../UpdateDeleteForm'
import AuthContext from '../../context/AuthContext'

import {FaBars} from 'react-icons/fa'


const Navbar = ({toggle}) => {
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
      console.log('createpost')
      if (caption.caption) {
        if (!image) {
          axios.post('https://tekain-api.herokuapp.com/api/p/n/', JSON.stringify({'caption': caption.caption, 'image': null}), {
            headers: {
              'content-type': 'application/json',
              'Authorization': 'Bearer ' + String(authTokens.access)
            }
          }).then(res => {
            // console.log(res.data);
            navigate('/')
            window.location.reload()
          })
          .catch(err => console.log(err))
        } else {
          let form_data = new FormData();
          form_data.append('image', image.image, image.image.name);
          form_data.append('caption', caption.caption);
          axios.post('https://tekain-api.herokuapp.com/api/p/n/', form_data, {
            headers: {
              'content-type': 'multipart/form-data',
              'Authorization': 'Bearer ' + String(authTokens.access)
            }
          }).then(res => {
            // console.log(res.data);
            navigate('/')
            window.location.reload()
          })
          .catch(err => console.log(err))
        }
        }
      }

  return (
    <>
      <Nav>
        <NavbarContainer>

          <NavLogo to='/'>Tekain</NavLogo>
            <MobileIcon onClick={toggle}>
              <FaBars />
            </MobileIcon>

          <NavMenu>
            {
              user &&
              <>
                <NavItem>
                  <NavForm>
                    <UpdateDeleteForm
                    value="create"
                    handleSubmit={createPost}
                    handleChange={handleChange}
                    handleImageChange={handleImageChange}
                    />
                  </NavForm>
                </NavItem>

                <NavItem>
                  <NavLinks to='chat'>
                    <Button style={{textTransform: 'lowercase'}} color='secondary'>chat</Button>
                  </NavLinks>
                </NavItem>
              </>
            }
            <NavItem>
              {
                user ?
                  <NavLinks to='login'>
                    <Button onClick={logoutUser} style={{textTransform: 'lowercase'}} color='secondary'>Logout</Button>
                  </NavLinks>
                :
                  <NavLinks to='register'>
                    <Button style={{textTransform: 'lowercase'}} color='secondary' variant='contained'>Sign Up</Button>
                  </NavLinks>
              }
            </NavItem>

          </NavMenu>
        </NavbarContainer>
      </Nav>
    </>
  )
}

export default Navbar
