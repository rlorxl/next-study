# File Based Routing

기본적으로 pages 폴더 하위의 폴더구조와 파일명에 기반한 라우팅을 지원한다.
폴더를 만들고 url에 '/폴더명'으로 입력함면 페이지 전환이 된다.

<br/>

### 중첩 경로

```
📂pages
  ㄴ 📂portfolio
    ㄴ index.js
    ㄴ list.js
```

list.js파일의 라우팅은 '/portfolio/list'로 할 수 있다.

<br/>

### 동적 라우트

동적 라우팅의 파일이름은 대괄호([])안에 사용자 지정 이름을 쓸 수 있고 `'/폴더명/아무 이름'`으로 라우팅할 수 있다.

```jsx
//📂portfolio - [projectid].js

import { useRouter } from 'next/router';

const PortfolioProjectPage = () => {
  const router = useRouter();

  console.log(router.pathname); // /portfolio/[projectid]
  console.log(router.query); // 지정한 이름이 출력된다. -> {projectid: '1'}

  return <div>Portfolio Project Page</div>;
};

export default PortfolioProjectPage;
```

<br/>

### 중첩된 동적 경로

```
📂pages
  ㄴ 📂clients
    ㄴ 📂[clientid] // 폴더명을 대괄호로 감싼다.
      ㄴ [clientprojectid].js  → /clients/1/project01
      ㄴ index.js  →  /clients/1
    ㄴ index.js  →  /clients
```

```jsx
// 📂clients - 📂[clientsid] - [clientprojectid].js

import { useRouter } from 'next/router';

const SelectedClientProjectPage = () => {
  const router = useRouter();

  console.log(router.query); // {clientid: '1', clientprojectid: 'project1'}

  return (
    <div>The Project page for a specific project for a selected client</div>
  );
};

export default SelectedClientProjectPage;
```

<br/>

### Catch-All 라우트

모든 라우트를 한번에 확보하는 방식.
어떤 경로이든, 얼마나 많은 세그먼트를 갖는지 상관없이 항상 동일한 컴포넌트를 불러온다.

파일이름은 `[...id].js`와 같이 앞에 '...'을 작성한다.

Next.js는 경로로 무엇이 붙뜬 페이지를 렌떠링하고 쿼리 객체에는 배열을 생성한다.

```
📂blog
  ㄴ [...id].js
```

일때 `/blog/whatever/you/want`로 경로를 입력하면 쿼리 객체의 값은 `{id: Array(3)}`이고 배열은['whatever', 'you', 'want']이런식으로 구성된다.

<br/>

### Link컴포넌트로 동적 내비게이팅

```jsx
import Link from 'next/link';
const ClientPage = () => {
  const clients = [
    { id: 'max', name: 'Maximilian' },
    { id: 'manu', name: 'Manuel' },
  ];

  return (
    <>
      <h1>Clients Page</h1>
      <ul>
        {clients.map((client) => (
          <li key={client.id}>
            <Link href={`/clients/${client.id}`}>{client.name}</Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default ClientPage;
```

<br/>

#### href의 값 문자열의 대안

Link href의 값으로 문자열 대신 특정 객체를 설정할 수 있다.

```jsx
<Link
  href={{
    pathname: '/clients/[id]',
    query: { id: clients.id },
  }}
>
  {client.name}
</Link>
```

<br/>

#### 명령형 내비게이팅

`router.push()`

```jsx
const loadProjectHandler = () => {
  router.push({
    pathname: '/clients/[id]/[clientprojectid]',
    query: { id: 'max', clientprojectid: 'project1' },
  });
  // router.push('/clients/max/project1')
  // router.replace('/clients/max/project1') -> 대체
};
```
