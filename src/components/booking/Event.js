import React, { useContext } from "react";
import { makeStyles } from '@material-ui/core/styles';

// import { useHistory } from "react-router-dom";
import { GlobalContext } from "../../contexts/GlobalContext";

import {
  TextField, Button, Checkbox,
  DialogContent,
  DialogActions,
  Text
} from "../common";

import {
  FormControl, InputLabel,
  FormControlLabel,
  Select,
  MenuItem
} from '@material-ui/core';

import { api } from "../../utils/apis";
import moment from "moment";

const useStyles = makeStyles({
  info: {
    display: 'flex',
    // width: '100%',
    alignItems: 'center',
    minHeight: 45,
    margin: '6px 0',
    flex: 1,
    '& > *:first-child': {
      minWidth: '30%',
      marginRight: 20
    },
    '& > *:not(:first-child)': {
      flex: '1 1 auto'
    },
  },
})
export default ({
  onConfirm = () => { },
  date = null,
  bookingId = null
}) => {
  const classes = useStyles();
  const { closeDialog, t } = useContext(GlobalContext);
  // console.log(date)
  const [state, setState] = React.useState({
    date,
    frequency: 0,
    // endDate: moment(date).add(1, 'months').format("YYYY-MM-DD"),
    startTime: new Date(`${date} ${moment().format("HH:mm")}`),
    time: moment().format("HH:mm"),
    interval: 60,
    userId: "",
    roomId: "",
    name: ""
  });

  const [users, setUsers] = React.useState([]);
  const [rooms, setRooms] = React.useState([]);

  React.useEffect(() => {
    getUserList();
    getRoomList();
    if (bookingId) getBookingByBookingId()
  }, [bookingId])


  const getUserList = async () => {
    let { rows } = await api.getUserList({})

    const _rows = rows.map(a => ({ ...a, _id: a.id }))
    setUsers(_rows)
  }

  const getRoomList = async () => {
    let { rows } = await api.getRoomList({})

    const _rows = rows.map(a => ({ ...a, _id: a.id }))
    setRooms(_rows)
  }

  const getBookingByBookingId = async () => {
    let booking = await api.getBooking({ id: bookingId })
    setState({ ...booking, time: moment(booking.startTime).format("HH:mm") })
    console.log(moment(booking.startTime).format("HH:mm"))
  }

  return (
    <>
      <DialogContent
        dividers
        style={{
          width: 700
        }}>
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
              users.map(user => <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>)
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
              rooms.map(room => <MenuItem key={room.id} value={room.id}>{room.name}</MenuItem>)
            }
          </Select>
        </FormControl>
        <FormControl
          fullWidth
          required
          style={{ marginBottom: 20 }}>
          <InputLabel>{t("frequency")}</InputLabel>
          <Select
            value={state.frequency}
            onChange={e => setState({ ...state, frequency: e.target.value })}
          >
            <MenuItem value={0}>Once</MenuItem>
            <MenuItem value={1}>Daily</MenuItem>
            <MenuItem value={2}>Weekly</MenuItem>
            <MenuItem value={3}>Monthly</MenuItem>
          </Select>
        </FormControl>
        <div className={classes.info}>
          <Text>{t("name")}</Text>
          <TextField
            type="text"
            value={state.name}
            onChange={e => setState({
              ...state,
              name: e.target.value
            })}
          />
        </div>
        <div className={classes.info}>
          <Text>{t("startTime")}</Text>
          <TextField
            type="time"
            value={state.time}
            onChange={e => setState({
              ...state,
              time: e.target.value,
              startTime: new Date(`${date} ${e.target.value}`)
            })}
          />
        </div>
        <div className={classes.info}>
          <Text>{t("interval")}</Text>
          <TextField
            type="number"
            value={state.interval}
            onChange={e => setState({
              ...state,
              interval: e.target.value
            })}
          />
        </div>
        {/* <div className={classes.info}>
          <Text>{t("endDate")}</Text>
          <TextField
            type="date"
            defaultValue={state.endDate}
            onChange={e => setState({
              ...state,
              endDate: e.target.value
            })}
          />
        </div> */}
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog}>
          {t("cancel")}
        </Button>
        <Button color="primary" variant="contained" onClick={() => onConfirm(state)}>
          {t("confirm")}
        </Button>
      </DialogActions>
    </>
  )
}