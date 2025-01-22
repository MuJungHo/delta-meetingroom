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

const getCurrentTimeIndex = () => {
  let currTime = []
  for (let i = 0; i < 23; i++) {
    if (moment().isBetween(moment().startOf('day').add(i, 'hours'), moment().startOf('day').add(i + 1, 'hours'))) {
      currTime = [i, i + 1]
    }
  }
  return currTime
}

export default ({
  onConfirm = () => { },
  date = null,
  bookingId = null
}) => {
  const classes = useStyles();
  const { closeDialog, t, authedApi } = useContext(GlobalContext);

  const [state, setState] = React.useState({
    date,
    frequency: "once",
    startTime: getCurrentTimeIndex()[0],
    endTime: getCurrentTimeIndex()[1],
    startDate: date,
    endDate: null,
    userId: "",
    roomId: "",
    name: ""
  });
  const [users, setUsers] = React.useState([]);
  const [rooms, setRooms] = React.useState([]);

  const times = [...Array(24).keys()].map(index => ({
    name: moment().startOf('day').add(index, 'hours').format("HH:mm"),
    value: index
  }))
  // console.log(times)

  React.useEffect(() => {
    // getUserList();
    getRoomList();
    if (bookingId) getBookingByBookingId()
  }, [bookingId])


  // const getUserList = async () => {
  //   let { rows } = await authedApi.getUserList({})

  //   const _rows = rows.map(a => ({ ...a, _id: a.id }))
  //   setUsers(_rows)
  // }

  const getRoomList = async () => {
    let { rows } = await authedApi.getRoomList({})

    const _rows = rows.map(a => ({ ...a, _id: a.id }))
    setRooms(_rows)
    setState({ ...state, roomId: _rows[0].id })
  }

  const getBookingByBookingId = async () => {
    let booking = await authedApi.getBooking({ id: bookingId });
    setState({
      ...booking,
      date,
      // startDate: moment(booking.startTime).format("YYYY-MM-DD"),
      // startTime: Number(moment(booking.startTime).format("HH")),
      // endDate: moment(booking.endTime).format("YYYY-MM-DD"),
      // endTime: Number(moment(booking.endTime).format("HH")),
    })
  }

  return (
    <>
      <DialogContent
        dividers
        style={{
          width: 700
        }}>
        <div className={classes.info}>
          <Text>{t("name")}</Text>
          <TextField
            type="text"
            value={state.name || ""}
            onChange={e => setState({
              ...state,
              name: e.target.value
            })}
          />
        </div>
        <div className={classes.info}>
          <Text>{t("room")}</Text>
          <Select
            value={state.roomId || ""}
            displayEmpty
            onChange={e => setState({ ...state, roomId: e.target.value })}
          >
            {
              rooms.map(room => <MenuItem key={room.id} value={room.id}>{room.name}</MenuItem>)
            }
          </Select>
        </div>
        <div className={classes.info}>
          <Text>{t("datetime")}</Text>
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            width: '100%'
          }}>
            <TextField
              type="date"
              value={state.startDate || ""}
              style={{ flex: 1, marginRight: 20 }}
              onChange={e => setState({
                ...state,
                startDate: e.target.value
              })}
            />
            <Select
              style={{ flex: .5, marginRight: 20 }}
              value={state.startTime}
              onChange={e => setState({ ...state, startTime: e.target.value })}
            >
              {
                times
                  .filter(time => time.value < state.endTime)
                  .map(time => <MenuItem key={time.value} value={time.value}>{time.name}</MenuItem>)
              }
            </Select>
            <Select
              style={{ flex: .5 }}
              value={state.endTime || ""}
              onChange={e => setState({ ...state, endTime: e.target.value })}
            >
              {
                times
                  .filter(time => time.value > state.startTime)
                  .map(time => <MenuItem key={time.value} value={time.value}>{time.name}</MenuItem>)
              }
            </Select>
          </div>
        </div>
        <div className={classes.info}>
          <Text>{t("frequency")}</Text>
          <Select
            value={state.frequency || "once"}
            onChange={e => setState({ ...state, frequency: e.target.value })}
          >
            <MenuItem value="once">Once</MenuItem>
            <MenuItem value="daily">Daily</MenuItem>
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
          </Select>
        </div>
        <div className={classes.info}>
          <Text>{t("endDate")}</Text>
          <TextField
            type="date"
            value={state.endDate || ""}
            // defaultValue="2024-12-10T10:10:10"
            onChange={e => setState({
              ...state,
              endDate: e.target.value
            })}
          />
        </div>
      </DialogContent >
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