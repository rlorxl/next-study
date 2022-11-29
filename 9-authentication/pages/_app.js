import { Provider } from 'next-auth/client';
import Layout from '../components/layout/layout';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}

/* getServerSideProps에서 가져온 세션이 있는 페이지만 useSession의 추가적인 세션 유효성검사를 건너뛰게 한다. session프로퍼티가 없는 페이지에는 정의되지 않는다. 
주의: 개발자도구 - 네트워크에서는 여전히 session요청이 가는것 처럼 보일 수 있음. 그래도 <Provider>로 감싸는 것을 권장함.(내부 코드 최적화)
*/

export default MyApp;
