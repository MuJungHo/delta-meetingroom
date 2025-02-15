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

const useStyles = makeStyles({
  info: {
    display: 'flex',
    // width: '100%',
    alignItems: 'center',
    minHeight: 45,
    margin: '36px 0',
    flex: 1,
    '& > *:first-child': {
      minWidth: '30%',
      marginRight: 20
    },
    '& > *:not(:first-child)': {
      flex: '1 1 auto'
    },
  },
  button: {
    // padding: 24,
    borderRadius: 8,
    '& > span': {
      fontSize: 36,
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

  const fontSize = 48

  return (
    <>
      <DialogContent
        dividers
        style={{
          width: 800,
          padding: '0px 36px'
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
      <DialogActions style={{ padding: '18px 36px' }}>
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