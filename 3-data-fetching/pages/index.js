import path from 'path';
import fs from 'fs/promises';
import Link from 'next/link';

const HomePage = (props) => {
  const { products } = props;

  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>
          <Link href={`/products/${product.id}`}>{product.title}</Link>
        </li>
      ))}
    </ul>
  );
};

const getData = async () => {
  const filePath = path.join(process.cwd(), 'data', 'dummy-backend.json');
  const jsonData = await fs.readFile(filePath);
  const data = JSON.parse(jsonData);
  return data;
};

export const getStaticProps = async () => {
  console.log('Re-Generating...');

  const data = await getData();

  // data가 없으면 리디렉션 실행.
  if (!data) {
    return {
      redirect: {
        destination: '/no-data',
      },
    };
  }

  // data length가 0이면 404페이지 렌더링.
  if (data.products.length === 0) {
    return { notFound: true };
  }

  return {
    props: {
      products: data.products,
    },
    revalidate: 10,
  };
};

export default HomePage;
