import {useContext} from 'react'
import AuthContext from '../context/AuthContext'
import { Grid, TextField, Button, Link} from '@mui/material'

const LoginPage = () => {
  let {loginUser, loginValidation} = useContext(AuthContext)

  const fieldStyle = {margin: '10px auto'}
  return (
    <div>
      <Grid align='center'>
          <h2>Login</h2>
      </Grid>
      <form onSubmit={loginUser}>
        <TextField inputProps={{maxLength: 20, minLength: 2}} label='username' name='username' placeholder='enter username' fullWidth required/>
        <TextField label='password' name='password' placeholder='enter password' type='password' style={fieldStyle} fullWidth required/>
        <span style={{color: 'grey'}}>{loginValidation}</span>
        <Button type='submit' color='secondary' variant="outlined" style={fieldStyle}  fullWidth>Login</Button>
          <Grid container>
      <Grid item xs>
        <Link href="/temp" variant="body2" color="secondary">
          Use temporary account instead?
          </Link>
      </Grid>
      <Grid item>
        <Link href="/register" variant="body2" color="secondary">
          {"Don't have an account? Sign Up"}
        </Link>
      </Grid>
    </Grid>
      </form>
    </div>
  )
}

export default LoginPage
