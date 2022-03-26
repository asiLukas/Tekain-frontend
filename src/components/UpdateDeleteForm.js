import {useState} from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Input from '@mui/material/Input'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { BsPlus } from 'react-icons/bs';

export default function UpdateDeleteForm({value, handleSubmit, handleChange, handleImageChange, image}) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      {
        value === 'create' ?
        /*<BsPlus onClick={handleClickOpen} color='var(--main)' size={37}/> */
        <Button onClick={handleClickOpen} color='secondary' style={{textTransform: 'lowercase'}} variant='contained'>create post</Button>
        : value === 'update' ?
        <Button onClick={handleClickOpen} color='secondary'>update</Button>
        : value === 'delete' ?
        <Button onClick={handleClickOpen}  color='error'>delete</Button>
        : console.log('wrong value')
      }



      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{value} post</DialogTitle>
        <DialogContent>
          {
            value === 'delete' ?
            <DialogContentText>
              are you sure?
            </DialogContentText>
            :
            <div>
              <TextField
              onChange={handleChange}
              autoFocus
              margin="dense"
              color='secondary'
              id="outlined-basic"
              label="description"
              fullWidth
              variant="standard"
              />
            <label htmlFor='btnFile' ><span style={{color: 'grey', fontSize: '12px'}}>Currently supported files: .png, .jpg, .gif</span><br/>
              <TextField
                id='btnFile'
                onChange={handleImageChange}
                autoFocus
                margin="dense"
                color='secondary'
                type="file"
                inputProps={{accept: 'image/jpeg, image/x-png, image/gif'}}
                style={{display:'none'}}
                fullWidth
              />
            <Button variant='outlined' color='secondary' component='span' style={{marginTop: '10px', textTransform: 'lowercase'}}>upload</Button>
            </label>
            </div>
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={(e) => {
            handleSubmit(e)
            handleClose()
          }}>{value}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
