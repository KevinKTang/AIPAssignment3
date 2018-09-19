import {
    getDefaultKeyBinding,
    RichUtils,
} from 'draft-js';

const basicTextStylePlugin = {
    // Takes keyboard input event object and passes it to 
    // getDefaultKeyBinding utility function of draft-js
    // and returns the resultant string. e.g. ctrl + b = 'bold'
    keyBindingFn(event) {
        return getDefaultKeyBinding(event);
    },
    // Analyses the command string and perform actions based on it
    // 
    handleKeyCommand(command, editorState, { getEditorState, setEditorState }) {
        const newEditorState = RichUtils.handleKeyCommand(
            editorState, command
        );
        if (newEditorState) {
            setEditorState(newEditorState);
            return 'handled';
        }
        return 'not-handled';
    }
};

export default basicTextStylePlugin;