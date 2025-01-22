import React, { useContext } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Cell from "./Cell";

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
    flex: '1 1 auto',
    height: 'calc(100% - 33px)',
  },
  spacer: {
    flex: 1
  }
})

export default ({
  dates = [],
  bookings = [],
  handleCreateBooking = () => { },
  handleUpdateBooking = () => { },
  handleDeleteBooking = () => { }
}) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      {
        dates
          .map((date, index) =>
            <Cell
              index={index}
              key={date}
              date={date}
              bookings={bookings}
              handleCreateBooking={handleCreateBooking}
              handleUpdateBooking={handleUpdateBooking}
              handleDeleteBooking={handleDeleteBooking}
            />)
      }
    </div>
  )
}