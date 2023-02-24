import React from 'react';
import s from './Comments.module.scss';
export const Comments = () => {
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
    </div>
  );
};
