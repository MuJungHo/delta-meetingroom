import React, { useContext, useCallback } from "react";
import { makeStyles } from '@material-ui/core/styles';

// import { useHistory } from "react-router-dom";
import { GlobalContext } from "../../contexts/GlobalContext";

import {
  TextField,
  Checkbox,
  Button,
  DialogContent,
  DialogActions,
  Text,
  IconButton
} from "../common";

import moment from "moment";
const scale = window.innerWidth / 1920;

const fontSize = 24 / scale

const useStyles = makeStyles({
  info: {
    display: 'flex',
    // width: '100%',
    alignItems: 'center',
    minHeight: 45,
    margin: `${20 / scale}px 0`,
    flex: 1,
    '& > *:first-child': {
      minWidth: '30%',
      marginRight: 20 /scale
    },
    '& > *:not(:first-child)': {
      flex: '1 1 auto'
    },
  },
  button: {
    padding: `${6 / scale}px ${16 / scale}px`,
    borderRadius: 8,
    '& > span': {
      fontSize,
    }
  },
})

export default ({
  onConfirm = () => { }
}) => {
  // console.log(room)
  const classes = useStyles();
  const { closeDialog, t, authedApi, openDialog } = useContext(GlobalContext);
  const [state, setState] = React.useState({
    name: "",
    account: "",
    password: ""
  })

  return (
    <>
      <DialogContent
        dividers
        style={{
          width: 800,
          padding: `0px ${20 / scale}px`
        }}>
        <div className={classes.info}>
          <Text style={{ fontSize }}>{t("name")}</Text>
          <TextField
            inputProps={{ style: { fontSize } }}
            value={state.name} onChange={e => setState({
              ...state,
              name: e.target.value
            })} />
        </div>
        <div className={classes.info}>
          <Text style={{ fontSize }}>{t("account")}</Text>
          <TextField
            inputProps={{ style: { fontSize } }}
            type="text" value={state.account} onChange={e => setState({
              ...state,
              account: e.target.value
            })} />
        </div>
        <div className={classes.info}>
          <Text style={{ fontSize }}>{t("password")}</Text>
          <TextField
            inputProps={{ style: { fontSize } }} type="password" value={state.password} onChange={e => setState({
              ...state,
              password: e.target.value
            })} />
        </div>
      </DialogContent >
      <DialogActions style={{ padding: `${20 / scale}px` }}>
        <Button className={classes.button} onClick={closeDialog}>
          {t("close")}
        </Button>
        <Button className={classes.button} variant="contained" color="primary" onClick={() => onConfirm(state)}>
          {t("confirm")}
        </Button>
      </DialogActions>
    </>
  )
}