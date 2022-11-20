import { useRouter } from 'next/router';

const BlogPostsPage = () => {
  const router = useRouter();

  console.log(router.query); // {id: Array(1)}
  return <div>Blog Posts Page</div>;
};

export default BlogPostsPage;
