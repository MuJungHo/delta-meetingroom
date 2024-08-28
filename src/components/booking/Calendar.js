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
    height: 'calc(100% - 33px)'
  },
  spacer: {
    flex: 1
  }
})

export default ({
  year,
  month
}) => {
  const classes = useStyles();
  const currMonthFirstDay = new Date(year, month, 1).getDay();
  const currMonthDays = new Date(year, (month + 1), 0).getDate();
  const lastMonthDays = new Date(year, month, 0).getDate();
  const dates = [...Array(35).keys()].map(index => {
    if (index < currMonthFirstDay) {
      return `${year}/${month === 0 ? 12 : month}/${lastMonthDays - currMonthFirstDay + index + 1}`
    } else if (index > (currMonthDays + currMonthFirstDay - 1)) {
      return `${year}/${(month + 2) === 13 ? 1 : (month + 2)}/${index - currMonthDays - currMonthFirstDay + 1}`
    } else {
      return `${year}/${(month + 1)}/${index - currMonthFirstDay + 1}`
    }
  })
  return (
    <div className={classes.container}>
      {
        dates
          .map((date, index) =>
            <Cell
              index={index}
              key={date}
              date={date}
            />)
      }
    </div>
  )
}