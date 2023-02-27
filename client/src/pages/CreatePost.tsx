import { Button } from 'components/UI/Button/Button';
import { Input } from 'components/UI/Input/Input';
import { TextArea } from 'components/UI/TextArea/TextArea';
import { useCallback, useState, useRef, ChangeEvent } from 'react';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import { instance } from 'API/instance';
import { useNavigate } from 'react-router-dom';

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

export const CreatePost = () => {
  const navigate = useNavigate();

  const [newPost, setNewPost] = useState({
    title: '',
    tags: '',
    text: '',
    imageUrl: '',
  });

  const imageRef = useRef<HTMLInputElement | null>(null);

  const onUploadFile = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const formData = new FormData();
      const file = e.target.files?.[0];
      formData.append('image', file as File);

      const resp = await instance.post('/upload', formData);
      setNewPost({ ...newPost, imageUrl: resp.data.url });
    } catch (error) {
      alert('Error when uploading the image');
      console.log(error);
    }
  };

  const onSubmitNewPost = async () => {
    try {
      const payload = { ...newPost, tags: newPost.tags.split(' ') };
      const { data } = await instance.post('/posts', payload);
      navigate(`/posts/${data._id}`);
    } catch (error) {
      alert('Error when creating the article');
      console.log(error);
    }
  };

  return (
    <div className="createPost">
      <div className="createPost__content">
        <input ref={imageRef} type="file" onChange={onUploadFile} hidden />
        {newPost.imageUrl ? (
          <>
            <Button
              text="Delete"
              className="button button_delete"
              onClick={() => setNewPost({ ...newPost, imageUrl: '' })}
            />
            <img
              className="createPost__content__img"
              src={`http://localhost:5000${newPost.imageUrl}`}
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
