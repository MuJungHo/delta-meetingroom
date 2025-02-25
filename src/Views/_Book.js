import React, { useContext, useCallback } from "react";
import {
  Calendar,
  momentLocalizer
} from 'react-big-calendar';
import moment from 'moment';
import { GlobalContext } from "../contexts/GlobalContext";
import { useParams, useHistory } from "react-router-dom";
import Booking from "../components/booking/Booking";
import Information from "../components/booking/Information";
const localizer = momentLocalizer(moment);


export default (props) => {
  const dt = new Date();
  // const { roomId } = useParams();
  const history = useHistory()
  const { closeDialog, authedApi, openDialog } = useContext(GlobalContext);
  const [view, setView] = React.useState('month');
  const [date, setDate] = React.useState(dt);
  const [bookings, setBookings] = React.useState([]);

  const getBookingList = async () => {

    const year = date.getFullYear();
    const month = date.getMonth()
    // const currMonth = new Date(year, month).getMonth();
    const currMonthFirstDay = new Date(year, month, 1).getDay();
    const currMonthDays = new Date(year, (month + 1), 0).getDate();
    const lastMonthDays = new Date(year, month, 0).getDate();

    let startDateUnix = moment().unix();
    let endDateUnix = moment().unix();

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

    if (view === 'month') {
      startDateUnix = moment(dates[0]).unix();
      endDateUnix = moment(dates[32]).unix();
    }

    if (view === 'week') {
      startDateUnix = moment(date).weekday(0).unix();
      endDateUnix = moment(date).weekday(6).unix();
    }

    if (view === 'day') {
      startDateUnix = moment(date).unix();
      endDateUnix = moment(date).unix();
    }

    let { rows } = await authedApi.getBookingList({
      startDateUnix,
      endDateUnix,
      startTime: 0,
    })
    let _rows = [];

    rows.forEach(row => {
      if (row.frequency === 'once') {
        _rows.push({
          ...row,
          start: moment(`${row.startDate} ${row.startTime}:00:00`).toDate(),
          end: moment(`${row.endDate} ${row.startTime + 1}:00:00`).subtract(1, 'days').toDate(),
          title: row.name
        })
      } else {
        row.dates.forEach((date) => {
          // console.log(date)
          _rows.push({
            ...row,
            start: moment(`${date} ${row.startTime}:00:00`).toDate(),
            end: moment(`${date} ${row.startTime + 1}:00:00`).toDate(),
            title: row.name
          })
        })
      }
    })
    setBookings(_rows)
  }
  const handleOnViewChange = view => {
    setView(view);

  }

  const handleSelectSlot = useCallback(
    ({ start, end }) => {
      const startDate = moment(start).format("YYYY-MM-DD");
      const endDate = moment(end).format("YYYY-MM-DD");
      // console.log(start, end)
      openDialog({
        title: "新增預約",
        maxWidth: "lg",
        section: <Booking startDate={startDate} endDate={endDate} onConfirm={handleCreateBooking} />
      })
    },
    []
  )

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

  const handleSelectEvent = useCallback(
    (booking) => {
      openDialog({
        title: booking.name,
        maxWidth: "lg",
        section: <Information
          bookingId={booking.id}
          handleUpdateBooking={handleUpdateBooking}
          handleDeleteBooking={handleDeleteBooking}
        />
      })
    },
    []
  )

  const handleCreateBooking = async (booking) => {
    // return console.log(booking)
    const data = {
      roomId: booking.roomId,
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

  React.useEffect(() => {
    getBookingList()
  }, [date, view])

  const eventProps = event => {
    const colors = ['DarkSlateBlue', 'DarkSeaGreen', 'DarkCyan'];
    // console.log(event.roomId % 4)
    const index = event.roomId % 3;
    const backgroundColor = colors[index];
    return {
      style: {
        backgroundColor
      }
    };
  }

  return (
    <Calendar
      views={['month', 'week', 'day']}
      view={view}
      onView={handleOnViewChange}
      onNavigate={date => setDate(date)}
      onSelectSlot={handleSelectSlot}
      onSelectEvent={handleSelectEvent}
      eventPropGetter={eventProps}
      date={date}
      timeslots={2}
      min={new Date(0, 0, 0, 10, 0, 0)}
      max={new Date(0, 0, 0, 22, 0, 0)}
      localizer={localizer}
      events={bookings}
      startAccessor="start"
      endAccessor="end"
      selectable
      style={{ height: 'calc(100vh - 110px)', margin: '10px 20px' }}
    />
  )
}