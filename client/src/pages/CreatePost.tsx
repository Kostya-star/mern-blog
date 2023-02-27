import { Button } from 'components/UI/Button/Button';
import { Input } from 'components/UI/Input/Input';
import { TextArea } from 'components/UI/TextArea/TextArea';
import { useCallback, useState, useRef, ChangeEvent } from 'react';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import { instance } from 'API/instance';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAppDispatch } from 'redux/hooks';
import { createPost, uploadPostImage } from 'redux/slices/posts';
import { INewPostRequest } from 'types/INewPostRequest';

const options = {
  spellChecker: false,
  maxHeight: '400px',
  autofocus: true,
  hideIcons: ['side-by-side', 'fullscreen'] as any,
  placeholder: 'Введите текст...',
  status: false,
  autosave: {
    enabled: true,
    delay: 1000,
    uniqueId: 'MyUniqueID',
  },
};

interface INewPost extends Omit<INewPostRequest, 'tags' | 'imageUrl'> {
  tags: string;
  imageUrl: File | null;
}

export const CreatePost = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [newPost, setNewPost] = useState<INewPost>({
    title: '',
    tags: '',
    text: '',
    imageUrl: null,
  });

  const imageRef = useRef<HTMLInputElement | null>(null);

  const onSubmitNewPost = async () => {
    try {
      let imageUrl = ''

      if(newPost.imageUrl) {
        const formData = new FormData();
        formData.append('image', newPost.imageUrl as File);
        const { url } = await dispatch(uploadPostImage(formData)).unwrap();
        imageUrl = url
      }

      const _newPost = {
        ...newPost,
        imageUrl,
        tags: newPost.tags.split(' '),
      };
      const { data } = await dispatch(createPost(_newPost)).unwrap();
      navigate(`/posts/${data._id}`);
    } catch (error) {
      alert('Error when creating the article');
      console.log(error);
    }
  };

  const onDeleteImage = () => {
    setNewPost({ ...newPost, imageUrl: null });
    if (imageRef.current) {
      imageRef.current.value = '';
    }
  };

  return (
    <div className="createPost">
      <div className="createPost__content">
        {newPost.imageUrl ? (
          <>
            <Button
              text="Delete"
              className="button button_delete"
              onClick={onDeleteImage}
            />
            <img
              className="createPost__content__img"
              src={URL.createObjectURL(newPost.imageUrl)}
              alt="Uploaded"
            />
          </>
        ) : (
          <Button
            onClick={() => imageRef.current?.click()}
            text="Upload image"
            className="button button_transparent"
          />
        )}
        <input
          ref={imageRef}
          type="file"
          onChange={(e) =>
            setNewPost({ ...newPost, imageUrl: e.target.files?.[0] as File })
          }
          hidden
        />
        <TextArea
          placeholder="Post title..."
          value={newPost.title}
          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
        />
        <Input
          type="text"
          placeholder="#t a g s"
          value={newPost.tags}
          onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
        />
        <hr />
      </div>
      <SimpleMDE
        className="editor"
        value={newPost.text}
        onChange={(value) => setNewPost({ ...newPost, text: value })}
        options={options}
      />
      <div className="createPost__content__buttons">
        <Button
          text="Publish"
          className="button button_colored"
          onClick={onSubmitNewPost}
        />
        <Button
          text="Cancel"
          className="button button_cancel"
          onClick={() => navigate('/')}
        />
      </div>
    </div>
  );
};
