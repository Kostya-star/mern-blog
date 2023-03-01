import { instance } from 'API/instance';
import { Comments } from 'components/Comments/Comments';
import { PostItem } from 'components/PostItem/PostItem';
import { Button } from 'components/UI/Button/Button';
import { Input } from 'components/UI/Input/Input';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch } from 'redux/hooks';
import { createComment } from 'redux/slices/comments';
import { fetchPost } from 'redux/slices/posts';
import { IPost } from './../types/IPost';

export const FullPost = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams();

  const [post, setPost] = useState<IPost>({} as IPost);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const post = await dispatch(fetchPost(id as string)).unwrap();
        setPost(post);
      } catch (error) {
        setError(error as any);
      } finally {
        setLoading(false);
      }
    })();
  }, []);


  const onCreateComment = async () => {
    dispatch(createComment({ postId: id as string, text: commentText }))
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>ERROR</div>;
  }

  return (
    <div className="fullPost">
      <div className="post">
        <PostItem isPostText={true} post={post} />
      </div>
      {/* @ts-ignore */}
      <Comments>
        <div className="comments__create">
          <img src="https://mui.com/static/images/avatar/2.jpg" alt="" />
          <div>
            <div className="input">
              <Input
                type="text"
                placeholder="Write comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
            </div>

            <Button
              onClick={onCreateComment}
              className="button button_colored"
              text="send"
            />
          </div>
        </div>
      </Comments>
    </div>
  );
};
