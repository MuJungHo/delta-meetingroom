import React, { useContext } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import { Chip, Tooltip, Button } from "@material-ui/core";
import moment from "moment";
import Booking from "./Booking";
import AllBooking from "./AllBooking";
import Information from "./Information";
import { GlobalContext } from "../../contexts/GlobalContext";

const useStyles = makeStyles((theme) => ({
  cell: {
    width: '14.28%',
    minHeight: 60,
    textAlign: 'center',
    borderRight: '1px solid rgb(218,220,224)',
    borderBottom: '1px solid rgb(218,220,224)',
    backgroundColor: '#fff',
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
  handleUpdateBooking,
  handleDeleteBooking

}) => {
  const classes = useStyles();
  const isToday = moment(date).isSame(new Date(), 'day');
  const { openDialog } = useContext(GlobalContext);

  const _bookings =
    bookings
      .filter(booking => booking.frequency === "once" && moment(date).isSame(booking.startDate, 'date')
        || (booking.frequency === "daily" && moment(date).isSameOrAfter(booking.startDate, 'date'))
        || (booking.frequency === "weekly" && moment(date).isSameOrAfter(booking.startDate, 'date') && (moment(date).weekday() === moment(booking.startDate).weekday()))
        || (booking.frequency === "monthly" && moment(date).isSameOrAfter(booking.startDate, 'date') && (moment(date).format("D") === moment(booking.startDate).format("D"))))
      .filter(booking => booking.endDate === null || moment(date).isSameOrBefore(booking.endDate, 'date'))

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
      title: "新增預約",
      maxWidth: "lg",
      section: <Booking date={date} onConfirm={handleCreateBooking} />
    })
  }

  const handleOpenEventDialog = (e, booking) => {
    e.stopPropagation()
    openDialog({
      title: booking.name,
      maxWidth: "lg",
      section: <Information
        bookingId={booking.id}
        handleUpdateBooking={handleUpdateBooking}
        handleDeleteBooking={handleDeleteBooking}
      />
    })
  }

  const handleOpenAllEventDialog = (e) => {
    e.stopPropagation()
    openDialog({
      title: date,
      maxWidth: "lg",
      section: <AllBooking
        date={date}
      />
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
        _bookings
          .slice(0, 3)
          .map(booking => <Tooltip
            title={`${booking.startTime}:00 - ${booking.endTime}:00`}
            key={booking.id}>
            <Chip
              // color="secondary"
              size="small"
              label={booking.name}
              onClick={(e) => handleOpenEventDialog(e, booking)}
              style={{ width: 'calc(100% - 20px)', margin: '2px 0' }}
            />
          </Tooltip>)
      }
      {
        _bookings.length > 3 && <Chip
          size="small"
          label={'更多'}
          onClick={handleOpenAllEventDialog}
          style={{ width: 'calc(100% - 20px)' }}
        />
      }
    </div>
  )
}