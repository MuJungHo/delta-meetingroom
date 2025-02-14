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
  onConfirm = () => { }
}) => {
  // console.log(room)
  const classes = useStyles();
  const { closeDialog, t, authedApi, openDialog } = useContext(GlobalContext);
  const [state, setState] = React.useState({
    account: "",
    password: ""
  })

  return (
    <>
      <DialogContent
        dividers
        style={{
          width: 500
        }}>
        <div className={classes.info}>
          <Text>{t("account")}</Text>
          <TextField type="text" value={state.account} onChange={e => setState({
            ...state,
            account: e.target.value
          })} />
        </div>
        <div className={classes.info}>
          <Text>{t("password")}</Text>
          <TextField type="password" value={state.password} onChange={e => setState({
            ...state,
            password: e.target.value
          })} />
        </div>
      </DialogContent >
      <DialogActions>
        <Button onClick={() => onConfirm(state)}>
          {t("預約")}
        </Button>
        <Button onClick={closeDialog}>
          {t("close")}
        </Button>
      </DialogActions>
    </>
  )
}