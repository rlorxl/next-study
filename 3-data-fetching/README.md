# Data Fetching

## 1.정적생성

- 빌드되는 동안 모든 페이지가 사전 생성됨. (권장)
- 동적 데이터가 없는 모든 페이지를 사전 렌더링한다.
- 빌드 프로세스중 실행되므로 브라우저에서 실행되지 않는 Node.js코드를 실행할 수 있다.

### 사전생성할 페이지 지정하기

`export async function getStaticProps(context) { ... }`

- 📂pages - 📂component 내부 파일에 위치해야하고 특수한 비동기 함수인 `getStaticProps`를 가져온다.
- getStaticProps함수는 페이지가 사전 생성되어야하는 페이지임을 Next.js에 알려준다. 파일에 이 함수가 있으면 먼저 이 함수가 실행되고 난 뒤 컴포넌트 함수가 실행된다.
- getStaticProps에서는 일반적으로 서버 사이드에서 실행되는 모든 코드를 실행할 수 있다.
- getStaticProps는 프로미스를 반환하므로 ‘await’키워드를 쓸 수 있다.
- getStaticProps는 props 키를 포함한 객체를 반환해야 한다.
- getStaticProps내에 작성한 코드는 클라이언트에게 재전송되는 코드로 포함되지 않는다.

```jsx
import path from 'path';
import fs from 'fs/promises';

const HomePage = (props) => {
  const { products } = props;

  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>{product.title}</li>
      ))}
    </ul>
  );
};

// 컴포넌트에 대한 props객체를 사전 구성한다.
export const getStaticProps = async () => {
  const filePath = path.join(process.cwd(), 'data', 'dummy-backend.json');
  const jsonData = await fs.readFile(filePath);
  const data = JSON.parse(jsonData);

  return {
    props: {
      products: data.products, // 컴포넌트에서 props.products로 불러올 수 있다.
    },
  };
};

export default HomePage;
```

- cwd: 현재 작업 디렉토리  
  이때 현재 작업디렉토리는 pages폴더가 아님. 파일이 실행될 때 Next.js는 모든 파일이 루트에 있는 것처럼 취급하기 때문에 현재 작업 디렉토리는 pages폴더가 아닌 전체 프로젝트 폴더이다. ','뒤의 'data'가 현재 작업 디렉토리에서 시작해 data디렉토리로 가는 경로를 구축해야한다는 의미.
- readFile은 파일을 동기적으로 읽고 완료될때까지 실행을 차단한다.

<br />

### 자주 변경되는 데이터가 있는 경우

자주 변경되는 데이터가 있는 경우 매번 페이지를 다시 빌드하고 배포해야 한다면 매우 번거로울 것이다.
Next.js는 이에 대한 해결책을 제공한다.

#### 1.useEffect 이용

페이지를 사전 빌드하지만 서버에서 업데이트된 데이터 페칭을 위해 표준 리액트 코드를 포함한다.
항상 사전 렌더링된 데이터를 일부 포함해 페이지를 제공하면서 백그라운드에서 최신 데이터를 페칭해 새로운 데이터 도착 후 로드된 페이지를 업데이트.

#### 2.ISR (Incremental Static Regeneration)

페이지를 빌드할 때 정적으로 한번만 생성되는 것이 아니라 배포 후 재배포 없이 계속 업데이트 되도록 할 수 있다.  
최대 X초마다 들어오는 모든 요청에 대해 페이지를 재생성 하도록 한다. 지정한 초마다 페이지가 서버에서 사전 생성, 업데이트 되어 가장 최신의 페이지를 제공할 수 있다.

getStaticProps에 props를 반환하는 것과 동시에 `revalidate`키를 추가하고 값으로 시간을 초 단위로 설정한다.

```jsx
return {
  props: {
    products: data.products,
  },
  revalidate: 60,
};
```

다시 build한 후
<img width="837" alt="스크린샷 2022-11-22 오전 1 38 41" src="https://user-images.githubusercontent.com/90922593/203110489-6278c2e7-f6e2-4d97-a82d-cf0760ca61b9.png">

<br/>

### getStaticProps 옵션

#### 1.리디렉션

```jsx
if (!data) {
  return {
    redirect: {
      destination: '/no-data',
    },
  };
}
```

#### 2.notFound

```jsx
if (data.products.length === 0) {
  return { notFound: true };
}
```

<br/>

### 동적 매개변수 작업하기

getStaticProps함수의 context객체의 프로퍼티를 이용할 수 있다.

**params객체**
params는 Next.js가 제공하는 context객체의 프로퍼티 중 하나이며 키-값 쌍이 있는 객체이고 이때 키의 식별자는 동적 경로 세그먼트이다.

```jsx
// [productId].js
export const getStaticProps = async (context) => {
  const { params } = context;

  const productId = params.projectId; // params객체의 키값이 현재 경로 세그먼트인 객체

  const filePath = path.join(process.cwd(), 'data', 'dummy-backend.json');
  const jsonData = await fs.readFile(filePath);
  const data = JSON.parse(jsonData);

  const product = data.products.find((product) => product.id === productId);

  return {
    props: {
      loadedProduct: product,
    },
  };
};
```

> **중요한 점**  
> 기본적으로 Next.js는 모든 페이지를 사전생성하는데 동적 페이지에서는 그렇지 않다. (컴포넌트이름에 대괄호가 있는 페이지)  
> 해당 페이지로 연결되는 동적 세그먼트가 있는 경우 기본 동작으로 페이지를 사전생성하지 않는다. (엄밀히 따지면 페이지가 하나가 아닌 여러 페이지로 이루어져 있기 때문)  
> → 동적페이지에서 어떤 인스턴스가 사전생성되어야 하는지 알려주어야 함.

<br/>

### getStaticPath()

`export async function getStaticPaths() { ... }`

- getStaticPath()내부의 `paths`객체를 통해 동적 페이지가 사전생성되어야 하는 횟수와 페이지가 가져야 하는 값을 알릴 수 있다.
- getStaticProps()와 마찬가지로 page의 컴포넌트 파일에만 추가할 수 있다.

```jsx
export const getStaticPaths = async () => {
  return {
    paths: [
      { params: { pid: 'p1' } },
      { params: { pid: 'p2' } },
      { params: { pid: 'p3' } },
    ],
    fallback: false,
  };
};
```

<br/>

> **fallback**  
> `fallback`키는 사전생성되어야 할 페이지가 많을 때 도움을 준다.
> 많은 페이지를 사전생성하면 시간이 오래걸리고, 페이지가 많은 블로그 같은 경우에 접근이 거의없는 페이지를 사전생성하는것은 비효율적인 일일 것이다.
> fallback의 값을 true로 설정하면 일부 페이지만 사전에 렌더링할 수 있게 해준다.
>
> ```jsx
> export const getStaticPaths = async () => {
>   return {
>    paths: [
>      { params: { pid: 'p1' } },
>    ],
>    fallback: true,
> };
> ```
>
> (+) fallback의 값을 boolean이 아닌 'blocking'으로 설정하는 경우 컴포넌트에서는 폴백 확인을 하지 않고 페이지에서 서비스를 제공하기 전에 서버에 완전히 사전생성되도록 기다린다. 이 경우 시간은 조금 더 걸릴 수 있지만 정상작동한다. 사용자에게 불완전한 페이지를 보여주고 싶지 않은 경우 'blocking'으로 설정하는것이 나은 선택이 될 수도 있다.

<br/>

---

## 2.SSR (Server Side Rendering)

- 배포 후 요청이 서버까지 오는 시점에 페이지가 생성됨.(빌드 중X)
  - 유입되는 모든 요청에 대한 페이지를 사전 렌더링함.
  - 프로젝트 생성전에 불러오는게 아닌 요청이 있을 때만 실행.
- 콘텍스트 객체에 접근할 수 있는 데이터의 종류가 `getStaticProps` 와 다름.
  - 요청(req), 응답(res)객체 접근 가능.
- 동적페이지 작업시 getStaticPath사용할 필요 없음.

### getServerSideProps()

`export async function getServerSideProps(context) { ... }`

서버 사이드 렌더링 방식은 동적 매개변수 파일을 작업시에 getStaticPath와 같은 함수를 사용할 필요가 없다.

`getServerSideProps()`는 서버에서만 작동하므로 아무 페이지도 사전 생성할 필요가 없고 getStaticPaths 정보도 필요하지 않다. (서버 사이드 코드에서 모든 요청을 처리하기 때문에 사전 생성, 동적경로 설정할 필요가 없음.)

빌드한 후 콘솔확인
<img width="828" alt="스크린샷 2022-11-22 오후 5 56 44" src="https://user-images.githubusercontent.com/90922593/203270070-eafdeebd-c1e1-4a3d-87a6-7d75393d9e36.png">

- λ 람다(lambda) 기호가 있는 페이지들은 사전생성하지 않고 서버측에서 사전렌더링 되었다는 뜻.

<br/>

## 클라이언트 사이드 데이터 페칭 (Client Side Data-fetching)

Next js로 개발하다다 보면 때때로 사전 렌더링이 필요가 없거나 사전 렌더링을 할 수 없는 데이터를 다루게 되는 경우가 있다. 이런 경우엔 사전 렌더링보다는 사용자가 페이지에 방문할 때만 불러오도록 해야 한다. (클라이언트에서 코드가 실행될 때 기존처럼 컴포넌트에서 데이터를 가져오도록!)

- 갱신 주기가 잦은 데이터 (매초마다 여러번 변경되어야하는)
- 특정 유저에만 한정되는 데이터 (온라인 쇼핑몰 최근 주문내역과 같이 접속하자마자 처음부터 데이터가 없어도 괜찮고 약간 기다려도 괜찮은 페이지)
- 데이터의 일부분만 표시해야하는 경우

### 클라이언트 사이드 데이터 페칭과 사전 렌더링 결합하기

클라이언트 사이드 데이터 페칭과 함께 사전 렌더링으로 일부 데이터를 가지고 시작함으로써 사용자 경험을 높이고 검색엔진 최적화를 할 수 있다.

```jsx
import { useEffect, useState } from 'react';
import useSWR from 'swr';

const LastSalesPage = (props) => {
  const [sales, setSales] = useState(props.sales); // 사전 렌더링된 데이터를 초기 상태로 사용.
  // const [isLoading, setIsLoading] = useState(false);

  // useSWR훅 사용 - 컴포넌트 로딩 후 url로 요청전송되고 데이터가 훅으로 반환.
  const { data, error } = useSWR(
    'https://zoala-next-study-default-rtdb.firebaseio.com/sales.json',
    (url) => fetch(url).then((res) => res.json())
  );

  // useEffect는 data변환만 담당한다.
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
```

페이지 소스에서 초기 데이터 확인
<img width="928" alt="스크린샷 2022-11-22 오후 7 47 49" src="https://user-images.githubusercontent.com/90922593/203295014-4d5584a7-be0d-47f7-be1e-dc2954de1be1.png">
