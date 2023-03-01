import { instance } from 'API/instance';
import { Button } from 'components/UI/Button/Button';
import { Input } from 'components/UI/Input/Input';
import { FC, useState } from 'react';
import s from './Comments.module.scss';

interface ICommentsProps {
  isCreatePost?: boolean;
  postId?: string
}

export const Comments: FC<ICommentsProps> = ({ isCreatePost, postId }) => {
  const [comment, setComment] = useState('')

  const onSendPost = async () => {
    await instance.post('/comments', {postId, text: comment})
  }



  return (
    <div className={s.comments}>
      <h3>Comments</h3>
      <div className={s.comment}>
        <img src="https://mui.com/static/images/avatar/1.jpg" alt="" />
        <div className={s.comment__body}>
          <p>Constantin Danilov</p>
          <p>
            This is a test commentThis is a test commentThis is a test
            commentThis is a test commentThis is a test commentThis is a test
            comment
          </p>
        </div>
      </div>
      <hr />
      {isCreatePost && (
        <div className={s.comments__create}>
          <img src="https://mui.com/static/images/avatar/2.jpg" alt="" />
          <div>
            <div className="input">
              <Input type="text" placeholder="Write comment..." value={comment} onChange={(e) => setComment(e.target.value)} />
            </div>

            <Button onClick={onSendPost} className="button button_colored" text="send" />
          </div>
        </div>
      )}
    </div>
  );
};
