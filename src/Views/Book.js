import React, { useContext, useCallback } from "react";
import Calendar from "../components/booking/Calendar";
import { ArrowBackIos, ArrowForwardIos, Today, ArrowBack } from '@material-ui/icons';
import { Button } from "../components/common";
import moment from "moment";
import { GlobalContext } from "../contexts/GlobalContext";
import { useParams, useHistory } from "react-router-dom";
export default () => {
  const dt = new Date();
  const { roomId } = useParams();
  const history = useHistory()
  const { closeDialog, authedApi } = useContext(GlobalContext);
  const [year, setYear] = React.useState(dt.getFullYear());
  const [month, setMonth] = React.useState(dt.getMonth());
  const [bookings, setBookings] = React.useState([]);
  // const currMonth = new Date(year, month).getMonth();
  const currMonthFirstDay = new Date(year, month, 1).getDay();
  const currMonthDays = new Date(year, (month + 1), 0).getDate();
  const lastMonthDays = new Date(year, month, 0).getDate();

  const dates = [...Array(35).keys()].map(index => {
    let date = ""
    if (index < currMonthFirstDay) {
      // console.log(month)
      date = `${month === 0 ? year - 1 : year}-${month === 0 ? 12 : month}-${lastMonthDays - currMonthFirstDay + index + 1}`
    } else if (index > (currMonthDays + currMonthFirstDay - 1)) {
      date = `${(month + 2) === 13 ? year + 1 : year}-${(month + 2) === 13 ? 1 : (month + 2)}-${index - currMonthDays - currMonthFirstDay + 1}`
    } else {
      date = `${year}-${(month + 1)}-${index - currMonthFirstDay + 1}`
    }
    return moment(date).format("YYYY-MM-DD")
  })

  const getBookingList = useCallback(async () => {
    if (!roomId) return
    let { rows } = await authedApi.getBookingList({
      startDateUnix: moment(dates[0]).unix(),
      endDateUnix: moment(dates[34]).unix(),
      startTime: 0,
      roomId
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
    await authedApi.putUpdateBooking({ data: { ...booking }, id: booking.id })
    closeDialog()
    getBookingList()
    // console.log(booking)
  }

  const handleDeleteBooking = async (bookingId) => {
    await authedApi.deleteBooking({ id: bookingId })
    closeDialog()
    getBookingList()
  }

  const handleCreateBooking = async (booking) => {
    // return console.log(booking)
    const data = {
      roomId: roomId,
      frequency: booking.frequency,
      startDate: moment(booking.startDate).format("YYYY-MM-DD"),
      endDate: booking.endDate ? moment(booking.endDate).format("YYYY-MM-DD") : null,
      startTime: booking.startTime,
      name: booking.name
    };
    await authedApi.postCreateBooking({
      data
    })
    closeDialog()
    getBookingList()
    // console.log(booking)
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Button onClick={() => history.push('/room')}><ArrowBack />回上一頁</Button>
        <div style={{ flex: 1 }} />
        <Button onClick={handleLowerMonth}><ArrowBackIos /></Button>
        {/* <Button onClick={handleCheckToday}><Today /></Button> */}
        <h5>{`${year}/${month + 1}`}</h5>
        <Button onClick={handleHigherMonth}><ArrowForwardIos /></Button>
        <div style={{ flex: 1 }} />
      </div>
      <Calendar
        dates={dates}
        bookings={bookings}
        handleUpdateBooking={handleUpdateBooking}
        handleCreateBooking={handleCreateBooking}
        handleDeleteBooking={handleDeleteBooking}
      />
    </>
  )
}