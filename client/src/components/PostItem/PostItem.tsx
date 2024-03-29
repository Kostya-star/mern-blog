import { ReactComponent as ArrowDownSVG } from 'assets/arrow-down.svg';
import { ReactComponent as ArrowUpSVG } from 'assets/arrow-up.svg';
import { ReactComponent as CloseSVG } from 'assets/close.svg';
import { ReactComponent as CommentSVG } from 'assets/comment.svg';
import { ReactComponent as EditSVG } from 'assets/edit.svg';
import { ReactComponent as PlusSVG } from 'assets/plus.svg';
import { ReactComponent as ThumbsUpSVG } from 'assets/thumb-up.svg';
import { ReactComponent as ThumbsUpColoredSVG } from 'assets/thumbs-up-colored.svg';
import { Avatar } from 'components/Avatar/Avatar';
import { FC, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { fetchCommentsByPostId } from 'redux/slices/comments';
import { deletePost, likePost } from 'redux/slices/posts';
import { IPost } from 'types/IPost';
import { createTimeSince } from 'utils/createTimeSince';
import s from './PostItem.module.scss';
import { Loader } from 'components/UI/Loader/Loader';
import { Button } from 'components/UI/Button/Button';
import { follow_unfollow } from 'redux/slices/userProfile';
import { OnlineOfflineCircle } from 'components/OnlineOfflineCircle/OnlineOfflineCircle';
import { getUserOnlineStatus } from 'utils/getUserOnlineStatus';

interface IPostItemProps {
  post: IPost;
  // onShowComments?: (postId: string) => void
}

export const PostItem: FC<IPostItemProps> = ({ post }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { currentUserId, followStatus, onlineUsers } = useAppSelector(({ auth, profile }) => ({
    currentUserId: auth.data?._id,
    followStatus: profile.followers.status,
    onlineUsers: auth.onlineUsers
  }));

  const [isShowText, setShowText] = useState(false);

  const onClickLike = (postId: string) => {
    dispatch(likePost(postId));
  };

  const onCommentsClickHandle = (postId: string) => {
    dispatch(fetchCommentsByPostId(postId));
  };

  const removePost = (id: string) => {
    dispatch(deletePost(id));
  };

  const onRedirectAboutProfile = () => {
    navigate(`/profile/about/${post.user._id}`);
  };

  const onFollowUser = async (followedUserId: string) => {
    dispatch(follow_unfollow({ userId: followedUserId }));
  };

  const timeCreation = createTimeSince(new Date(post?.createdAt));
  const isShowEditDelete = currentUserId === post.user?._id;
  const isLiked = post.usersLiked.includes(currentUserId as string);
  const isUserFollowed = post.user.usersFollowed.includes(
    currentUserId as string,
  );
  const isUserOnline = getUserOnlineStatus(onlineUsers, post.user._id)
  // console.log(onlineUsers);
  

  return (
    // POST IMAGE POP UP BUTTONS

    <div className={s.post}>
      {isShowEditDelete ? (
        <div className={s.post__popupButtons}>
          <Link to={`/posts/${post._id}/edit`}>
            <EditSVG />
          </Link>

          <CloseSVG onClick={() => removePost(post._id)} />
        </div>
      ) : null}

      {/* POST IMAGE   */}

      <div className={s.post__header}>
        {post.imageUrl && <img src={post.imageUrl} alt="post img" />}
      </div>
      <div
        className={`${s.post__content} ${
          !post.imageUrl && s.post__content_trimtop
        }`}
      >
        {/* POST USER DATA(AVATAR + CREDENTIALS + FOLLOW + CREATION TIME) */}

        <div className={s.post__content__header}>
          <Avatar
            avatar={post.user.avatarUrl as string}
            onClick={onRedirectAboutProfile}
          />
          <div className={s.post__content__header__userData}>
            <div className={s.group}>
              <span className={s.fullName} onClick={onRedirectAboutProfile}>
                {post.user?.fullName}
                <OnlineOfflineCircle isOnline={isUserOnline}/>
              </span>
              {!isUserFollowed &&
                currentUserId !== post.user._id &&
                (followStatus === 'loading' ? (
                  <Loader className="loader_mini" />
                ) : (
                  <Button
                    text="Follow"
                    className="button_follow_mini"
                    onClick={() => onFollowUser(post.user._id)}
                  >
                    <PlusSVG />
                  </Button>
                ))}
            </div>
            <div className={s.time}>{timeCreation}</div>
          </div>
        </div>

        {/* POST NAME HEADING */}

        <div className={s.post__content__body}>
          <div className={s.post__content__body__heading}>
            <h2>{post.title}</h2>
          </div>

          {/* POST TAGS */}

          {post?.tags.length ? (
            <div className={s.post__content__body__tags}>
              {post.tags.map((tag, ind) => (
                <Link to={`/tags/${tag}`} key={ind}>
                  <span>#{tag}</span>
                </Link>
              ))}
            </div>
          )
          : null
        }

          {/* POST TEXT DESCRIPTION */}

        {
          post.text && 
          <>
            <div className={s.post__content__body__dropdown} onClick={() => setShowText(!isShowText)}>
              details
            </div>
            
            { isShowText && (
              <div className={s.post__content__body__text}>
                <ReactMarkdown children={post.text} />
              </div>
            )}
          </>
        }

          {/* POST COMMENTS AND LIKES */}

          <div className={s.post__content__body__statistics}>
            <div className={s.post__content__body__statistics__group}>
              <div onClick={() => onClickLike(post._id)}>
                {isLiked ? <ThumbsUpColoredSVG /> : <ThumbsUpSVG />}
                {post.usersLiked.length}
              </div>
              <div onClick={() => onCommentsClickHandle(post._id)}>
                <CommentSVG />
                {post.usersCommented.length}
              </div>
            </div>
            <div>
              {/* <EyeSVG /> */}
              {/* {post.viewCount} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
