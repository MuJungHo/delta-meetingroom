import React, { useContext } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import { Chip } from "@material-ui/core";
import moment from "moment";
import Event from "./Event";
import { GlobalContext } from "../../contexts/GlobalContext";

const useStyles = makeStyles((theme) => ({
  cell: {
    width: '14.28%',
    minHeight: 60,
    textAlign: 'center',
    borderRight: '1px solid rgb(218,220,224)',
    borderBottom: '1px solid rgb(218,220,224)',
    backgroundColor: '#fff'
  },
  spacer: {
    flex: 1
  },
  avatar: {
    backgroundColor: theme.palette.primary.main,
    width: 24,
    height: 24,
    fontSize: 12,
    fontWeight: 700,
    margin: 'auto',
    marginTop: 3
  }
}))
// frequency 0=once, 1=daily, 2=week, 3=monthly
export default ({
  date, index, bookings,
  handleCreateBooking,
  handleUpdateBooking
}) => {
  const classes = useStyles();
  const isToday = moment(date).isSame(new Date(), 'day');
  const { openDialog } = useContext(GlobalContext);

  const weekday = {
    0: '週日',
    1: '週一',
    2: '週二',
    3: '週三',
    4: '週四',
    5: '週五',
    6: '週六',
  }

  const handleOpenDialog = () => {
    openDialog({
      title: date,
      maxWidth: "lg",
      section: <Event date={date} onConfirm={handleCreateBooking} />
    })
  }

  const handleOpenEventDialog = (e, booking) => {
    e.stopPropagation()
    openDialog({
      title: booking.name,
      maxWidth: "lg",
      section: <Event bookingId={booking.id} onConfirm={handleUpdateBooking} />
    })
  }

  return (
    <div className={classes.cell}
      onClick={handleOpenDialog}
    >
      {index < 7 && <p style={{ margin: '8px 0', color: '#70757a' }}>{weekday[index]}</p>}
      {
        isToday
          ? <Avatar className={classes.avatar}>{moment(date).format("D")}</Avatar>
          : <p style={{ color: 'rgb(60,64,67)', marginTop: 8 }}>{moment(date).format('D')}</p>
      }
      {
        bookings
          .filter(booking => booking.frequency === 0 && moment(date).isSame(booking.startTime, 'date')
            || (booking.frequency === 1 && moment(date).isSameOrAfter(booking.startTime, 'date'))
            || (booking.frequency === 2 && moment(date).isSameOrAfter(booking.startTime, 'date') && (moment(date).weekday() === moment(booking.startTime).weekday()))
            || (booking.frequency === 3 && moment(date).isSameOrAfter(booking.startTime, 'date') && (moment(date).format("D") === moment(booking.startTime).format("D"))))
          .map(booking => <Chip
            // color="secondary"
            onClick={(e) => handleOpenEventDialog(e, booking)} style={{ width: 'calc(100% - 20px)', margin: '2px 0' }} size="small" key={booking.id} label={booking.name} />)
      }
    </div>
  )
}