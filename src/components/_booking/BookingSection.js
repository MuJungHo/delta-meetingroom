import React, { useContext, useCallback } from "react";
// import { makeStyles } from '@material-ui/core/styles';

// import {
//   FormGroup,
//   RadioGroup
// } from '@material-ui/core';

// import { useHistory } from "react-router-dom";
import { GlobalContext } from "../../contexts/GlobalContext";
import { api } from "../../utils/apis";

import {
  FormControl, InputLabel,
  FormControlLabel,
  Select,
  MenuItem,
} from '@material-ui/core';

import {
  TextField,
  // Checkbox, Radio, 
  Button,
  DialogContent,
  DialogActions,
} from "../common";

const UserSection = ({
  booking = {
    name: "",
    userId: "",
    roomId: ""
  },
  onConfirm = () => { },
}) => {
  const [state, setState] = React.useState(booking);
  const { closeDialog, t } = useContext(GlobalContext);

  const [userList, setUserList] = React.useState([]);
  const [roomList, setRoomList] = React.useState([]);

  const getUserList = async () => {
    let { rows } = await api.getUserList({})
    const _rows = rows.map(a => ({ ...a, _id: a.id }))
    setUserList(_rows)
  }

  const getRoomList = async () => {
    let { rows } = await api.getRoomList({})
    const _rows = rows.map(a => ({ ...a, _id: a.id }))
    setRoomList(_rows)
  }


  React.useEffect(() => {
    getUserList()
    getRoomList()
  }, [])


  return (
    <>
      <DialogContent
        dividers
        style={{
          width: 500
        }}>
        <TextField
          label={t("name")}
          type="text"
          fullWidth
          style={{ marginBottom: 20 }}
          value={state.name}
          onChange={e => setState({ ...state, name: e.target.value })}
        />
        <FormControl
          fullWidth
          required
          style={{ marginBottom: 20 }}>
          <InputLabel>{t("user")}</InputLabel>
          <Select
            value={state.userId}
            displayEmpty
            onChange={e => setState({ ...state, userId: e.target.value })}
          >
            {
              userList.map(user => <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>)
            }
          </Select>
        </FormControl>
        <FormControl
          fullWidth
          required
          style={{ marginBottom: 20 }}>
          <InputLabel>{t("room")}</InputLabel>
          <Select
            value={state.roomId}
            displayEmpty
            onChange={e => setState({ ...state, roomId: e.target.value })}
          >
            {
              roomList.map(room => <MenuItem key={room.id} value={room.id}>{room.name}</MenuItem>)
            }
          </Select>
        </FormControl>
        <TextField
          fullWidth
          type="datetime-local"
          value={state.startTime}
          onChange={e => setState({ ...state, startTime: e.target.value })}
        />
        <TextField
          fullWidth
          type="datetime-local"
          value={state.endTime}
          onChange={e => setState({ ...state, endTime: e.target.value })}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog}>
          {t("cancel")}
        </Button>
        <Button color="primary" variant="contained" onClick={() => onConfirm(state)}>
          {t("confirm")}
        </Button>
      </DialogActions>
    </>)
}

export default UserSection