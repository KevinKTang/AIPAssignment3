import React, { Component } from 'react';
import {Editor, EditorState, RichUtils} from 'draft-js';
import '../styles/BlogEditor.css'
import 'draft-js/dist/Draft.css';

/*
    This component is the text editor to create and update blogs
*/

class BlogEditor extends Component {
    
    constructor() {
        super();
        this.state = {
            editorState: EditorState.createEmpty()
        }
        this.onChange = this.onChange.bind(this);
        this.onItalicClick = this.onItalicClick.bind(this);
    }

    onChange(editorState) {
        this.setState({editorState});
    }

    onItalicClick() {
        this.onChange(RichUtils.toggleInlineStyle(
            this.state.editorState,
            'ITALIC'
        ));
    }

    render() {
        return (
            <div className="blog-editor">
                <button onClick={this.onItalicClick}>I</button>
                <Editor
                    editorState={this.state.editorState}
                    onChange={this.onChange} />
            </div>
        )
    }

}

export default BlogEditor;