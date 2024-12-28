import React, { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { GlobalContext } from "../contexts/GlobalContext";
import { Redirect } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import {
  TextField,
  FormControl,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Button,
  Card
} from '@material-ui/core';
import { ReactComponent as Logo } from '../images/delta.svg';

const useStyles = makeStyles(() => ({
  container: {
    height: '100vh',
    backgroundImage: 'radial-gradient(circle at 48% 33%, #0f72a4, #1d3654 96%)',
    opacity: 0.88,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  card: {
    height: 520,
    width: 420,
    // ['@media (max-width: 450px)']: {
    //   height: 470,
    //   width: 340,
    // },
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: 24

  },
  title: {
    marginBottom: 20,
    textAlign: 'center'
  },
  logo: {
    marginBottom: 20,
    height: 30,
  },
  submit: {
    height: 50
  },
  spacer: {
    flex: '1 1 auto'
  },
  user: {
  },
  password: {
  },
  locale: {
  }
}))

const Login = () => {
  const classes = useStyles();
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");

  const { login, token, setKeep, keep, } = useContext(AuthContext);
  const { t, changeLocale, locale, authedApi } = useContext(GlobalContext);

  if (token) {
    return <Redirect to="/" />
  }

  const handleChagneLocale = (e) => {
    changeLocale(e.target.value)
  }

  const handleLogin = async (event) => {
    event.preventDefault();

    const { token } = await authedApi.postAuthLogin({ data: { account, password } });

    login(token);
  }

  return (
    <div className={classes.container}>
      <Card className={classes.card}>
        <form className={classes.form} noValidate onSubmit={handleLogin}>
          <h1 className={classes.title}>{t('welcome')}</h1>
          <Logo style={{
            height: 40,
            margin: '0 auto 24px auto',
          }} />

          <FormControl>
            <TextField
              className={classes.user}
              variant="outlined"
              required
              fullWidth
              value={account}
              onChange={e => setAccount(e.target.value)}
              label={t("account")}
              style={{ marginBottom: 20 }}
            />
          </FormControl>
          <FormControl>
            <TextField
              className={classes.password}
              variant="outlined"
              required
              fullWidth
              value={password}
              onChange={e => setPassword(e.target.value)}
              name="password"
              label={t("password")}
              type="password"
              autoComplete="current-password"
            />
          </FormControl>
          <FormControlLabel
            value="end"
            style={{ marginBottom: 10 }}
            control={<Checkbox color="primary" value={keep} onChange={e => {
              setKeep(e.target.checked)
            }} />}
            label={t("keep-me")}
            labelPlacement="end"
          />
          <FormControl variant="outlined" fullWidth>
            <Select
              className={classes.locale}
              value={locale}
              onChange={handleChagneLocale}
              displayEmpty
            >
              <MenuItem value={'en'}>English</MenuItem>
              <MenuItem value={'zh-TW'}>繁體中文</MenuItem>
            </Select>
          </FormControl>
          <div className={classes.spacer}></div>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            {t('login')}
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default Login;