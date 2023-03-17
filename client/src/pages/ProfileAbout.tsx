import { Avatar } from 'components/Avatar/Avatar';
import { Button } from 'components/UI/Button/Button';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAppSelector } from 'redux/hooks';
import { deleteUser, getUserById } from 'redux/slices/auth';
import { useAppDispatch } from 'redux/hooks';
import { useEffect, useState } from 'react';
import { IUser } from 'types/IUser';
import { Loader } from 'components/UI/Loader/Loader';

export const ProfileAbout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { id } = useParams();

  const currentUser = useAppSelector(({ auth }) => auth.data);

  const [isLoading, setLoading] = useState(true);
  const [browsedUser, setBrowsedUser] = useState<IUser>({
    avatarUrl: '',
    createdAt: '',
    email: '',
    fullName: '',
    postsCreated: 0,
    updatedAt: '',
    _id: '',
  });

  useEffect(() => {
    try {
      if (id) {
        (async () => {
          const user = await dispatch(getUserById(id)).unwrap();
          setBrowsedUser(user);
        })();
      } else {
        if (currentUser) {
          setBrowsedUser(currentUser);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [location.pathname]);

  const accountCreationDate = new Date(
    browsedUser?.createdAt as string,
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
        {isLoading ? (
          <Loader />
        ) : (
          <div className="profileAbout__body">
            <Avatar avatar={browsedUser?.avatarUrl as string} />
            <div className="profileAbout__body__text">
              <div>
                Name: {browsedUser?.fullName}{' '}
                {browsedUser._id === '64010100736d71817f3d671f' && (
                  <strong>ADMIN</strong>
                )}
              </div>
              {/* <div>Email: {browsedUser?.email}</div> */}
              <div>Created: {accountCreationDate}</div>
              <div>Posts created: {browsedUser?.postsCreated}</div>
            </div>
          </div>
        )}
      </div>

      {currentUser?._id === browsedUser._id && (
        <div className="profileAbout__deleteAccount">
          <Button
            text="Delete account"
            className="button button_delete"
            onClick={onDeleteUser}
          />
        </div>
      )}
    </div>
  );
};
