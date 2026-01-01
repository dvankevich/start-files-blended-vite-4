This document contains the complete source code of the repository consolidated into a single file for streamlined AI analysis.
The repository contents have been processed and combined with security validation bypassed.

# Repository Overview

## About This Document
This consolidated file represents the complete codebase from the repository, 
merged into a unified document optimized for AI consumption and automated 
analysis workflows.

## Repository Information
- **Repository:** dvankevich/start-files-blended-vite-4
- **Branch:** main
- **Total Files:** 37
- **Generated:** 2026-01-01T16:46:41.873Z

## Document Structure
The content is organized in the following sequence:
1. This overview section
2. Repository metadata and information  
3. File system hierarchy
4. Repository files (when included)
5. Individual source files, each containing:
   a. File path header (## File: path/to/file)
   b. Complete file contents within code blocks

## Best Practices
- Treat this document as read-only - make changes in the original repository
- Use file path headers to navigate between different source files
- Handle with appropriate security measures as this may contain sensitive data
- This consolidated view is generated from the live repository state

## Important Notes
- Files excluded by .gitignore and configuration rules are omitted
- Binary assets are not included - refer to the file structure for complete file listings
- Default ignore patterns have been applied to filter content
- Security validation is disabled - review content for sensitive information carefully

# Repository Structure

```
dvankevich/start-files-blended-vite-4/
├── src
│   ├── components
│   │   ├── Container
│   │   │   ├── Container.jsx
│   │   │   └── Container.module.css
│   │   ├── EditForm
│   │   │   ├── EditForm.jsx
│   │   │   └── EditForm.module.css
│   │   ├── Filter
│   │   │   ├── Filter.jsx
│   │   │   └── Filter.module.css
│   │   ├── Form
│   │   │   ├── Form.jsx
│   │   │   └── Form.module.css
│   │   ├── Grid
│   │   │   ├── Grid.jsx
│   │   │   └── Grid.module.css
│   │   ├── GridItem
│   │   │   ├── GridItem.jsx
│   │   │   └── GridItem.module.css
│   │   ├── Header
│   │   │   ├── Header.jsx
│   │   │   └── Header.module.css
│   │   ├── Heading
│   │   │   ├── Heading.jsx
│   │   │   └── Heading.module.css
│   │   ├── Section
│   │   │   ├── Section.jsx
│   │   │   └── Section.module.css
│   │   ├── Text
│   │   │   ├── Text.jsx
│   │   │   └── Text.module.css
│   │   ├── Todo
│   │   │   ├── Todo.jsx
│   │   │   └── Todo.module.css
│   │   └── TodoList
│   │       └── TodoList.jsx
│   ├── helpers
│   │   └── formatDate.js
│   ├── styles
│   │   └── variables.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
└── package.json
```

================================================================================
// File: index.html
================================================================================
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>

================================================================================
// File: package.json
================================================================================
{
  "name": "source-code",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "clsx": "^2.1.0",
    "date-fns": "^3.1.0",
    "modern-normalize": "^2.0.0",
    "path": "^0.12.7",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-icons": "^4.12.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.1",
    "eslint": "^8.55.0",
    "eslint-plugin-react": "^7.28.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "vite": "^7.3.0"
  }
}

================================================================================
// File: src/App.jsx
================================================================================
import Container from './components/Container/Container';
import Header from './components/Header/Header';
import Section from './components/Section/Section';
import Text from './components/Text/Text';

export const App = () => {
  return (
    <>
      <Header />
      <Section>
        <Container>
          <Text textAlign="center">Create your first todo😉</Text>
        </Container>
      </Section>
    </>
  );
};

================================================================================
// File: src/components/Container/Container.jsx
================================================================================
import styled from './Container.module.css';

const Container = ({ children }) => {
  return <div className={styled.container}>{children}</div>;
};

export default Container;

================================================================================
// File: src/components/Container/Container.module.css
================================================================================
.container {
  max-width: 1200px;
  padding: 0 20px;
  margin: 0 auto;
}

================================================================================
// File: src/components/EditForm/EditForm.jsx
================================================================================
import { RiSaveLine } from 'react-icons/ri';
import { MdOutlineCancel } from 'react-icons/md';

import style from './EditForm.module.css';

const EditForm = () => {
  return (
    <form className={style.form}>
      <input
        className={style.input}
        placeholder="What do you want to write?"
        name="text"
        required
        defaultValue={''}
        autoFocus
      />
      <button className={style.submitButton} type="submit">
        <RiSaveLine color="green" size="16px" />
      </button>

      <button className={style.editButton} type="button">
        <MdOutlineCancel color="red" size="16px" />
      </button>
    </form>
  );
};
export default EditForm;

================================================================================
// File: src/components/EditForm/EditForm.module.css
================================================================================
.form {
  width: 400px;
  margin: 0 auto;
  position: relative;
  margin-bottom: 80px;
}

.input {
  width: 100%;
  height: 56px;

  border-style: none;
  border-bottom: 1px solid #212121;
  background-color: transparent;

  padding: 16px;
  padding-right: 40px;
  outline: none;

  transition: var(--animation-cubicBezier);

  font-size: var(--font-medium);
  color: var(--color-dark);
  font-weight: 300;
  letter-spacing: 0.03em;

  &::placeholder {
    font-weight: 200;
  }
}

.button {
  width: 50px;
  height: 50px;

  font-size: 20px;
  font-weight: bold;
  color: var(--color-dark);

  position: absolute;
  top: 0;
}

.submitButton {
  composes: button;
  right: 0;
}
.editButton {
  composes: button;
  right: 40px;
}

================================================================================
// File: src/components/Filter/Filter.jsx
================================================================================
import style from './Filter.module.css';

const Filter = () => {
  return <input className={style.input} placeholder="Find it" name="filter" />;
};

export default Filter;

================================================================================
// File: src/components/Filter/Filter.module.css
================================================================================
.input {
  display: block;
  width: 200px;
  height: 40px;
  margin: 0 auto;
  margin-bottom: 60px;
  border-style: none;

  border-bottom: 2px solid #212121;
  background-color: transparent;

  outline: none;

  transition: var(--animation-cubicBezier);

  font-size: var(--font-medium);
  color: var(--color-dark);
  font-weight: 300;
  letter-spacing: 0.03em;

  &::placeholder {
    text-align: center;
    font-weight: 200;
    color: var(--color-gray);
  }
}

.input:hover,
.input:focus {
  box-shadow: var(--shadow-regular);
}

================================================================================
// File: src/components/Form/Form.jsx
================================================================================
import { FiSearch } from 'react-icons/fi';

import style from './Form.module.css';

const Form = () => {
  return (
    <form className={style.form}>
      <button className={style.button} type="submit">
        <FiSearch size="16px" />
      </button>

      <input
        className={style.input}
        placeholder="What do you want to write?"
        name="search"
        required
        autoFocus
      />
    </form>
  );
};

export default Form;

================================================================================
// File: src/components/Form/Form.module.css
================================================================================
.form {
  width: 400px;
  margin: 0 auto;
  position: relative;
  margin-bottom: 40px;
}

.input {
  width: 100%;
  height: 56px;

  border-style: none;
  border-bottom: 1px solid #212121;
  background-color: transparent;

  padding: 16px;
  padding-right: 40px;
  outline: none;

  transition: var(--animation-cubicBezier);

  font-size: var(--font-medium);
  color: var(--color-dark);
  font-weight: 300;
  letter-spacing: 0.03em;

  &::placeholder {
    font-weight: 200;
  }
}

.button {
  width: 50px;
  height: 50px;

  font-size: 20px;
  font-weight: bold;
  color: var(--color-dark);

  position: absolute;
  top: 0;
  right: 0;
}

================================================================================
// File: src/components/Grid/Grid.jsx
================================================================================
import style from './Grid.module.css';

const Grid = ({ children }) => {
  return <ul className={style.list}>{children}</ul>;
};

export default Grid;

================================================================================
// File: src/components/Grid/Grid.module.css
================================================================================
.list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-gap: 20px;
}

================================================================================
// File: src/components/GridItem/GridItem.jsx
================================================================================
import style from './GridItem.module.css';

const GridItem = ({ children }) => {
  return <li className={style.item}>{children}</li>;
};

export default GridItem;

================================================================================
// File: src/components/GridItem/GridItem.module.css
================================================================================
.item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

================================================================================
// File: src/components/Header/Header.jsx
================================================================================
import Container from '../Container/Container';
import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <Container>
        <nav className={styles.nav}>
          <h3 className={styles.title}>Lesson 4 redux</h3>
        </nav>
      </Container>
    </header>
  );
};

export default Header;

================================================================================
// File: src/components/Header/Header.module.css
================================================================================
.header {
  padding: 20px 0;

  background-color: #fff;

  box-shadow: var(--shadow-regular);
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}

.nav {
  display: flex;
  align-items: center;
  gap: 20px;
}

.title {
  color: var(--color-dark);
  font-size: var(--font-medium);
  font-weight: 700;
  text-transform: uppercase;
}

================================================================================
// File: src/components/Heading/Heading.jsx
================================================================================
import styles from './Heading.module.css';
import clsx from 'clsx';

const Heading = ({ title, top, bottom, tag: Tag = 'h2' }) => {
  return (
    <Tag
      className={clsx(styles.title, {
        [styles.top]: top,
        [styles.bottom]: bottom,
      })}
    >
      {title}
    </Tag>
  );
};

export default Heading;

================================================================================
// File: src/components/Heading/Heading.module.css
================================================================================
.title {
  font-size: var(--font-large);
  font-weight: 700;
  color: var(--color-dark);
  text-shadow: 1px 1px 2px #9e9e9e;

  text-align: center;

  position: relative;

  &:after {
    display: block;
    content: '';

    position: absolute;
    left: 50%;
    bottom: -16px;
    transform: translateX(-50%);

    width: 50%;
    height: 2px;
    border-radius: 1px;
    background-color: var(--color-gray);
  }
}

.top {
  margin-top: 50px;
}

.bottom {
  margin-bottom: 50px;
}

================================================================================
// File: src/components/Section/Section.jsx
================================================================================
import style from './Section.module.css';

const Section = ({ children }) => {
  return <section className={style.section}>{children}</section>;
};

export default Section;

================================================================================
// File: src/components/Section/Section.module.css
================================================================================
.section {
  padding: 40px 0;
}

================================================================================
// File: src/components/Text/Text.jsx
================================================================================
import style from './Text.module.css';

const Text = ({ children, textAlign = '', marginBottom = '0' }) => {
  return (
    <p
      className={[
        style['text'],
        style[textAlign],
        style[`marginBottom${marginBottom}`],
      ].join(' ')}
    >
      {children}
    </p>
  );
};

export default Text;

================================================================================
// File: src/components/Text/Text.module.css
================================================================================
.text {
  font-size: var(--font-medium);
  font-weight: 700;

  text-align: start;
}
.end {
  composes: text;
  text-align: end;
}
.center {
  composes: text;
  text-align: center;
}
.justify {
  composes: text;
  text-align: justify;
}

.marginBottom10 {
  margin-bottom: 10px;
}
.marginBottom20 {
  margin-bottom: 20px;
}
.marginBottom0 {
  margin-bottom: 0;
}

================================================================================
// File: src/components/Todo/Todo.jsx
================================================================================
import { Text } from 'components';

const Todo = () => {
  return (
    <Text textAlign="center" marginBottom="20">
      TODO #
    </Text>
  );
};

export default Todo;

================================================================================
// File: src/components/Todo/Todo.module.css
================================================================================
.box {
  padding: 40px;
  background-color: var(--color-light);
  border-radius: 8px;

  color: var(--color-gray);
  box-shadow: var(--shadow-regular);

  position: relative;
  width: 100%;
  height: 100%;
}

.button {
  position: absolute;

  right: 0;

  padding: 20px;
  transition: transform var(--animation-cubicBezier);
}
.button:hover,
.button:focus {
  transform: scale(1.05);
}

.button:disabled {
  color: var(--color-gray);
  pointer-events: none;
}

.deleteButton {
  composes: button;
  top: 0;
  color: var(--color-red);
}

.editButton {
  composes: button;
  bottom: 0;
  color: var(--color-lightBlue);
}

================================================================================
// File: src/components/TodoList/TodoList.jsx
================================================================================
import Text from '../Text/Text';

const TodoList = () => {
  return (
    <>
      <Text textAlign="center">We did not find any todo😯</Text>
    </>
  );
};

export default TodoList;

================================================================================
// File: src/helpers/formatDate.js
================================================================================
import { format, formatDistanceToNow } from 'date-fns';

export const formatDate = date => {
  return format(new Date(date), 'Pp', { addSuffix: true });
};

export const formatDateToNow = date => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

================================================================================
// File: src/index.css
================================================================================
@import 'styles/variables.css';

html {
  box-sizing: border-box;
  scroll-behavior: smooth;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  background: linear-gradient(to bottom, #c9d6ff, #e2e2e2);
  min-height: 100vh;

  font-style: normal;
}

h1,
h2,
h3,
h4,
h5,
h6,
p {
  margin: 0;
}

ul,
ol {
  list-style: none;
  padding-left: 0;
  margin: 0;
}

button {
  padding: 0;
  border: none;
  font: inherit;
  color: inherit;
  background-color: transparent;
  cursor: pointer;
}

a {
  text-decoration: none;
  color: inherit;
}

img {
  display: block;
  max-width: 100%;
  height: auto;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}

================================================================================
// File: src/main.jsx
================================================================================
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App.jsx';
import 'modern-normalize/modern-normalize.css';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

================================================================================
// File: src/styles/variables.css
================================================================================
:root {
  /*colors*/
  --color-white: #ffffff;
  --color-gray: #9e9e9e;
  --color-light: #f2f2f2;
  --color-dark: #212121;
  --color-red: #ff0000;
  --color-lightBlue: #87cefa;
  --color-mainBackground: linear-gradient(to bottom, #c9d6ff, #e2e2e2);
  --color-tagBackground: linear-gradient(to bottom, #ffd194, #d1913c);
  --color-accent: #2196f3;

  /*font*/
  --font-medium: 18px;
  --font-large: 22px;
  --font-small: 14px;

  /*shadow*/
  --shadow-regular: 0px 4px 10px 4px #9e9e9e;
  --shadow-medium: 0 9px 47px 11px rgba(51, 51, 51, 0.18);
  --shadow-small: 0 5px 7px -1px rgba(51, 51, 51, 0.23);

  /*animation*/
  --animation-cubicBezier: 0.25s cubic-bezier(0.7, 0.98, 0.86, 0.98);
}

