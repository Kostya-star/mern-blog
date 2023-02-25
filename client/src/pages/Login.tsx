import { Button } from 'components/UI/Button/Button';
import { Input } from 'components/UI/Input/Input';
import { ErrorMessage, Formik, FormikHelpers } from 'formik';
import { useNavigate } from 'react-router-dom';
import { onLoginThunk, isAuthSelector } from 'redux/slices/auth';
import { ILoginRequest } from 'types/ILoginRequest';
import { IUser } from 'types/IUser';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from './../redux/hooks';

const initialValues = { email: '', password: '' };

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Required'),
  password: Yup.string()
    .min(6, 'Must be at least 6 characters')
    .required('Required'),
});

export const Login = () => {
  const navigate = useNavigate()

  const dispatch = useAppDispatch();
  const isAuth = useAppSelector(isAuthSelector)

  // costya@mail.ru
  // test123
  const onLoginSubmit = async (
    values: ILoginRequest,
    actions: FormikHelpers<ILoginRequest>,
  ) => {
    const resp = await dispatch(onLoginThunk(values)).unwrap();

    if(resp.token) {
      window.localStorage.setItem('token', resp.token)
      navigate('/')
    }

    // actions.setSubmitting(true)
  };

  return (
    <div className="auth">
      <div className="auth__content">
        <h1>Log into your account</h1>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onLoginSubmit}
        >
          {({
            values,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          }) => (
            <form onSubmit={handleSubmit}>
              <div className="input">
                <Input
                  type="email"
                  name="email"
                  placeholder="E-mail"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
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
                  placeholder="Password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                />
                <ErrorMessage
                  name="password"
                  component="span"
                  className="input_error"
                />
              </div>

              <Button
                text="Sign in"
                className="button button_colored"
                style={{ width: '100%' }}
                disabled={isSubmitting}
              />
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};
