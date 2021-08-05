import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Home from './components/Home';
import LoginForm from './components/auth/LoginForm';
// import SignupForm from './components/auth/SignupForm';
import Profile from './components/Profile';
import SampleDrawing from './components/SampleDrawing';
import PageNotFound from './components/PageNotFound';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { authenticate } from './store/session';

// \/
import { useSelector } from 'react-redux'
import { Redirect, useHistory, NavLink } from 'react-router-dom';
import { signUp } from '../src/store/session';
import styles from './App.module.css';
// /\

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();
  
  // \/
  const [errors, setErrors] = useState([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  const onSignUp = async (e) => {
    e.preventDefault();
    if (password === repeatPassword) {
      const data = await dispatch(signUp(username, email, password));
      if (data) {
        setErrors(data)
      }
    }
  };
  // /\

  useEffect(() => {
    (async() => {
      await dispatch(authenticate());
      setLoaded(true);
    })();
  }, [dispatch]);

  if (!loaded) {
    return null;
  }

  return (
    <BrowserRouter>
      <NavBar />
      <Switch>
        <Route path='/' exact={true} >
          <Home />
        </Route>
        <Route path='/login' exact={true}>
          <LoginForm />
        </Route>
        <Route path='/signup' exact={true}>
          {/* <SignupForm /> */}
          {/* \/ */}
          <div className={styles.signupForm}>
            <h1>put logo here</h1>
            <form onSubmit={onSignUp}>
              <div className={styles.signupForm__errors}>
                {errors.map((error, ind) => (
                  <div key={ind}>{error}</div>
                ))}
              </div>
              <div>
                <label>Username</label>
                <input
                  type='text'
                  name='username'
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                ></input>
              </div>
              <div>
                <label>Email</label>
                <input
                  type='text'
                  name='email'
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                ></input>
              </div>
              <div>
                <label>Password</label>
                <input
                  type='password'
                  name='password'
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                ></input>
              </div>
              <div>
                <label>Confirm password</label>
                <input
                  type='password'
                  name='repeat_password'
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  value={repeatPassword}
                  required={true}
                ></input>
              </div>
              <button className={styles.signupButton} type='submit'>Sign up</button>
            </form>
            <div>
              Already have an account?
              <NavLink className={styles.loginButton} to='/login'>Log in</NavLink>
              {/* <button type='button' onClick={() => history.push('/login')}>Log in</button> */}
            </div>
          </div>
          {/* /\ */}
        </Route>
        <ProtectedRoute path='/profile' exact={true}>
          <Profile />
        </ProtectedRoute>
        <ProtectedRoute path='/drawing' exact={true}>
          <SampleDrawing />
        </ProtectedRoute>
        <Route>
          <PageNotFound />
        </Route>
      </Switch>
      <Footer />
    </BrowserRouter>
  );
}
