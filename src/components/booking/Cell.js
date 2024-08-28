import React, { useContext } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import moment from "moment";
import Schedule from "./Schedule";
import { GlobalContext } from "../../contexts/GlobalContext"

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

export default ({ date, index }) => {
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
      section: <Schedule date={date} onConfirm={handleSaveSchedule} />
    })
  }

  const handleSaveSchedule = () => {

  }

  return (
    <div className={classes.cell}
      onClick={handleOpenDialog}
    >
      {index < 7 && <p style={{ margin: '8px 0', color: '#70757a' }}>{weekday[index]}</p>}
      {
        isToday
          ? <Avatar className={classes.avatar}>{moment(date).format("D")}</Avatar>
          : <p style={{ color: 'rgb(60,64,67)', marginTop: 8 }}>{moment(date).format("D")}</p>
      }
    </div>
  )
}