import React, { useContext, useCallback } from "react";
// import { makeStyles } from '@material-ui/core/styles';

// import {
//   FormGroup,
//   RadioGroup
// } from '@material-ui/core';

// import { useHistory } from "react-router-dom";
import { GlobalContext } from "../../contexts/GlobalContext";
// import { AuthContext } from "../../contexts/AuthContext";

import {
  TextField,
  // Checkbox, Radio, 
  Button,
  DialogContent,
  DialogActions,
} from "../common";

const UserSection = ({
  room = {
    name: "",
  },
  onConfirm = () => { },
}) => {
  const [state, setState] = React.useState(room);
  const { closeDialog, t } = useContext(GlobalContext);
  

  return (
    <>
      <DialogContent
        dividers
        style={{
          width: 500
        }}>
        <TextField
          label={t("name")}
          type="text"
          fullWidth
          style={{ marginBottom: 20 }}
          value={state.name}
          onChange={e => setState({ ...state, name: e.target.value })}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog}>
          {t("cancel")}
        </Button>
        <Button color="primary" variant="contained" onClick={() => onConfirm(state)}>
          {t("confirm")}
        </Button>
      </DialogActions>
    </>)
}

export default UserSection