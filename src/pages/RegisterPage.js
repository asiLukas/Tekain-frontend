import {useContext} from 'react'
import AuthContext from '../context/AuthContext'
import { Grid, TextField, Button, Link} from '@mui/material'


const RegisterPage = () => {
    let {registerUser, registerValidation} = useContext(AuthContext)
    const fieldStyle = {margin: '10px auto'}
    return (
       <div>
         <Grid align='center'>
             <h2>Register</h2>
         </Grid>
         <form onSubmit={registerUser}>
           <TextField inputProps={{maxLength: 20, minLength: 2}} label='username' name='username' placeholder='enter username' fullWidth required/>
           <TextField label='email' name='email' placeholder='enter email' type='email' style={fieldStyle} fullWidth required/>
           <TextField inputProps={{minLength: 8}} label='password' name='password' placeholder='enter password' type='password' fullWidth required/>

             <span style={{color: 'grey'}}>{registerValidation}</span>

           <Button type='submit' color='secondary' variant="outlined" style={fieldStyle}  fullWidth>Register</Button>
           <Grid container>
             <Grid item xs>
               <Link href="/temp" variant="body2" color="secondary">
                 Use temporary account instead?
                 </Link>
              </Grid>
              <Grid item>
               <Link href="/login" variant="body2" color="secondary">
                 {"Already have an account? Login"}
               </Link>
             </Grid>
           </Grid>

         </form>
       </div>
    )
}

export default RegisterPage
