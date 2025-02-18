import React, { useState, createContext, useContext } from 'react';
import { ThemeProvider } from '@material-ui/styles';
import { createTheme } from '@material-ui/core/styles';
import { CustomProvider } from 'rsuite';
import { AuthContext } from './AuthContext';
import Alert from '@material-ui/lab/Alert';
import {
  Snackbar,
  Dialog,
  DialogTitle,
  // DialogContent,
  // DialogActions,
  IconButton,
  Typography,
  // Button
  // DialogContentText
} from '@material-ui/core'

import Close from '@material-ui/icons/Close';

import { lighten_palette, dark_palette } from "../customTheme";

import i18n from '../i18n';
// import { api } from '../utils/apis';
import WarningSection from '../components/WarningSection';
import { api } from "../utils/apis";
import "../style/normalize.css";
import 'rsuite/dist/rsuite.min.css';

const light = createTheme({
  dark: false,
  palette: lighten_palette
})

const dark = createTheme({
  dark: true,
  palette: dark_palette
})

const GlobalContext = createContext();

function GlobalProvider({ children, ...rest }) {
  const { logout, token } = useContext(AuthContext);
  const [locale, setLocale] = useState(localStorage.getItem('locale') || 'zh-TW');
  const [theme, setTheme] = useState(localStorage.getItem("theme"));
  const [snackBar, setSnackBar] = useState({
    open: false,
    severity: 'info',
    message: ''
  })

  const [dialog, setDialog] = useState({
    title: "",
    open: false,
    warning: false,
    section: <></>
  })
  // console.log(dialog)

  const dialogStyle = theme === "dark" ? dark_palette.paper : lighten_palette.paper

  const changeTheme = (theme) => {
    setTheme(theme);
    localStorage.setItem('theme', theme)
  };

  const changeLocale = (locale) => {
    setLocale(locale);
    localStorage.setItem('locale', locale)
  };

  const openWarningDialog = ({
    title = "",
    message = "",
    onConfirm = () => { }
  }) => {
    setDialog({
      title,
      open: true,
      warning: true,
      section: <WarningSection message={message} onConfirm={onConfirm} />
    })
  }

  const openDialog = (_dialog) => {
    setDialog({
      open: true,
      ..._dialog
    })
  }

  const closeDialog = () => {
    setDialog({
      title: "",
      open: false,
      warning: false,
      section: <></>
    })
  }

  const openSnackbar = (_snackbar) => {
    setSnackBar({
      open: true,
      ..._snackbar
    })
  }

  const openCatchErrorSnackbar = (message) => {
    setSnackBar({
      open: true,

      severity: "error",

      message: i18n(locale)(message)
    })
  }

  const value = {
    locale,
    t: i18n(locale),
    changeLocale,
    changeTheme,
    openDialog,
    openWarningDialog,
    closeDialog,
    openSnackbar,
    theme,
    authedApi: api(logout)
  };

  return <GlobalContext.Provider
    value={value}
    {...rest}
  >
    <CustomProvider theme={theme}>
      <ThemeProvider theme={theme === "dark" ? dark : light}>
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          open={snackBar.open}
          autoHideDuration={3000}
          onClose={() => setSnackBar({
            ...snackBar,
            open: false,
          })}>
          <Alert
            elevation={6}
            variant="filled"
            onClose={() => setSnackBar({
              ...snackBar,
              open: false,
            })} severity={snackBar.severity}>
            {snackBar.message}
          </Alert>
        </Snackbar>
        <Dialog
          // {...dialog}
          // title=""
          // warning=""
          maxWidth={dialog.maxWidth}
          onClose={() => setDialog({ ...dialog, open: false })}
          open={dialog.open}
        >
          {dialog.title && <DialogTitle
            disableTypography
            style={{
              backgroundColor: dialogStyle.background,
              color: dialogStyle.color
            }}
          >
            <span style={{
              fontSize: dialog.titleFontSize || 16
            }}>{dialog.title}</span>
            <IconButton style={{
              color: dialogStyle.color,
              position: 'absolute',
              right: 8,
              top: 8,
            }} onClick={() => setDialog({ ...dialog, open: false })}>
              <Close style={{
                fontSize: dialog.titleFontSize || 21
              }} />
            </IconButton>
          </DialogTitle>}
          {dialog.section}
        </Dialog>
        {children}
      </ThemeProvider>
    </CustomProvider>
  </GlobalContext.Provider >;
}

export { GlobalContext, GlobalProvider };