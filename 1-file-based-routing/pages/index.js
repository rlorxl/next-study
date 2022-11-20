import Link from 'next/link';

const HomePage = () => {
  return (
    <div>
      <h1>Home</h1>
      <ul>
        <li>
          <Link replace href='/portfolio'>
            Portfolio
          </Link>
        </li>
        <li>
          <Link href='/clients'>Clents</Link>
        </li>
      </ul>
    </div>
  );
};

export default HomePage;
