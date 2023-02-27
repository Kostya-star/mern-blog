import React from 'react';
import 'scss/all.scss';
import { ReactComponent as AvatarSVG } from 'assets/avatar.svg';
import { Input } from 'components/UI/Input/Input';
import { Button } from 'components/UI/Button/Button';
import { ErrorMessage, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch } from './../redux/hooks';
import { onRegisterThunk } from 'redux/slices/auth';
import { IRegisterRequest } from 'types/IRegisterRequest';
import { useNavigate } from 'react-router-dom';

const initialValues = { fullName: '', email: '', password: '' };

const validationSchema = Yup.object({
  fullName: Yup.string()
    .min(2, 'Must be at least 2 characters')
    .required('Required'),
  email: Yup.string().email('Invalid email address').required('Required'),
  password: Yup.string()
    .min(6, 'Must be at least 6 characters')
    .required('Required'),
});

export const Register = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onRegisterSubmit = async (values: IRegisterRequest) => {
    const resp = await dispatch(onRegisterThunk(values)).unwrap();

    if (resp.token) {
      window.localStorage.setItem('token', resp.token);
      navigate('/');
    }
  };

  return (
    <div className="auth">
      <div className="auth__content">
        <h1>Create an account</h1>
        <AvatarSVG />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onRegisterSubmit}
        >
          {({
            values,
            isValid,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          }) => (
            <Form onSubmit={handleSubmit}>
              <div className="input">
                <Input
                  type="text"
                  name="fullName"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.fullName}
                  placeholder="Name"
                />
                <ErrorMessage
                  name="fullName"
                  component="span"
                  className="input_error"
                />
              </div>
              <div className="input">
                <Input
                  type="email"
                  name="email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                  placeholder="E-mail"
                />
                <ErrorMessage
                  name="email"
                  component="span"
                  className="input_error"
                />
              </div>
              <div className="input">
                <Input
                  type="password"
                  name="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                  placeholder="Password"
                />
                <ErrorMessage
                  name="password"
                  component="span"
                  className="input_error"
                />
              </div>
              <Button
                text="Sign up"
                className="button button_colored"
                style={{ width: '100%' }}
                disabled={!isValid || isSubmitting}
              />
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
