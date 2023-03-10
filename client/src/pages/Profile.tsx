import { Avatar } from 'components/Avatar/Avatar';
import { Button } from 'components/UI/Button/Button';
import { Input } from 'components/UI/Input/Input';
import { ErrorMessage, Form, Formik } from 'formik';
import { useState } from 'react';
import { useAppSelector } from 'redux/hooks';
import * as Yup from 'yup';

const profileSections = ['About profile', 'Edit profile'];

const validationSchema = Yup.object().shape({
  isPassword: Yup.boolean(),
  fullName: Yup.string()
    .min(2, 'Must be at least 2 characters')
    .required('Required'),
  email: Yup.string().email('Invalid email address').required('Required'),
  password: Yup.string()
    .when("isPassword", ([isPassword], _) => {
      return isPassword ? Yup.string()
        .min(6, 'Must be at least 6 characters')
        .required('Required') : Yup.string().min(0)
    } 
    ),
  confirmPassword: Yup.string()
    .when('isPassword', ([isPassword], _) => {
      return isPassword ? Yup.string()
          .oneOf([Yup.ref('password')], 'Passwords must match')
          .required('Required') : Yup.string().min(0)
          
    } 
    ),
});

export const Profile = () => {
  const user = useAppSelector(({ auth }) => auth.data);

  const [activeSection, setActiveSection] = useState(0);
  // const [isChangePassword, setIsChangePassword] = useState(false);

  const aboutSection = profileSections[activeSection] === 'About profile';
  const editSection = profileSections[activeSection] === 'Edit profile';

  const accountCreationDate = new Date(
    user?.createdAt as string,
  ).toLocaleDateString();

  const onUpdateUserProfile = (values: any) => {
    console.log(values);
  };

  const initialValues = {
    fullName: user?.fullName,
    email: user?.email,
    password: '',
    confirmPassword: '',
    avatarUrl: user?.avatarUrl,
    isPassword: false,
  };


  return (
    <div className="profile">
      <div className="profile__image">
        <Avatar avatar={user?.avatarUrl as string} />
        {editSection && <span>change photo</span>}
      </div>
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
              <div>Name: {user?.fullName}</div>
              <div>Email: {user?.email}</div>
              <div>Created: {accountCreationDate}</div>
              <div>Posts created: {user?.postsCreated}</div>
            </>
          )}

          {editSection && (
            <div>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onUpdateUserProfile}
                enableReinitialize
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
                            <Input
                              type="password"
                              id="confirmPassword"
                              name="confirmPassword"
                              value={!values.isPassword ? '' : values.confirmPassword}
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
                      <label htmlFor="isPassword" className="input">
                        Change password?
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
                            handleChange(e)
                          }}
                          // checked={isChangePassword}
                          checked={values.isPassword}
                          // onChange={() => setIsChangePassword(!isChangePassword)}
                        />
                      </label>

                      {/* <div className="change_password">
                      <span
                        onClick={() => setIsChangePassword(!isChangePassword)}
                      >
                        Change password?
                      </span>
                    </div> */}

                      <Button
                        type="submit"
                        text="Save changes"
                        className={`button ${
                          isValid ? 'button_colored' : 'button_disabled'
                        }`}
                        disabled={!isValid}
                      />
                    </Form>
                  );
                }}
              </Formik>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
