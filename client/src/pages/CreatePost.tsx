import { Button } from 'components/UI/Button/Button';
import { Input } from 'components/UI/Input/Input';
import { TextArea } from 'components/UI/TextArea/TextArea';
import { useCallback, useState } from 'react';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';

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
  const [editorValue, setEditorValue] = useState('');
  const imageUrl = '';

  const onEditorChange = useCallback((value: string) => {
    setEditorValue(value);
  }, []);

  return (
    <div className="createPost">
      <div className="createPost__content">
        <Button text="Upload preview" className="button button_transparent" />
        <input type="file" onChange={() => {}} hidden />
        {imageUrl && <Button text="Delete" className="button button_delete" />}
        {imageUrl && (
          <img
            className="asdf"
            src={`http://localhost:5000${imageUrl}`}
            alt="Uploaded"
          />
        )}
        <TextArea placeholder="Post title..." />
        <Input type="text" placeholder="#t a g s" />
        <hr />
      </div>
      <SimpleMDE
        className="editor"
        value={editorValue}
        onChange={onEditorChange}
        options={options}
      />
      <div className="createPost__content__buttons">
        <Button text="Publish" className="button button_colored" />
        <Button text="Cancel" className="button button_cancel" />
      </div>
    </div>
  );
};
