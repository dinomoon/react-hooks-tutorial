import React, { useEffect, useReducer, useState } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import { useContext } from 'react/cjs/react.development';
import AuthContext from '../../store/auth-context';
import Input from '../UI/Input/Input';

const emailReducer = (state, action) => {
  switch (action.type) {
    case 'USER_INPUT':
      return { value: action.value, isValid: action.value.includes('@') };
    case 'USER_VALID':
      return { value: state.value, isValid: state.value.includes('@') };
    default:
      return state;
  }
};

const passwordReducer = (state, action) => {
  switch (action.type) {
    case 'USER_INPUT':
      return { value: action.value, isValid: action.value.trim().length > 6 };
    case 'USER_VALID':
      return { value: state.value, isValid: state.value.trim().length > 6 };
    default:
      return state;
  }
};

const Login = () => {
  const authContext = useContext(AuthContext);
  const [formIsValid, setFormIsValid] = useState(false);
  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: '',
    isValid: null,
  });
  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: '',
    isValid: null,
  });

  const { isValid: emailValid } = emailState;
  const { isValid: passwordValid } = passwordState;

  useEffect(() => {
    const identifier = setTimeout(() => {
      setFormIsValid(emailValid && passwordValid);
    }, 500);

    return () => {
      clearTimeout(identifier);
    };
  }, [emailValid, passwordValid]);

  const emailChangeHandler = (event) => {
    dispatchEmail({ type: 'USER_INPUT', value: event.target.value });
  };

  const passwordChangeHandler = (event) => {
    dispatchPassword({ type: 'USER_INPUT', value: event.target.value });
  };

  const validateEmailHandler = () => {
    dispatchEmail({ type: 'USER_VALID' });
  };

  const validatePasswordHandler = () => {
    dispatchPassword({ type: 'USER_VALID' });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    authContext.onLogin(emailState.value, passwordState.value);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input
          type='email'
          id='email'
          label='E-Mail'
          value={emailState.value}
          isValid={emailValid}
          onChange={emailChangeHandler}
          onBlur={validateEmailHandler}
        />
        <Input
          for='password'
          type='password'
          label='Password'
          value={passwordState.value}
          isValid={passwordValid}
          onChange={passwordChangeHandler}
          onBlur={validatePasswordHandler}
        />
        <div className={classes.actions}>
          <Button type='submit' className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
