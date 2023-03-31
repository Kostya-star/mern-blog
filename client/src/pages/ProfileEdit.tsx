import { ReactComponent as ArrowLeftSVG } from 'assets/arrow-left.svg';
import { Avatar } from 'components/Avatar/Avatar';
import { Button } from 'components/UI/Button/Button';
import { Input } from 'components/UI/Input/Input';
import { InputPassword } from 'components/UI/InputPassword/InputPassword';
import { Loader } from 'components/UI/Loader/Loader';
import { ErrorMessage, Form, Formik } from 'formik';
import { ChangeEvent, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from 'redux/hooks';
import { updateUser } from 'redux/slices/auth';
import { uploadFile } from 'redux/slices/files';
import * as Yup from 'yup';
import { useAppDispatch } from './../redux/hooks';

interface IUserUpdatedValues {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  avatarUrl: string;
  isPassword: boolean;
}

const validationSchema = Yup.object().shape({
  isPassword: Yup.boolean(),
  fullName: Yup.string()
    .min(2, 'Must be at least 2 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Must contain only letters')
    .required('Required'),
  email: Yup.string().email('Invalid email address').required('Required'),
  password: Yup.string().when('isPassword', ([isPassword], _) => {
    return isPassword
      ? Yup.string()
          .min(6, 'Must be at least 6 characters')
          .required('Required')
      : Yup.string().min(0);
  }),
  confirmPassword: Yup.string().when('isPassword', ([isPassword], _) => {
    return isPassword
      ? Yup.string()
          .oneOf([Yup.ref('password')], 'Passwords must match')
          .required('Required')
      : Yup.string().min(0);
  }),
});

export const ProfileEdit = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { currentUser, imageUploadStatus, authStatus } = useAppSelector(
    ({ auth, files }) => ({
      currentUser: auth.data,
      imageUploadStatus: files.status,
      authStatus: auth.status,
    }),
  );

  const initialValues = {
    fullName: currentUser?.fullName,
    email: currentUser?.email,
    password: '',
    confirmPassword: '',
    avatarUrl: currentUser?.avatarUrl,
    isPassword: false,
  };

  const inputFileRef = useRef<HTMLInputElement>(null);

  const [serverError, setServerError] = useState({
    formError: '',
    imageError: '',
  });

  const onUpdateUserProfile = async (values: IUserUpdatedValues) => {
    try {
      const resp = await dispatch(updateUser(values)).unwrap();

      if (resp) {
        setServerError({ formError: '', imageError: '' });
        alert('Profile is successfully updated!');
      }
    } catch (error: any) {
      setServerError({ ...serverError, formError: error.message });
    }
  };

  const onUploadImage = async (
    event: ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, val: any) => void,
  ) => {
    event.preventDefault();

    try {
      const file = event.target?.files?.[0];

      if (file) {
        const formData = new FormData();
        formData.append('file', file);

        const data = await dispatch(uploadFile(formData)).unwrap();
        if (data) {
          setFieldValue('avatarUrl', data.url);
          setServerError({ ...serverError, imageError: '' });
        }
      }
    } catch (error: any) {
      setServerError({ ...serverError, imageError: error.message });
    }
  };

  const onDeleteImage = (
    e: MouseEvent,
    setFieldValue: (field: string, val: any) => void,
  ) => {
    e.preventDefault();
    setFieldValue('avatarUrl', '');
    setServerError({ ...serverError, imageError: '' });
  };

  return (
    <div className="profileEdit">
      <div className="profileEdit__buttonBack">
        <Button
          text="Go Back"
          className="button button_cancel"
          onClick={() => navigate(-1)}
        >
          <ArrowLeftSVG />
        </Button>
      </div>
      <div className="profileEdit__content">
        {/* <h2 className="profileEdit__top">Edit profile</h2> */}
        <Formik
          initialValues={initialValues as unknown as IUserUpdatedValues}
          validationSchema={validationSchema}
          onSubmit={onUpdateUserProfile}
          enableReinitialize
          // validateOnMount
        >
          {({
            values,
            isValid,
            dirty,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            isSubmitting,
          }) => {
            // console.log(values);
            return (
              <Form onSubmit={handleSubmit}>
                <div className="profileEdit__form">
                  <div className="profileEdit__form__image">
                    {imageUploadStatus === 'loading' ? (
                      <Loader className="loader_big" />
                    ) : (
                      <Avatar avatar={values.avatarUrl} />
                    )}
                    {serverError.imageError && (
                      <div className="input_error">
                        {serverError.imageError}
                      </div>
                    )}

                    <Button
                      text="Change photo"
                      className="button button_transparent"
                      onClick={(e) => {
                        e.preventDefault();
                        inputFileRef.current?.click();
                      }}
                    />
                    <Button
                      text="Delete photo"
                      className="button button_delete"
                      onClick={(e) => onDeleteImage(e as any, setFieldValue)}
                    />
                    <input
                      ref={inputFileRef}
                      type="file"
                      onChange={(e) => onUploadImage(e, setFieldValue)}
                      hidden
                    />
                  </div>

                  <div className="profileEdit__form__fields">
                    <label htmlFor="fullName" className="input">
                      Full name
                      <Input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={values.fullName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <ErrorMessage
                        name="fullName"
                        component="span"
                        className="input_error"
                      />
                    </label>
                    <label htmlFor="email" className="input">
                      Email
                      <Input
                        type="email"
                        id="email"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <ErrorMessage
                        name="email"
                        component="span"
                        className="input_error"
                      />
                    </label>

                    {values.isPassword && (
                      <>
                        <label htmlFor="password" className="input">
                          New password
                          <InputPassword
                            id="password"
                            name="password"
                            value={!values.isPassword ? '' : values.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          <ErrorMessage
                            name="password"
                            component="span"
                            className="input_error"
                          />
                        </label>

                        <label htmlFor="confirmPassword" className="input">
                          Confirm password
                          <InputPassword
                            id="confirmPassword"
                            name="confirmPassword"
                            value={
                              !values.isPassword ? '' : values.confirmPassword
                            }
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          <ErrorMessage
                            name="confirmPassword"
                            component="span"
                            className="input_error"
                          />
                        </label>
                      </>
                    )}
                    <label
                      htmlFor="isPassword"
                      className="profileEdit__form__checkbox"
                    >
                      <span>Change password?</span>
                      <Input
                        type="checkbox"
                        id="isPassword"
                        name="isPassword"
                        onBlur={handleBlur}
                        // onChange={handleChange}
                        onChange={(e) => {
                          if (!e.target.checked) {
                            setFieldValue('password', '');
                            setFieldValue('confirmPassword', '');
                          }
                          handleChange(e);
                        }}
                        checked={values.isPassword}
                      />
                    </label>

                    {serverError.formError && (
                      <div className="input input_error">
                        {serverError.formError}
                      </div>
                    )}

                    {authStatus === 'loading' ? (
                      <Loader className="loader_mini" />
                    ) : (
                      <Button
                        type="submit"
                        text="Save changes"
                        className={`button ${
                          isValid && dirty
                            ? 'button_colored'
                            : 'button_disabled'
                        }`}
                        disabled={!(isValid && dirty)}
                        // disabled={!isValid || !dirty}
                      />
                    )}
                  </div>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};
