import React, { useContext, useCallback } from "react";
import Calendar from "../components/booking/Calendar";
import { ArrowBackIos, ArrowForwardIos, Today } from '@material-ui/icons';
import { Button } from "../components/common";
import { api } from "../utils/apis";
import moment from "moment";
import { GlobalContext } from "../contexts/GlobalContext";

export default () => {
  const dt = new Date();
  const { closeDialog } = useContext(GlobalContext);
  const [year, setYear] = React.useState(dt.getFullYear());
  const [month, setMonth] = React.useState(dt.getMonth());
  const [bookings, setBookings] = React.useState([]);
  const currMonthFirstDay = new Date(year, month, 1).getDay();
  const currMonthDays = new Date(year, (month + 1), 0).getDate();
  const lastMonthDays = new Date(year, month, 0).getDate();

  const dates = [...Array(35).keys()].map(index => {
    if (index < currMonthFirstDay) {
      // console.log(month)
      return `${month === 0 ? year - 1 : year}-${month === 0 ? 12 : month}-${lastMonthDays - currMonthFirstDay + index + 1}`
    } else if (index > (currMonthDays + currMonthFirstDay - 1)) {
      return `${(month + 2) === 13 ? year + 1 : year}-${(month + 2) === 13 ? 1 : (month + 2)}-${index - currMonthDays - currMonthFirstDay + 1}`
    } else {
      return `${year}-${(month + 1)}-${index - currMonthFirstDay + 1}`
    }
  })

  const getBookingList = useCallback(async () => {
    let { rows } = await api.getBookingList({
      startTime: moment(dates[0]).unix(),
      endTime: moment(dates[34]).unix(),
      userId: 1
    })
    const _rows = rows.map(a => ({ ...a, _id: a.id }))
    setBookings(_rows)
  }, [year, month])

  React.useEffect(() => {
    getBookingList()
  }, [getBookingList])


  const handleLowerMonth = () => {
    if (month === 0) {
      setMonth(11)
      setYear(year - 1)
    } else {
      setMonth(month - 1)
    }
  }
  const handleHigherMonth = () => {
    if (month === 11) {
      setMonth(0)
      setYear(year + 1)
    } else {
      setMonth(month + 1)
    }
  }
  const handleCheckToday = () => {
    setYear(dt.getFullYear())
    setMonth(dt.getMonth())
  }


  const handleUpdateBooking = async (booking) => {
    // return console.log(booking)
    await api.putUpdateBooking({ data: { ...booking }, id: booking.id })
    closeDialog()
    getBookingList()
    // console.log(booking)
  }
  const handleCreateBooking = async (booking) => {
    // return console.log(booking)
    await api.postCreateBooking({ data: { ...booking } })
    closeDialog()
    getBookingList()
    // console.log(booking)
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Button onClick={handleCheckToday}><Today /></Button>
        <Button onClick={handleLowerMonth}><ArrowBackIos /></Button>
        <Button onClick={handleHigherMonth}><ArrowForwardIos /></Button>
        <h5>{`${year}/${month + 1}`}</h5>
      </div>
      <Calendar
        dates={dates}
        bookings={bookings}
        handleUpdateBooking={handleUpdateBooking}
        handleCreateBooking={handleCreateBooking}
      />
    </>
  )
}