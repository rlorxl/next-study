import { useEffect, useState } from 'react';
import useSWR from 'swr';

const LastSalesPage = (props) => {
  const [sales, setSales] = useState(props.sales); // 사전 렌더링된 데이터를 초기 상태로 사용.
  // const [isLoading, setIsLoading] = useState(false);

  // useSWR훅 - 컴포넌트 로딩 후 url로 요청전송되고 데이터가 훅으로 반환.
  const { data, error } = useSWR(
    'https://zoala-next-study-default-rtdb.firebaseio.com/sales.json',
    (url) => fetch(url).then((res) => res.json())
  );

  // // data변환만 담당하는 useEffect
  useEffect(() => {
    if (data) {
      console.log(data);
      const transformedSales = [];

      for (const key in data) {
        transformedSales.push({
          id: key,
          username: data[key].username,
          volume: data[key].volume,
        });
      }

      setSales(transformedSales);
    }
  }, [data]);

  // useEffect(() => {
  //   setIsLoading(true);
  //   fetch('https://zoala-next-study-default-rtdb.firebaseio.com/sales.json')
  //     .then((response) => response.json())
  //     .then((data) => {
  //       const transformedSales = [];

  //       for (const key in data) {
  //         transformedSales.push({
  //           id: key,
  //           username: data[key].username,
  //           volume: data[key].volume,
  //         });
  //       }

  //       setSales(transformedSales);
  //       setIsLoading(false);
  //     });
  // }, []);

  if (error) {
    return <p>Failed to load.</p>;
  }

  if (!data && !sales) {
    return <p>Loading...</p>;
  }

  return (
    <ul>
      {sales.map((sale) => (
        <li key={sale.id}>
          {sale.username} - ${sale.volume}
        </li>
      ))}
    </ul>
  );
};

// 클라이언트 사이드 데이터 페칭 + 사전 렌더링 결합 -> 시작부터 일부 데이터를 가지고 시작하게 하기 위해서.
export const getStaticProps = async () => {
  const response = await fetch(
    'https://zoala-next-study-default-rtdb.firebaseio.com/sales.json'
  );
  const data = await response.json();

  const transformedSales = [];

  for (const key in data) {
    transformedSales.push({
      id: key,
      username: data[key].username,
      volume: data[key].volume,
    });
  }

  return {
    props: { sales: transformedSales },
    // revalidate: 10,
  };
};

export default LastSalesPage;
