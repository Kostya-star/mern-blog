import { Comments } from 'components/Comments/Comments';
import { PostItem } from 'components/PostItem/PostItem';

export const FullPost = () => {
  return (
    <div className="fullPost">
      <div className="post">
        <PostItem isPostText={true} />
      </div>
      <Comments isCreatePost={true} />
    </div>
  );
};
