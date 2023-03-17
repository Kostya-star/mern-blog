import { Avatar } from 'components/Avatar/Avatar';
import { Button } from 'components/UI/Button/Button';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from 'redux/hooks';
import { deleteUser } from 'redux/slices/auth';
import { useAppDispatch } from './../redux/hooks';

export const ProfileAbout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const currentUser = useAppSelector(({ auth }) => auth.data);

  const accountCreationDate = new Date(
    currentUser?.createdAt as string,
  ).toLocaleDateString();

  const onDeleteUser = async () => {
    if (
      window.confirm(
        'Do you really want to delete your account? NOTE: all of your data: posts, comments... will be erased forever!',
      )
    ) {
      dispatch(deleteUser())
        .unwrap()
        .then(({ data }) => {
          if (data.success) {
            window.localStorage.removeItem('token');
            navigate('/login');
          }
        });
    }
  };

  return (
    <div className="profileAbout">
      <div className="profileAbout__content">
        <h2 className="profileAbout__top">About profile</h2>
        <div className="profileAbout__body">
          <Avatar avatar={currentUser?.avatarUrl as string} />
          <div className="profileAbout__body__text">
            <div>Name: {currentUser?.fullName}</div>
            <div>Email: {currentUser?.email}</div>
            <div>Created: {accountCreationDate}</div>
            <div>Posts created: {currentUser?.postsCreated}</div>
          </div>
        </div>
      </div>

      <div className="profileAbout__deleteAccount">
        <Button
          text="Delete account"
          className="button button_delete"
          onClick={onDeleteUser}
        />
      </div>
    </div>
  );
};
