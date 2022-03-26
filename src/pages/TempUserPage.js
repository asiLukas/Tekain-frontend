import {useContext} from 'react'
import { Grid, TextField, Button, Link} from '@mui/material'
import AuthContext from '../context/AuthContext'

const TempUserPage = () => {
  let {registerUser} = useContext(AuthContext);
  return (
    <div>
      <h1 style={{marginTop: 50}}>Temporary account creation</h1>
      <h2>What is a temporary account?</h2>
      <p style={{fontSize: 20}}>It's an account that you don't have to create password for, because it's deleted immediately after the user logs out. This can be useful in a number of cases.<br/> Have you ever been bored in the class and wanted to play <a href='https://krunker.io/'>Krunker</a> or <a href='https://lichess.org/'>chess</a> with your friends? If yes, you remember that in order to play together you have to share a code. So you have to open some chat application, login, wait before the app loads, click trough everything ... <br/> With this, only thing you have to do is select a username, join a room and share the code. <b>Warning: </b>every post or message from the account will be deleted right after log out.</p>

        <form onSubmit={registerUser}>
          <TextField inputProps={{maxLength: 14, minLength: 2}} label='username' name='username' placeholder='enter username' fullWidth required/>
          <Button type='submit' color='secondary' variant="outlined" style={{margin: '10px auto'}}  fullWidth>Create</Button>
            <Grid container>
        <Grid item xs>
          <Link href="/login" variant="body2" color="secondary">
            Use permanent account instead?
            </Link>
        </Grid>
      </Grid>
        </form>

    <form></form>
    </div>
  )
}

export default TempUserPage;
