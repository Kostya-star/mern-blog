import { Comments } from 'components/Comments/Comments';
import { PostItem } from 'components/PostItem/PostItem';
import { PostThumbnail } from 'components/PostThumbnail/PostThumbnail';
import { ProfileCard } from 'components/ProfileCard/ProfileCard';
import { Button } from 'components/UI/Button/Button';
import { Loader } from 'components/UI/Loader/Loader';
import { Modal } from 'components/UI/Modal/Modal';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { deleteUser, follow_unfollow, getUserById } from 'redux/slices/auth';
import { clearCommentsSlice } from 'redux/slices/comments';
import { fetchPostsByUserId } from 'redux/slices/posts';
import { IPost } from 'types/IPost';
import { IUser } from 'types/IUser';

export const ProfileAbout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { id } = useParams();

  const {
    currentUser,
    posts,
    postsStatus,
    isComments,
    commentsStatus,
    browsedUser,
    userProfileLoading,
  } = useAppSelector(({ auth, posts, comments }) => ({
    currentUser: auth.data,
    posts: posts.posts,
    postsStatus: posts.status,
    isComments: comments.isComments,
    commentsStatus: comments.status,
    browsedUser: auth.browsedUser,
    userProfileLoading: auth.status,
  }));

  // const [isUserProfileLoading, setUserProfileLoading] = useState(false);
  // const [browsedUser, setBrowsedUser] = useState<IUser>({
  //   avatarUrl: '',
  //   createdAt: '',
  //   email: '',
  //   fullName: '',
  //   postsCreated: 0,
  //   updatedAt: '',
  //   _id: '',
  //   usersFollowing: [],
  //   usersFollowed: [],
  // });

  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState<IPost | null>(null);

  useEffect(() => {
    if (id) {
      try {
        // setUserProfileLoading(true);
        dispatch(clearCommentsSlice());
        dispatch(fetchPostsByUserId(id));
        dispatch(getUserById(id));
        // .unwrap()
        // .then((user) => {
        //   setBrowsedUser(user);
        //   setUserProfileLoading(false);
        // });
      } catch (error) {
        console.log(error);
      }
    }

    return () => {
      dispatch(clearCommentsSlice());
    };
  }, [location.pathname]);

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

  const onShowFullPost = (post: IPost) => {
    setModalVisible(true);
    setSelectedPost(post);
  };

  const onCloseFullPost = () => {
    setModalVisible(false);
    dispatch(clearCommentsSlice());
  };

  const onFollowUser = (followedUserId: string) => {
    dispatch(follow_unfollow(followedUserId));
  };

  const currentBrowsedFullPost = posts?.find(
    (post) => post._id === selectedPost?._id,
  );

  const isFollowed = browsedUser?.usersFollowed.includes(currentUser?._id as string)

  return (
    <div className="profileAbout">
      <div className="profileAbout__userData">
        {userProfileLoading === 'loading' && <Loader />}
        {userProfileLoading === 'success' && browsedUser && (
          <ProfileCard
            browsedUser={browsedUser}
            onFollowUser={onFollowUser}
            isFollowed={isFollowed as boolean}
            isShowAvatarButtons={browsedUser._id !== currentUser?._id}
          />
        )}
        {currentUser?._id === browsedUser?._id && (
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

      {postsStatus === 'loading' && (
        <div className="loader">
          <Loader />
        </div>
      )}
      {postsStatus === 'success' &&
        (!posts?.length ? (
          <h1 className="profileAbout__noPosts">No posts of this user</h1>
        ) : (
          <div className="profileAbout__posts">
            {posts.map((post) => (
              <PostThumbnail
                key={post._id}
                post={post}
                onShowFullPost={() => onShowFullPost(post)}
              />
            ))}

            {isModalVisible && currentBrowsedFullPost && (
              <Modal isVisible={isModalVisible} onCloseModal={onCloseFullPost}>
                <div className="profileAbout__modal">
                  <div
                    className="profileAbout__modal__post"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <PostItem post={currentBrowsedFullPost} />
                  </div>
                  {isComments && (
                    <div
                      className="profileAbout__modal__comments"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Comments />
                    </div>
                  )}
                </div>
              </Modal>
            )}
          </div>
        ))}
    </div>
  );
};
