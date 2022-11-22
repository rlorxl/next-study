# Nextjs 최적화

## 1.Head콘텐츠 추가

`import Head from 'next/head'` 로 html의 head태그를 추가할 수 있다.
jsx문 내에서 `<Head>`태그로 사용가능하고 html head태그 안에 들어가는 어떤 요소든 추가할 수 있다.
meta태그의 description은 검색엔진에서 검색 결과를 출력할 때 같이 나오는 설명이다.
또한 제목을 하드 코딩하는 대신 props.event.title과 같은 동적값도 사용할 수 있다.

```jsx
return (
  <>
    <Head>
      <title>All Events</title>
      <meta
        name='description'
        content='Find a lot of great events that allow you to evolve...'
      />
    </Head>
    <EventsSearch onSearch={findEventsHandler} />
    <EventList items={events} />
  </>
);
```

<br/>

### 공용 Head 설정

\_app.js를 활용하면 공통 Head를 설정할 수 있다. 여기에 추가한 Head태그는 페이지(컴포넌트)의 고유 데이터로 덮어쓸 수 있고 고유 데이터가 없을 시 \_app.js에 설정된 공통 Head가 들어간다.

```jsx
import Head from 'next/head';
import Layout from '../components/layout/layout';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Head>
        <title>Next Events</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      <Component {...pageProps} />;
    </Layout>
  );
}

export default MyApp;
```

<br/>

## 2.\_document.js

Next.js 에서 오로지 \_app.js로만 애플리케이션의 전반적 설정을 할 수 있는것은 아니다.
`_document.js`파일로도 이와 비슷한 설정을 할 수 있다.

\_app.js와 같은 루트레벨에 \_document.js 파일을 추가하면 되고 \_document.js는 전체 html문서를 커스터마이징할 수 있게 해준다. (html문서를 구성하는 모든 요소에 대한)

```jsx
// _document.js
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang='en'>
        <Head>
          <body>
            {/* 애플리케이션 컴포넌트 트리 외부에 추가적인 요소 추가 (portal등에 활용) */}
            <div id='overlays' />
            <Main />
            <NextScript />
          </body>
        </Head>
      </Html>
    );
  }
}

export default MyDocument;
```

<br/>

## 3.이미지 최적화 (newt/image 컴포넌트)

Next.js에서는 이미지를 최적화하는 간단한 기능을 제공한다.

`import Image from 'next/image'`

`<Image src={'/' + image} alt={title} width={250} height={160} />`

Image를 임포트 후 img태그가 들어갈 곳에 Image로 작성하고 width,height값을 설정해주면 된다. (여기에 설정된 width, height보다는 css에 설정된 스타일값이 일단 우선됨.)

Next.js의 Image는 'lazy loading'을 지원한다. 화면에서 이미지가 보이지 않는 상태에서는 다운로드 하지 않기 때문에 손쉽게 이미지 최적화를 할 수 있는 장점이 있다.

공식 문서의 next/image를 참고하면 더 다양한 프로퍼티를 통해 이미지 로딩방식을 구성하는 방법이 나와있다.

https://nextjs.org/docs/api-reference/next/image
