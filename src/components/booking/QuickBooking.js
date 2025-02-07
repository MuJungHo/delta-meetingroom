import React, { useContext, useCallback } from "react";
import { makeStyles } from '@material-ui/core/styles';

// import { useHistory } from "react-router-dom";
import { GlobalContext } from "../../contexts/GlobalContext";

import {
  TextField,
  Checkbox,
  Button,
  DialogContent,
  DialogActions,
  Text,
  IconButton
} from "../common";

import { Chip, Tooltip, FormControlLabel, Select, MenuItem } from "@material-ui/core";

import { Delete, Edit } from '@material-ui/icons';
import Booking from "./Booking";
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

const allTimes = Array.from({ length: 24 }, (_, i) => i);

const getCurrentTimeIndex = () => {
  let currTime = null
  for (let i = 0; i < 23; i++) {
    if (moment().isBetween(moment().startOf('day').add(i, 'hours'), moment().startOf('day').add(i + 1, 'hours'))) {
      currTime = i
    }
  }
  return currTime
}

export default ({
  room = {},
  onConfirm = () => { }
}) => {
  // console.log(room)
  const classes = useStyles();
  const { closeDialog, t, authedApi, openDialog } = useContext(GlobalContext);
  const [state, setState] = React.useState({
    roomId: room.id,
    frequency: 'once',
    startDate: moment().format("YYYY-MM-DD"),
    endDate: moment().format("YYYY-MM-DD"),
    startTime: getCurrentTimeIndex(),
    name: ""
  })
  const [bookings, setBookings] = React.useState([]);

  const getBookingList = useCallback(async () => {
    let req = {
      startDateUnix: moment().unix(),
      endDateUnix: moment().unix(),
      startTime: 0
    }
    if (room.id) req.roomId = room.id
    let { rows } = await authedApi.getBookingList(req);

    const _rows = rows.map(a => a.startTime);

    setBookings(_rows);
  }, [])

  React.useEffect(() => {
    getBookingList()
  }, [getBookingList])

  return (
    <>
      <DialogContent
        dividers
        style={{
          width: 500
        }}>
        <div className={classes.info}>
          <Text>{t("name")}</Text>
          <TextField value={state.name} onChange={e => setState({
            ...state,
            name: e.target.value
          })} />
        </div>
        <div className={classes.info}>
          <Text>{t("time")}</Text>
          <Select
            value={state.startTime || ""}
            displayEmpty
            onChange={e => setState({ ...state, startTime: e.target.value })}
          >
            {
              allTimes
                .map((time, index) => <MenuItem
                  value={time}
                  key={index}
                  disabled={bookings.includes(time)}
                >
                  {`${time}:00 - ${time + 1}:00`}
                </MenuItem>
                )
            }
          </Select>
        </div>


      </DialogContent >
      <DialogActions>
        <Button onClick={() => onConfirm(state)}>
          {t("預約")}
        </Button>
        <Button onClick={closeDialog}>
          {t("close")}
        </Button>
      </DialogActions>
    </>
  )
}