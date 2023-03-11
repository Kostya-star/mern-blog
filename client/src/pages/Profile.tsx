import { ReactComponent as AvatarDefaultSVG } from 'assets/avatar.svg';
import { Avatar } from 'components/Avatar/Avatar';
import { Button } from 'components/UI/Button/Button';
import { Input } from 'components/UI/Input/Input';
import { ErrorMessage, Form, Formik } from 'formik';
import { ChangeEvent, useRef, useState } from 'react';
import { useAppSelector } from 'redux/hooks';
import { updateUser } from 'redux/slices/auth';
import { base64ToFile } from 'utils/base64ToFile';
import * as Yup from 'yup';
import { useAppDispatch } from './../redux/hooks';

const profileSections = ['About profile', 'Edit profile'];

const validationSchema = Yup.object().shape({
  isPassword: Yup.boolean(),
  fullName: Yup.string()
    .min(2, 'Must be at least 2 characters')
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

interface IUserUpdatedValues {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  avatarUrl: File;
  isPassword: boolean;
}

export const Profile = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(({ auth }) => auth.data);

  const [image, setImage] = useState<File | null>(
    user?.avatarUrl ? (base64ToFile(user.avatarUrl) as File) : null,
  );

  // const userPhoto = user?.avatarUrl ? base64ToFile(user?.avatarUrl) : '';

  const initialValues = {
    fullName: user?.fullName,
    email: user?.email,
    password: '',
    confirmPassword: '',
    avatarUrl: 0,
    isPassword: false,
  };

  const [activeSection, setActiveSection] = useState(0);

  const inputFileRef = useRef<HTMLInputElement>(null);

  const aboutSection = profileSections[activeSection] === 'About profile';
  const editSection = profileSections[activeSection] === 'Edit profile';

  const accountCreationDate = new Date(
    user?.createdAt as string,
  ).toLocaleDateString();

  const onUpdateUserProfile = (values: IUserUpdatedValues) => {
    const { fullName, email, password } = values;

    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('image', image || '');

    dispatch(updateUser(formData));
  };

  const onUploadImage = (
    event: ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, val: any) => void,
  ) => {
    event.preventDefault();

    const file = event.target?.files?.[0];
    if (file) {
      setImage(file);
      setFieldValue('avatarUrl', null);
    }
  };

  const onDeleteImage = (
    e: MouseEvent,
    setFieldValue: (field: string, val: any) => void,
  ) => {
    e.preventDefault();
    setFieldValue('avatarUrl', '');
    setImage(null);
    // dispatch(deletePhoto())
  };

  return (
    <div className="profile">
      <div className="profile__content">
        <div className="profile__content__header">
          {profileSections.map((section, ind) => (
            <h2
              key={ind}
              className={activeSection === ind ? 'section_active' : ''}
              onClick={() => setActiveSection(ind)}
            >
              {section}
            </h2>
          ))}
        </div>
        <div className="profile__content__body">
          {aboutSection && (
            <>
              <div className="profile__content__body__image">
                <Avatar avatar={user?.avatarUrl as string} />
              </div>
              <div className="profile__content__body__info">
                <div>Name: {user?.fullName}</div>
                <div>Email: {user?.email}</div>
                <div>Created: {accountCreationDate}</div>
                <div>Posts created: {user?.postsCreated}</div>
              </div>
            </>
          )}
          {editSection && (
            <Formik
              initialValues={initialValues as unknown as IUserUpdatedValues}
              validationSchema={validationSchema}
              onSubmit={onUpdateUserProfile}
              // enableReinitialize
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
                // console.log(touched);
                // console.log(dirty);
                // console.log(values);
                return (
                  <>
                    <Form onSubmit={handleSubmit}>
                      <div className="profile__content__form">
                        <div className="profile__content__body__image">
                          {image && (
                            <img
                              src={URL.createObjectURL(image as File)}
                              alt="avatar"
                            />
                          )}
                          {!image && (
                            // <Avatar avatar={user?.avatarUrl as string} />
                            <AvatarDefaultSVG />
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
                            onClick={(e) =>
                              onDeleteImage(e as any, setFieldValue)
                            }
                          />
                          <input
                            ref={inputFileRef}
                            type="file"
                            onChange={(e) => onUploadImage(e, setFieldValue)}
                            hidden
                          />
                        </div>

                        <div className="profile__content__form__fields">
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
                                <Input
                                  type="password"
                                  id="password"
                                  name="password"
                                  value={
                                    !values.isPassword ? '' : values.password
                                  }
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                />
                                <ErrorMessage
                                  name="password"
                                  component="span"
                                  className="input_error"
                                />
                              </label>

                              <label
                                htmlFor="confirmPassword"
                                className="input"
                              >
                                Confirm password
                                <Input
                                  type="password"
                                  id="confirmPassword"
                                  name="confirmPassword"
                                  value={
                                    !values.isPassword
                                      ? ''
                                      : values.confirmPassword
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
                            className="input checkbox"
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

                          <Button
                            type="submit"
                            text="Save changes"
                            className={`button ${
                              isValid && dirty
                                ? 'button_colored'
                                : 'button_disabled'
                            }`}
                            disabled={!(isValid && dirty)}
                          />
                        </div>
                      </div>
                    </Form>
                  </>
                );
              }}
            </Formik>
          )}
        </div>
      </div>
      <div className="profile__deleteAccount">
        <Button text='Delete account' className='button button_delete'/>
      </div>
    </div>
  );
};
