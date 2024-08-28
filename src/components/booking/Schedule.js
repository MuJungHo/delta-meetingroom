import React, { useContext } from "react";
import { makeStyles } from '@material-ui/core/styles';

// import { useHistory } from "react-router-dom";
import { GlobalContext } from "../../contexts/GlobalContext";

import {
  TextField, Button, Checkbox,
  DialogContent,
  DialogActions,
  Text
} from "../../components/common";

import {
  FormControl, InputLabel,
  FormControlLabel,
  Select,
  MenuItem
} from '@material-ui/core';

import moment from "moment";

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
  onConfirm = () => { },
  date = null
}) => {
  const classes = useStyles();
  const { closeDialog, t } = useContext(GlobalContext);

  const [state, setState] = React.useState({
    type: "once",
    month: [],
    week: [],
    starttime: moment(date).valueOf(),
    endtime: moment(date).endOf('day').valueOf(),
    interval: 1,
    staff: ""
  })

  const config = {
    "once": ["starttime", "endtime"],
    "daily": ["starttime", "endtime", "interval"],
    "weekly": ["starttime", "endtime", "interval", "week"],
    "monthly": ["starttime", "endtime", "month", "day"],
  }
  const TIMEFORMAT = 'YYYY-MM-DDTHH:mm';

  const weekdays = Array(7).fill("").map((_, i) => Number(i + 1))

  const months = Array(12).fill("").map((_, i) => Number(i + 1))

  const days = Array(31).fill("").map((_, i) => Number(i + 1))

  const handleCheckCheckbox = (checked, value, key) => {
    // console.log(state.trigger)
    let arr = state[key] || [];
    if (checked) {
      arr.push(value)
    } else {
      arr = arr.filter(a => a !== value)
    }

    setState({
      ...state,
      [key]: arr
    })
  }

  return (
    <>
      <DialogContent
        dividers
        style={{
          width: 700
        }}>
        <FormControl
          fullWidth
          required
          style={{ marginBottom: 20 }}>
          <InputLabel>{t("staff")}</InputLabel>
          <Select
            value={state.staff}
            displayEmpty
            onChange={e => setState({ ...state, staff: e.target.value })}
          >
            <MenuItem value="Chi">CHI</MenuItem>
            <MenuItem value="CW">CW</MenuItem>
            <MenuItem value="DUCK">DUCK</MenuItem>
            <MenuItem value="Roger">Roger</MenuItem>
            <MenuItem value="Ron">Ron</MenuItem>
          </Select>
        </FormControl>
        <FormControl
          fullWidth
          required
          style={{ marginBottom: 20 }}>
          <InputLabel>{t("type")}</InputLabel>
          <Select
            value={state.type}
            onChange={e => setState({ ...state, type: e.target.value })}
          >
            <MenuItem value="once">Once</MenuItem>
            <MenuItem value="daily">Daily</MenuItem>
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
          </Select>
        </FormControl>
        {config[state.type].includes("starttime") &&
          <div className={classes.info}>
            <Text>{t("starttime")}</Text>
            <TextField
              type="datetime-local"
              value={state.starttime ? moment(state.starttime).format(TIMEFORMAT) : ''}
              onChange={e => setState({
                ...state,
                starttime: moment(e.target.value).valueOf()
              })}
            />
          </div>}
        {config[state.type].includes("endtime") &&
          <div className={classes.info}>
            <Text>{t("endtime")}</Text>
            <TextField
              type="datetime-local"
              value={state.endtime ? moment(state.endtime).format(TIMEFORMAT) : ''}
              onChange={e => setState({
                ...state,
                endtime: moment(e.target.value).valueOf()
              })}
            />
          </div>}
        {config[state.type].includes("interval") &&
          <div className={classes.info}>
            <Text>{`${t("interval")} (${state.type === 'weekly' ? t("week") : t("day")})`}</Text>
            <TextField
              type="number"
              InputProps={{
                inputProps: {
                  min: 0
                }
              }}
              value={state.interval || ''}
              onChange={e => setState({
                ...state,
                interval: e.target.value
              })}
            />
          </div>}
        {config[state.type].includes("month") &&
          <div className={classes.info}>
            <Text>{t("month")}</Text>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {
                months.map(m => <FormControlLabel
                  key={m}
                  label={t(m)}
                  control={<Checkbox
                    color="primary"
                    checked={state.month?.includes(m)}
                    onChange={e => handleCheckCheckbox(e.target.checked, m, "month")}
                  />}
                />)
              }
            </div>
          </div>}
        {config[state.type].includes("day") &&
          <div className={classes.info}>
            <Text>{t("day")}</Text>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {
                days.map(d => <FormControlLabel
                  key={d}
                  label={t(d)}
                  control={<Checkbox
                    color="primary"
                    checked={state.day?.includes(d)}
                    onChange={e => handleCheckCheckbox(e.target.checked, d, "day")}
                  />}
                />)
              }
            </div>
          </div>}
        {config[state.type].includes("week") &&
          <div className={classes.info}>
            <Text>{t("week")}</Text>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {
                weekdays.map(w => <FormControlLabel
                  key={w}
                  label={t(w)}
                  control={<Checkbox
                    color="primary"
                    checked={state.week?.includes(w)}
                    onChange={e => handleCheckCheckbox(e.target.checked, w, "week")}
                  />}
                />)
              }
            </div>
          </div>}
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog}>
          {t("cancel")}
        </Button>
        <Button color="primary" variant="contained" onClick={() => onConfirm(state)}>
          {t("confirm")}
        </Button>
      </DialogActions>
    </>
  )
}