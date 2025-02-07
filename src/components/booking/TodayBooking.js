import React, { useContext, useCallback } from "react";
import { makeStyles } from '@material-ui/core/styles';

// import { useHistory } from "react-router-dom";
import { GlobalContext } from "../../contexts/GlobalContext";

import {
  // TextField,
  Checkbox,
  Button,
  DialogContent,
  DialogActions,
  Text,
  IconButton
} from "../common";

import { Chip, Tooltip, FormControlLabel } from "@material-ui/core";

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

export default ({
  date = null,
  room = {}
}) => {

  // const classes = useStyles();
  const { closeDialog, t, authedApi, openDialog } = useContext(GlobalContext);

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
          width: 500,
          textAlign: 'center'
        }}>
        {
          allTimes
            .map((time, index) => <FormControlLabel
              control={<Checkbox
              checked={bookings.includes(time)}
              />}
              label={`${time}:00 - ${time + 1}:00`}
              key={index}
            />
            )
        }
      </DialogContent >
      <DialogActions>
        <Button onClick={closeDialog}>
          {t("close")}
        </Button>
      </DialogActions>
    </>
  )
}