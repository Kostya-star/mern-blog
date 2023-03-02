import { ReactComponent as AvatarPlusSVG } from 'assets/avatar_plus.svg';
import { Button } from 'components/UI/Button/Button';
import { Input } from 'components/UI/Input/Input';
import { ErrorMessage, Form, Formik } from 'formik';
import { ChangeEvent, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { onRegisterThunk } from 'redux/slices/auth';
import { uploadUserPhoto } from 'redux/slices/image';
import 'scss/all.scss';
import { IRegisterRequest } from 'types/IRegisterRequest';
import * as Yup from 'yup';
import { useAppDispatch } from './../redux/hooks';

type setFieldValue = (fieldName: string, val: string) => void;

const initialValues = { fullName: '', email: '', password: '', avatarUrl: '' };

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

  const fileRef = useRef<HTMLInputElement>(null);

  const onRegisterSubmit = async (values: IRegisterRequest) => {
    try {
      const resp = await dispatch(onRegisterThunk(values)).unwrap();

      if (resp.token) {
        window.localStorage.setItem('token', resp.token);
        navigate('/');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onUploadUserPhoto = async (
    e: ChangeEvent<HTMLInputElement>,
    setFieldValue: setFieldValue,
  ) => {
    const photo = e.target.files?.[0];

    if (photo) {
      const formData = new FormData();
      formData.append('image', photo);
      const { url } = await dispatch(uploadUserPhoto(formData)).unwrap();
      setFieldValue('avatarUrl', url);
    }
  };

  return (
    <div className="auth">
      <div className="auth__content">
        <h1>Create an account</h1>
        {/* <div className="auth__avatar" onClick={() => fileRef.current?.click()}>
          <AvatarPlusSVG />
          Add photo
          <input ref={fileRef} type="file" hidden/>
        </div> */}
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
            setFieldValue,
            isSubmitting,
          }) => {
            console.log(values);

            return (
              <Form onSubmit={handleSubmit}>
                <div
                  className="auth__avatar"
                  onClick={() => fileRef.current?.click()}
                >
                  {values.avatarUrl ? (
                    <img src={`http://localhost:5000${values.avatarUrl}`} alt="avatar" />
                  ) : (
                    <AvatarPlusSVG />
                  )}
                  Add photo
                  <input
                    ref={fileRef}
                    type="file"
                    name="avatarUrl"
                    onChange={(e) => onUploadUserPhoto(e, setFieldValue)}
                    // onBlur={handleBlur}
                    hidden
                  />
                </div>
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
            );
          }}
        </Formik>
      </div>
    </div>
  );
};
