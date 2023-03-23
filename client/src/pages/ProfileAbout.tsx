import { Comments } from 'components/Comments/Comments';
import { FOLLOWER_FOLLOWED } from 'components/FOLLOWER_FOLLOWED/FOLLOWER_FOLLOWED';
import { PostItem } from 'components/PostItem/PostItem';
import { PostThumbnail } from 'components/PostThumbnail/PostThumbnail';
import { ProfileCard } from 'components/ProfileCard/ProfileCard';
import { Button } from 'components/UI/Button/Button';
import { Loader } from 'components/UI/Loader/Loader';
import { Modal } from 'components/UI/Modal/Modal';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { deleteUser } from 'redux/slices/auth';
import { clearCommentsSlice } from 'redux/slices/comments';
import { fetchPostsByUserId } from 'redux/slices/posts';
import {
  follow_unfollow,
  getUserFollowers,
  getUserFollowings,
  getUserProfileById,
  removeFollower,
} from 'redux/slices/userProfile';
import { IFollowersModal } from 'types/IFollowersModal';
import { IFollowUnfollowPayload } from 'types/IFollowUnfollowPayload';
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
    profileUser,
    profileStatus,
    followers,
    followStatus,
    // followings
  } = useAppSelector(({ auth, posts, comments, profile }) => ({
    currentUser: auth.data,
    posts: posts.posts,
    postsStatus: posts.status,
    isComments: comments.isComments,
    commentsStatus: comments.status,
    profileUser: profile.profile.user,
    profileStatus: profile.profile.status,
    followers: profile.followers.users,
    followStatus: profile.followers.status,
    // followings: profile.following.users
  }));

  // MODAL FOR POSTS AND COMMENTS

  const [isPostsModalVisible, setPostsModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState<IPost | null>(null);

  // MODAL FOR FOLLOWERS

  const [isFollowersModalVisible, setFollowersModalVisible] =
    useState<null | IFollowersModal>(null);

  const [isModalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    if (id) {
      try {
        dispatch(clearCommentsSlice());
        dispatch(getUserProfileById(id));
        dispatch(fetchPostsByUserId(id));
      } catch (error) {
        console.log(error);
      }
    }

    return () => {
      dispatch(clearCommentsSlice());
      onCloseFollowersModal();
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
    setPostsModalVisible(true);
    setSelectedPost(post);
  };

  const onCloseFullPost = () => {
    setPostsModalVisible(false);
    dispatch(clearCommentsSlice());
  };

  const onFollowUser = (followPayload: IFollowUnfollowPayload) => {
    dispatch(follow_unfollow(followPayload));
  };

  const onShowFollowers = (userId: string) => {
    setFollowersModalVisible({ followers: true });
    setModalLoading(true);
    dispatch(getUserFollowers(userId)).then(() => {
      setModalLoading(false);
    });
  };

  const onCloseFollowersModal = () => {
    setFollowersModalVisible(null);
  };

  const onShowFollowing = (userId: string) => {
    setFollowersModalVisible({ followings: true });
    setModalLoading(true);
    dispatch(getUserFollowings(userId)).then(() => {
      setModalLoading(false);
    });
  };

  const onRemoveFollower = (followerId: string) => {
    dispatch(removeFollower(followerId));
  };

  const currentBrowsedFullPost = posts?.find(
    (post) => post._id === selectedPost?._id,
  );

  const isBrowsedUserFollowed = profileUser?.usersFollowed.includes(
    currentUser?._id as string,
  );

  return (
    <div className="profileAbout">
      <div className="profileAbout__userData">
        {profileStatus === 'loading' && <Loader className="loader_big" />}
        {profileStatus === 'success' && profileUser && (
          <ProfileCard
            profileUser={profileUser}
            isFollowed={isBrowsedUserFollowed as boolean}
            isShowAvatarButtons={profileUser._id !== currentUser?._id}
            followStatus={followStatus}
            onFollowUser={onFollowUser}
            onShowFollowers={onShowFollowers}
            onShowFollowing={onShowFollowing}
          />
        )}
        {currentUser?._id === profileUser?._id && (
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
        <div className="loader_center">
          <Loader className="loader_big" />
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
          </div>
        ))}

      {/* MODAL FOR POSTS & COMMENTS */}

      {currentBrowsedFullPost && (
        <Modal isVisible={isPostsModalVisible} onCloseModal={onCloseFullPost}>
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

      {/* FOLLOWERS AND FOLLOWINGS MODAL */}

      <Modal
        isVisible={
          isFollowersModalVisible?.followers ||
          isFollowersModalVisible?.followings ||
          null
        }
        onCloseModal={onCloseFollowersModal}
      >
        <div className="profileAbout__modal">
          <div
            className="profileAbout__modal__card"
            onClick={(e) => e.stopPropagation()}
          >
            <h4>
              {isFollowersModalVisible?.followers ? 'Followers' : 'Following'}
            </h4>
            <hr />

            {isModalLoading ? (
              <div className="loader_center">
                <Loader className="loader_mini" />
              </div>
            ) : followers?.length ? (
              followers.map((follower) => {
                return (
                  <FOLLOWER_FOLLOWED
                    key={follower._id}
                    user={follower}
                    modal={isFollowersModalVisible}
                    profileUserId={profileUser?._id as string}
                    currentUserId={currentUser?._id as string}
                    followStatus={followStatus}
                    onRemoveFollower={onRemoveFollower}
                    onFollowUser={onFollowUser}
                  />
                );
              })
            ) : (
              <div>No followers</div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};
