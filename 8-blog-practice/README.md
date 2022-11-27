# Blog Practice

## 디렉토리 파일 읽어와서 작업하기

파일에 있는 md파일을 읽어와서 렌더링하는 작업을 위해서 node.js의 FileSystem모듈을 이용해야 한다.

- readFile - 파일 읽어들이기
- readdir - 디렉토리 읽어들이기

`import path from 'path'`

`import fs from 'fs'`

```js
// post-utils.js
import path from 'path';
import fs from 'fs';
import matter from 'gray-matter'; // 스트링 또는 텍스트파일의 front-matter를 파싱해주는 라이브러리.

const postsDirectory = path.join(process.cwd(), 'posts'); // posts폴더에 있는 전체파일을 가져온다.

export const getPostsFiles = () => fs.readdirSync(postsDirectory);
/*
fs.readdirSync () 메서드 는 지정된 디렉터리의 내용을 동기식으로 읽는 데 사용됩니다.
이 메서드는 디렉터리에 있는 모든 파일 이름 또는 개체가 포함된 배열을 반환합니다.
옵션 인수는 파일이 메서드에서 반환되는 형식을 변경하는 데 사용할 수 있습니다. */

export const getPostData = (postIdentifier) => {
  const postSlug = postIdentifier.replace(/\.md$/, ''); // 파일이름에서 확장자 제거
  const filePath = path.join(postsDirectory, `${postSlug}.md`);
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  /*
  fs.readFileSync () 메서드 는 파일을 읽고 내용을 반환하는 데 사용되는 fs 모듈의 내장형 애플리케이션 프로그래밍 인터페이스입니다.
  fs.readFile() 메서드에서는 비차단 비동기 방식으로 파일을 읽을 수 있지만 fs.readFileSync() 메서드에서는 동기 방식으로 파일을 읽을 수 있습니다.  */
  const { data, content } = matter(fileContent); // matter는 두개의 프로퍼티를 갖는 객체를 반환.

  const postData = {
    slug: postSlug,
    ...data,
    content,
  };

  return postData;
};
```

<br/>

## 마크다운 렌더링하기

`npm install react-markdown`

```jsx
// post-content.js
import ReactMarkDown from 'react-markdown';
import Image from 'next/image';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

import PostHeader from './post-header';
import classes from './post-content.module.css';

const PostContent = (props) => {
  const { post } = props; // post는 [slug].js에서 props로 넘겨준 루트 - posts폴더에 있는 md파일임.
  const imagePath = `/images/posts/${post.slug}/${post.image}`;

  const customRenderers = {
    p(paragraph) {
      const { node } = paragraph;

      if (node.children[0].tagName === 'img') {
        const image = node.children[0];

        return (
          <div className={classes.image}>
            <Image
              src={`/images/posts/${post.slug}/${image.properties.src}`}
              alt={image.alt}
              width={600}
              height={300}
            />
          </div>
        );
      }

      return <p>{paragraph.children}</p>;
    },

    code(code) {
      const { className, children } = code;
      const language = className.split('-')[1];
      return (
        <SyntaxHighlighter
          style={atomDark}
          language={language}
          children={children}
        />
      );
    },
  };

  return (
    <article className={classes.content}>
      <PostHeader title={post.title} image={imagePath} />
      <ReactMarkDown components={customRenderers}>{post.content}</ReactMarkDown>
      {/* ReactMarkDown으로 감싸면 마크다운이 html로 제대로 출력될 수 있도록 해줌. */}
    </article>
  );
};

export default PostContent;
```

<br/>

## mongodb와 api라우트
