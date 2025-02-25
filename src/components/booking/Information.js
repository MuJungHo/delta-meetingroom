import React, { useContext } from "react";
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

// import {
//   FormControl, InputLabel,
//   FormControlLabel,
//   Select,
//   MenuItem
// } from '@material-ui/core';

import { Delete, Edit } from '@material-ui/icons';
import Booking from "./Booking";
// import moment from "moment";

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
  handleUpdateBooking = () => { },
  handleDeleteBooking = () => { },
  bookingId = null
}) => {
  const classes = useStyles();
  const { closeDialog, t, authedApi, openDialog } = useContext(GlobalContext);

  const [state, setState] = React.useState({});
  // const [users, setUsers] = React.useState([]);
  // const [rooms, setRooms] = React.useState([]);

  React.useEffect(() => {
    // getUserList();
    // getRoomList();
    if (bookingId) getBookingByBookingId()
  }, [bookingId])

  // const getRoomList = async () => {
  //   let { rows } = await authedApi.getRoomList({})

  //   const _rows = rows.map(a => ({ ...a, _id: a.id }))
  //   setRooms(_rows)
  // }

  const getBookingByBookingId = async () => {
    let booking = await authedApi.getBooking({ id: bookingId });
    setState({ ...booking })
  }

  const handleOpenEventDialog = () => {
    openDialog({
      title: `編輯${state.name}`,
      maxWidth: "lg",
      section: <Booking bookingId={state.id} onConfirm={handleUpdateBooking} />
    })
  }

  return (
    <>
      <DialogContent
        dividers
        style={{
          width: 400
        }}>
        <div className={classes.info}>
          <Text>{t("room")}</Text>
          <Text>{state.roomId}</Text>
        </div>
        <div className={classes.info}>
          <Text>{t("datetime")}</Text>
          <Text>{`${state.startDate} ${state.startTime}:00 - ${state.startTime + 1}:00`}</Text>
        </div>
        <div className={classes.info}>
          <Text>{t("frequency")}</Text>
          <Text>{state.frequency}</Text>
        </div>
        <div className={classes.info}>
          <Text>{t("endDate")}</Text>
          <Text>{state.endDate}</Text>
        </div>
        <div className={classes.info}>
          <Text>{t("action")}</Text>
          <div>
            <IconButton onClick={handleOpenEventDialog}>
              <Edit />
            </IconButton>
            <IconButton onClick={() => handleDeleteBooking(bookingId)}>
              <Delete />
            </IconButton>
          </div>
        </div>
      </DialogContent >
      <DialogActions>
        <Button onClick={closeDialog}>
          {t("close")}
        </Button>
      </DialogActions>
    </>
  )
}