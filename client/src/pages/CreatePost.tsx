import { Button } from 'components/UI/Button/Button';
import { Input } from 'components/UI/Input/Input';
import { TextArea } from 'components/UI/TextArea/TextArea';

export const CreatePost = () => {
  return (
    <div className="createPost">
      <div className="createPost__content">
        {/* <div> */}
          <Button text="Upload preview" className="button button_transparent" />
        {/* </div> */}
        <TextArea placeholder="Post title..." />
        <Input type="text" placeholder="#t a g s" />
        <hr />
      </div>
    </div>
  );
};
