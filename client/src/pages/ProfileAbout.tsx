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
import {
  deleteUser,
} from 'redux/slices/auth';
import { clearCommentsSlice } from 'redux/slices/comments';
import { fetchPostsByUserId } from 'redux/slices/posts';
import { follow_unfollow, getUserFollowers, getUserProfileById } from 'redux/slices/userProfile';
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
  }));

  // MODAL FOR POSTS AND COMMENTS

  const [isPostsModalVisible, setPostsModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState<IPost | null>(null);

  // MODAL FOR FOLLOWERS

  const [isFollowersModalVisible, setFollowersModalVisible] = useState(false);

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
      onCloseFollowers()
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
    dispatch(getUserFollowers(userId)).then(() => {
      setFollowersModalVisible(true);
    })
  };

  const onCloseFollowers = () => {
    setFollowersModalVisible(false);
  };

  const currentBrowsedFullPost = posts?.find(
    (post) => post._id === selectedPost?._id,
  );

  const isBrowsedUserFollowed = profileUser?.usersFollowed.includes(
    currentUser?._id as string,
  );
console.log(isFollowersModalVisible);

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

            {/* MODAL FOR POSTS & COMMENTS */}

            {isPostsModalVisible && currentBrowsedFullPost && (
              <Modal
                isVisible={isPostsModalVisible}
                onCloseModal={onCloseFullPost}
              >
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

            {/* MODAL FOR FOLLOWERS */}

            <Modal
              isVisible={isFollowersModalVisible}
              onCloseModal={onCloseFollowers}
            >
              <div className="profileAbout__modal">
                <div className="profileAbout__modal__card" onClick={(e) => e.stopPropagation()}>
                  <h4>Followers</h4>
                  <hr />

                  {!followers?.length && <div>No followers</div>}

                  {followers?.length && (
                    followers.map((follower) => {
                      const isFollowerFollowed =
                        follower.usersFollowed.includes(
                          currentUser?._id as string,
                        );

                      return (
                        <FOLLOWER_FOLLOWED
                          key={follower._id}
                          follower={follower}
                          isFollowerFollowed={isFollowerFollowed}
                          currentUserId={currentUser?._id as string}
                          followStatus={followStatus}
                          onFollowUser={onFollowUser}
                        >
                          {profileUser?._id === currentUser?._id && (
                            <Button
                              text="Remove"
                              className="button button_cancel"
                            />
                          )}
                        </FOLLOWER_FOLLOWED>
                      );
                    })
                  )}
                </div>
              </div>
            </Modal>
          </div>
        ))}
    </div>
  );
};
