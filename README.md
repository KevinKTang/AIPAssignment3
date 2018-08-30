# Off With His Read

A web application for bloggers and writers to share and view content.

## Key Principles of Code Style and Design
The following coding conventions have been used to provide consistency and improve readability of code.

1.	Variable names and function names use lower camel case.
2.	Constants should be written entirely in uppercase.
3.	File names and class names use upper camel case.
4.	Directory names use lower case with words separated by a hyphen.
5.	HTML class names use lower case with words separated by a hyphen.
6.	The names of the above items should provide intrinsic documentation – they should be concise and descriptive.
7.	Comments should be meaningful and placed where helpful. If it isn’t immediately obvious what a function or section of code does, a comment should be provided.
8.	Comments are placed on a separate line above the code they are referring to.
9.	Comments start one space after the comment delimiter and start with a capital letter. They do not need a period at the end of the sentence unless there are multiple sentences. For example:
    - // Comment
    - // One sentence. Another sentence.
10. Components have a description of their purpose above the class definition. They use the following format:
```
/*  
    This component has purpose...
    This component does...
*/
```
11.	Break down large items into smaller ones – this goes for modularising components and splitting large functions into smaller ones.
12.	Code indentation is made up of four spaces.
13.	Use a semicolon after every statement in JavaScript.
14.	JSX statements use double quotes for attributes and all other JavaScript use single quotes.
15.	Self-closing tags use a single space. For example:
    - \<Component />
16.	Keep code as simple as possible. For example, use the conditional (ternary) operator instead of an if statement if the whole statement can be expressed on one line, and do not compare x == true.
17.	Each component in React should have its own css file in the styles folder for its own HTML classes.
18.	A single blank line should be used to separate code segments.
