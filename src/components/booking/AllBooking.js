import React, { useContext, useCallback } from "react";
import { makeStyles } from '@material-ui/core/styles';

// import { useHistory } from "react-router-dom";
import { GlobalContext } from "../../contexts/GlobalContext";

import {
  // TextField,
  // Checkbox,
  Button,
  DialogContent,
  DialogActions,
  Text,
  IconButton
} from "../common";

import { Chip, Tooltip } from "@material-ui/core";

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

export default ({
  events = [],
  date = null
}) => {
  const classes = useStyles();
  const { closeDialog, t, authedApi, openDialog } = useContext(GlobalContext);

  const [bookings, setBookings] = React.useState([]);

  const getBookingList = useCallback(async () => {
    let { rows } = await authedApi.getBookingList({
      startDate: moment(date).unix(),
      endDate: moment(date).unix(),
      startTime: 0,
      endTime: 23
    })
    const _rows = rows.map(a => ({ ...a, _id: a.id }))
    setBookings(_rows)
  }, [])

    React.useEffect(() => {
      getBookingList()
    }, [getBookingList])

  return (
    <>
      <DialogContent
        dividers
        style={{
          width: 400,
          textAlign: 'center'
        }}>
        {
          bookings
            .map(booking => <Tooltip
              title={`${booking.startTime}:00 - ${booking.endTime}:00`}
              key={booking.id}>
              <Chip
                // color="secondary"
                size="small"
                label={booking.name}
                style={{ width: 'calc(100% - 20px)', margin: '2px 0' }}
              />
            </Tooltip>)
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