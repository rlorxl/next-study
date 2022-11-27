import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';

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
  const { data, content } = matter(fileContent); // matter는 두개의 프로퍼티를 갖는 객체를 반환한다.

  const postData = {
    slug: postSlug,
    ...data,
    content,
  };

  return postData;
};

export const getAllPosts = () => {
  const postFiles = getPostsFiles();

  const allPosts = postFiles.map((postFile) => {
    return getPostData(postFile);
  });

  const sortedPosts = allPosts.sort((postA, postB) =>
    postA.date > postB.date ? -1 : 1
  ); // 최근 게시물이 더 앞에 오도록 정렬

  return sortedPosts;
};

export const getFeaturedPosts = () => {
  const allPosts = getAllPosts();

  const featuredPosts = allPosts.filter((post) => post.isFeatured);

  return featuredPosts;
};
