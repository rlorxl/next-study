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
