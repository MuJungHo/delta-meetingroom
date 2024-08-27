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

import {
  FormControl, InputLabel,
  Select,
  MenuItem
} from '@material-ui/core';

// const useStyles = makeStyles((theme) => ({
//   root: {
//     width: '100%',
//     padding: theme.spacing(3),
//     position: 'relative'
//   },
//   paper: {
//     width: '100%',
//     marginTop: theme.spacing(2),
//     marginBottom: theme.spacing(2),
//   },
//   actions: {
//     position: 'absolute',
//     left: 20,
//     bottom: 20,
//     '& svg': {
//       color: theme.palette.layout.color,
//     }
//   },
//   content: {
//     width: 700,
//     backgroundColor: theme.palette.dialog.background,
//     color: theme.palette.dialog.color,
//   },
//   info: {
//     display: 'flex',
//     width: '100%',
//     alignItems: 'center',
//     height: 45,
//     '& > *:first-child': {
//       flexBasis: '25%'
//     },
//     '& > *:not(:first-child)': {
//       flexBasis: '74%'
//     },
//   },
// }));

const UserSection = ({
  user = {
    roleid: "",
    email: "",
    name: "",
    password: "",
    telephone: "",
    department: "",
    products: "[]",
    productsParse: []
  },
  onConfirm = () => { },
}) => {
  const [state, setState] = React.useState(user);
  const { closeDialog, t, authedApi } = useContext(GlobalContext);
  const [products, setProducts] = React.useState([]);

  const getProductList = useCallback(async () => {
    const { result } = await authedApi.getProductList({
      data: {
      },
      limit: 50,
      page: 1
    })
    let _products = result.map(p => ({ ...p, _id: p.productid }))
    setProducts(_products)
  }, [])

  React.useEffect(() => {
    getProductList()
  }, [getProductList])

  return (
    <>
      <DialogContent
        dividers
        style={{
          width: 500
        }}>
        <TextField
          label={t("name")}
          required
          type="text"
          fullWidth
          style={{ marginBottom: 20 }}
          value={state.name}
          onChange={e => setState({ ...state, name: e.target.value })}
        />
        <TextField
          label={t("email")}
          required
          type="text"
          fullWidth
          style={{ marginBottom: 20 }}
          value={state.email}
          onChange={e => setState({ ...state, email: e.target.value })}
        />
        <TextField
          label={t("password")}
          type="password"
          fullWidth
          required
          style={{ marginBottom: 20 }}
          value={state.password}
          onChange={e => setState({ ...state, password: e.target.value })}
        />
        <FormControl
          fullWidth
          required
          style={{ marginBottom: 20 }}>
          <InputLabel>{t("role")}</InputLabel>
          <Select
            value={state.roleid}
            onChange={e => setState({ ...state, roleid: e.target.value })}
          >
            <MenuItem value={1}>Admin</MenuItem>
            <MenuItem value={2}>Operator</MenuItem>
            <MenuItem value={3}>User</MenuItem>
          </Select>
        </FormControl>
        <FormControl
          fullWidth
          style={{ marginBottom: 20 }}>
          <InputLabel>{t("product")}</InputLabel>
          <Select
            multiple
            value={state.productsParse || []}
            onChange={e => setState({
              ...state, productsParse: e.target.value,
              products: e.target.value
            })}
          >
            {
              products.map(p => <MenuItem key={p.productid} value={p.productid}>{p.name}</MenuItem>)
            }
          </Select>
        </FormControl>
        <TextField
          label={t("telephone")}
          type="text"
          fullWidth
          style={{ marginBottom: 20 }}
          value={state.telephone}
          onChange={e => setState({ ...state, telephone: e.target.value })}
        />
        <TextField
          label={t("department")}
          type="text"
          fullWidth
          style={{ marginBottom: 20 }}
          value={state.department}
          onChange={e => setState({ ...state, department: e.target.value })}
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