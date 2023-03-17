import { Avatar } from 'components/Avatar/Avatar';
import { Button } from 'components/UI/Button/Button';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAppSelector } from 'redux/hooks';
import { deleteUser, getUserById } from 'redux/slices/auth';
import { useAppDispatch } from 'redux/hooks';
import { useEffect, useState } from 'react';
import { IUser } from 'types/IUser';
import { Loader } from 'components/UI/Loader/Loader';
import { fetchPostsByUserId } from 'redux/slices/posts';
import { ReactComponent as ThumbsUpColoredSVG } from 'assets/thumbs-up-colored.svg';
import { ReactComponent as CommentColoredSVG } from 'assets/comment-colored.svg';
import emptyImage from 'assets/no-image.jpg';

export const ProfileAbout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { id } = useParams();

  const { currentUser, posts, postStatus } = useAppSelector(({ auth, posts }) => ({
    currentUser: auth.data,
    posts: posts.posts,
    postStatus: posts.status
  }));

  const [isUserProfileLoading, setUserProfileLoading] = useState(false);
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
    if (id) {
      (async () => {
        try {
          setUserProfileLoading(true)
          const user = await dispatch(getUserById(id)).unwrap();
          dispatch(fetchPostsByUserId(id));
          if (user) {
            setBrowsedUser(user);
          }
          
        } catch (error) {
          console.log(error);
          
        } finally {
          setUserProfileLoading(false);
        }
      })();
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
      <div className="profileAbout__userData">
        <h2 className="profileAbout__top">About profile</h2>
        {isUserProfileLoading ? (
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

      <div style={{ marginTop: '30px' }}>
        <hr style={{ height: '1px', backgroundColor: 'black' }} />
      </div>

      <div className="profileAbout__posts">
        {postStatus === 'loading' && <Loader/>}
        {postStatus === 'success' && (posts?.length ? (
          posts.map((post) => (
            <div key={post._id} className="profileAbout__posts__post">
              <img src={post.imageUrl || emptyImage} alt="postimage" />
              <div className="profileAbout__posts__post__statistics">
                <span>
                  <ThumbsUpColoredSVG /> {post.usersLiked.length}
                </span>
                <span>
                  <CommentColoredSVG /> {post.usersCommented.length}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div>No posts of this user</div>
        ))}
      </div>
    </div>
  );
};
