import React, { useContext, useState, useCallback } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { AuthContext } from "../contexts/AuthContext";
import { GlobalContext } from "../contexts/GlobalContext";
import moment from "moment";
import {
  Paper,
  Button,
  IconButton
} from "../components/common";
import { DarkMode, LightMode } from "../images/icons";
import Avatar from '@material-ui/core/Avatar';
import LanguageSharpIcon from '@material-ui/icons/LanguageSharp';
import SettingIcon from '@material-ui/icons/Settings';
import QuickBook from "../components/client/QuickBook";
import Checkin from "../components/client/Checkin";

const useStyles = makeStyles({
  button: {
    padding: 48,
    borderRadius: 15,
    '& > span': {
      fontSize: 64,
    }
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

export default () => {
  const { locale, changeLocale, authedApi, changeTheme, theme, openDialog, closeDialog } = useContext(GlobalContext);
  const { padToken } = useContext(AuthContext);

  const [room, setRoom] = useState({});
  const [currentBooking, setCurrentBooking] = useState({});
  // const [bookings, setBookings] = useState([]);
  const [bookingTimes, setBookingTimes] = useState([]);
  const [counter, setCounter] = useState(0);
  const currentDate = moment().format("YYYY/MM/DD")
  const classes = useStyles();

  const scale = window.innerWidth / 1920;

  const getClientMe = async () => {
    // if (!padId) return
    let _room = await authedApi.getClientMe({})

    setRoom(_room)
  }

  const getClientBookingList = async () => {
    // if (!padId) return
    let { rows } = await authedApi.getClientBookingList({
      startDateUnix: moment().unix(),
      endDateUnix: moment().unix(),
      startTime: 0
    })
    // const _rows = rows.map(a => ({ ...a, _id: a.id }))
    const _rows = rows.map(a => a.startTime);
    // setBookings(rows)
    setBookingTimes(_rows)

    const _currentBooking = rows.find(booking => booking.startTime === getCurrentTimeIndex()) || {};
    const seconds = moment(`${_currentBooking.startDate} ${_currentBooking.startTime}:00:00`).add(1, 'h').unix() - moment().unix() || 0


    setCounter(seconds);
    setCurrentBooking(_currentBooking)
  }

  React.useEffect(() => {
    if (JSON.stringify(currentBooking) === "{}") return

    const intervalId = setInterval(() => {
      setCounter((c) => {
        if (c === 0) {
          getClientBookingList();
          clearInterval(intervalId)
        }
        return c - 1
      })
    }, 1000)
    // console.log(currentBooking)
    return () => clearInterval(intervalId); //This is important

  }, [currentBooking])

  React.useEffect(() => {
    // getClientBookingList()
    let url = `ws://localhost:8080/?token=${padToken}`;
    var ws = new WebSocket(url)
    // 監聽連線狀態
    ws.onopen = () => {
      console.log('open connection')
    }
    ws.onclose = () => {
      console.log('close connection');
    }
    //接收 Server 發送的訊息
    ws.onmessage = event => {
      getClientBookingList()
    }
    getClientMe()
  }, [])

  const handleOpenQuickBook = () => {
    openDialog({
      titleFontSize: 36 / scale,
      title: 'Quick Book',
      maxWidth: "lg",
      section: <QuickBook onConfirm={handleQuickBook} />
    })
  }

  const handleQuickBook = async (state) => {
    await authedApi.postClientBooking({
      data: {
        name: state.name,
        account: state.account,
        password: state.password,
        startTime: getCurrentTimeIndex(),

        startDate: moment().format("YYYY-MM-DD"),
        endDate: moment().format("YYYY-MM-DD"),
        frequency: 'once'
      }
    })
    closeDialog()
    getClientMe()
    // console.log(state)
    // getClientBookingList()
  }

  const handleCheckIn = () => {

    openDialog({
      maxWidth: "lg",
      titleFontSize: 36 / scale,
      title: 'Check in',
      section: <Checkin onConfirm={handleCheckin} />
    })
  }

  const handleCheckin = async (state) => {
    await authedApi.putClientChecking({
      data: {
        account: state.account,
        password: state.password,
        bookingId: currentBooking.id,
        date: moment().format("YYYY-MM-DD")
      }
    })
    closeDialog()
    // console.log(state)
    getClientMe()
    getClientBookingList()
  }


  // console.log(room)

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100vh',
      backgroundColor:
        currentBooking?.checkinDates?.includes(moment().format("YYYY-MM-DD"))
          ? 'salmon'
          : bookingTimes.includes(getCurrentTimeIndex())
            ? 'orange' : 'seagreen'
    }}>
      {/* <div style={{ display: 'flex', marginRight: 10, height: 36 }}>
        <div style={{ flex: 1 }} />
        <Button size="small">
          <LanguageSharpIcon style={{ marginRight: 10 }} />
          {locale}
        </Button>
        <Button size="small" onClick={() => changeTheme(theme === "dark" ? "light" : "dark")}>
          {
            theme === "dark"
              ? <LightMode />
              : <DarkMode />
          }
        </Button>
        <Button>
          <SettingIcon />
        </Button>
      </div> */}
      <div style={{ display: 'flex', textAlign: 'center', height: '100vh' }}>
        <div style={{
          flex: 1, display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ height: 250 }}>
            <span style={{ fontSize: 120 }}>{room.name}</span>
          </div>
          <div style={{ height: 150 }}>
            {counter > 0 && <span style={{ fontSize: 72 }}>{`${Math.floor(counter / 60)}:${counter - Math.floor(counter / 60) * 60}`}</span>
            }          </div>
          <div style={{ height: 150 }}>
            {currentBooking.name && <span style={{ fontSize: 72 }}>{currentBooking.name}</span>}
          </div>
          <div>
            <div>
              {
                currentBooking?.checkinDates?.includes(moment().format("YYYY-MM-DD"))
                  ? <div style={{ height: 150 }}>
                    <span style={{ fontSize: 72 }}>Room In Use.</span>
                  </div>
                  :
                  bookingTimes.includes(getCurrentTimeIndex()) ?
                    <Button
                      className={classes.button}
                      variant="contained"
                      color="primary"
                      onClick={handleCheckIn}
                    >
                      Check In
                    </Button>
                    :
                    <Button
                      className={classes.button}
                      variant="contained"
                      color="primary"
                      onClick={handleOpenQuickBook}
                    >
                      Quick Book
                    </Button>
              }
            </div>
          </div>
          {/* <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            
            <Button style={{ width: 240, height: 120, fontSize: 80 }} variant="outlined" color="secondary">
              Secondary
            </Button>
          </div> */}
        </div>
        <div style={{
          width: 250,
          overflow: 'auto'
        }}>
          {
            allTimes.map(time => <h3
              style={{
                color:
                  bookingTimes.includes(time)
                    ? 'white'
                    : 'inherit',
                opacity:
                  moment(currentDate + " " + time + ":00").isBefore(moment(), "hour")
                    ? .4
                    : 1
              }}
              key={time}>
              {/* {currentDate + " " + time + ":00"} */}
              {`${time}:00 - ${time + 1}:00`}
            </h3>)
          }
        </div>
      </div>
    </div >)
}