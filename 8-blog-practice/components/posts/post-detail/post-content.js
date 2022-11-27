import ReactMarkDown from 'react-markdown';
import Image from 'next/image';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

import PostHeader from './post-header';
import classes from './post-content.module.css';

const PostContent = (props) => {
  const { post } = props;
  const imagePath = `/images/posts/${post.slug}/${post.image}`;

  const customRenderers = {
    // img(image) {
    //   return (
    //     <Image
    //       src={`/images/posts/${post.slug}/${image.src}`}
    //       alt={image.alt}
    //       width={600}
    //       height={300}
    //     />
    //   );
    // },

    // 렌더링할 이미지가 있는 부분만 오버라이드하고 다른 단락은 그대로 둔다.
    p(paragraph) {
      const { node } = paragraph;

      if (node.children[0].tagName === 'img') {
        // node 첫번재 자식이 img태그인지 확인
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
      {/* ReactMarkDown으로 감싸면 마크다운이 html로 제대로 출력될 수 있도록 해줌. 
      renders는 마크다운을 리액트 코드로 렌더링될 수 있게 바꿔주는 프로퍼티.
      */}
    </article>
  );
};

export default PostContent;
