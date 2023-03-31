import { ReactComponent as AvatarPlusSVG } from 'assets/avatar_plus.svg';
import { ReactComponent as CloseSVG } from 'assets/close.svg';
import { AxiosError } from 'axios';
import { Button } from 'components/UI/Button/Button';
import { Input } from 'components/UI/Input/Input';
import { InputPassword } from 'components/UI/InputPassword/InputPassword';
import { Loader } from 'components/UI/Loader/Loader';
import { ErrorMessage, Form, Formik } from 'formik';
import { ChangeEvent, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { onRegister } from 'redux/slices/auth';
import { uploadFile } from 'redux/slices/files';
import 'scss/all.scss';
import { IRegisterRequest } from 'types/IRegisterRequest';
import * as Yup from 'yup';

const initialValues = {
  fullName: '',
  email: '',
  password: '',
  avatarUrl: '',
};

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

  const { authStatus, fileUploadStatus } = useAppSelector(
    ({ auth, files }) => ({
      authStatus: auth.status,
      fileUploadStatus: files.status,
    }),
  );

  const fileRef = useRef<HTMLInputElement>(null);

  const [serverError, setServerError] = useState('');

  const onRegisterSubmit = async (values: IRegisterRequest) => {
    try {
      const resp = await dispatch(onRegister(values)).unwrap();

      if (resp?.token) {
        window.localStorage.setItem('token', resp.token);
        navigate('/');
      }
    } catch (error: any) {
      setServerError(error.message);
    }
  };

  const onUploadAvatar = async (
    e: ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, val: any) => void,
  ) => {
    try {
      const file = e.target.files?.[0];
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('isRegistering', true.toString());
  
        const data = await dispatch(uploadFile(formData)).unwrap()
        if(data) {
          setFieldValue('avatarUrl', data.url);
          setServerError('')
        };
      }
    } catch (error: any) {
      setServerError(error.message)
    }
  };

  return (
    <div className="auth">
      <div className="auth__content">
        <h1>Create an account</h1>
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
            return (
              <Form onSubmit={handleSubmit}>
                <div className="auth__avatar">
                  {fileUploadStatus === 'loading' ? (
                    <Loader className="loader_big" />
                  ) : values.avatarUrl ? (
                    <div className="auth__avatar__image">
                      <CloseSVG
                        onClick={() => setFieldValue('avatarUrl', '')}
                      />
                      <img src={values.avatarUrl} alt="avatar" />
                    </div>
                  ) : (
                    <div
                      className="auth__avatar__default"
                      onClick={() => fileRef.current?.click()}
                    >
                      <AvatarPlusSVG />
                      Add photo
                    </div>
                  )}
                  <input
                    ref={fileRef}
                    type="file"
                    key={values.avatarUrl}
                    name="avatarUrl"
                    onChange={(e) => onUploadAvatar(e, setFieldValue)}
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
                  <InputPassword
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
                {serverError && (
                  <div className="input input_error">{serverError}</div>
                )}
                {authStatus === 'loading' ? (
                  <div className="loader_center">
                    <Loader className="loader_mini" />
                  </div>
                ) : (
                  <Button
                    text="Sign up"
                    className="button button_colored"
                    style={{ width: '100%' }}
                    disabled={!isValid || isSubmitting}
                  />
                )}
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};
