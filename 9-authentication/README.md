# Authentication

## 1.사용자 생성하기

form에서 email, password를 가지고 'api/auth/signin'으로 요청을 보낸다. (api route)

- pages - api - auth - signup.js

```js
const createUser = async (email, password) => {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong!');
  }

  return data;
};
```

(1)api라우트 파일에서는 메서드가 'POST'인지 확인하고

```js
if (req.method !== 'POST') {
  return; // 메서드가 POST가 아니라면 리턴.
}
```

(2)유효성 검사 후

(3)mongodb데이터 베이스에 연결하고

```js
const client = await connectToDatabase();

const db = client.db();
```

(4)이미 있는 유저인지 검사하고

(5)비밀번호를 암호화 하여

**데이터 암호화** `npm install bcryptjs`

```js
// lib - auth.js
import { hash } from 'bcryptjs';

export const hashPassword = async (password) => {
  // 프로미스로 암호화된 비밀번호를 반환.
  const hashedPassword = await hash(password, 12);
  // 암호화 정도(12): 클수록 함수 완료가 오래걸리고 작을수록 보안성이 낮음.

  return hashedPassword;
};
```

(6)최종적으로 db에 post를 보내 유저데이터를 저장한다.

```js
const result = await db.collection('users').insertOne({
  email: email,
  password: hashedPassword, // 암호화된 비밀번호
});

res.status(201).json({ message: 'Created user!' });
client.close();
```

<br/>

## 2.로그인

`import { signIn } from 'next-auth/client';`

`signIn`함수는 호출하면 로그인요청을 전송한다.

```js
const result = signIn('credentials', {
  redirect: false, // nextAuth가 사용될 때 api라우트에서 인증이 실패에서 에러가 반환되면 Next.js는 기본값으로 에러 페이지로 연결한다. 에러페이지로 연결되는것을 방지하기 위해 redirect를 false로 설정한다.
  email: enteredEmail,
  password: enteredPassword,
});
```

<br/>

## 3.로그아웃

`import { signOut } from 'next-auth/client';`

`singOut`을 호출하면 자동으로 쿠키와 세션정보들을 지워준다.

<br/>

## 4.사용자 인증하기

### NextAuth

`NextAuth` 패키지를 통해 사용자를 인증하고 사용자가 권한을 가지는지 여부를 확인할 수 있다.

아래 파일 확인바람!

- pages - api -auth - [...nextauth].js
- lib - auth.js

<br/>

## 5.세션 상태관리 (페이지 가드)

### useSession

`useSession` hook을 통해 로그인여부를 간단하게 체크할 수 있다.

useSession은 session과 loading정보가 담긴 배열을 return한다.

loading여부를 확인하여 로딩스피너와 같은 컴포넌트를 추가하거나 조건에 따라 ui를 제어할 수 있다.

활성화된 세션에 변화가 있으면 컴포넌트가 자동으로 업데이트 된다. (로그인/로그아웃 시)

`import { useSession } from 'next-auth/client';`

`const [session, loading] = useSession();`

console.log(loading, session)
<img width="951" alt="스크린샷 2022-11-29 오후 11 36 37" src="https://user-images.githubusercontent.com/90922593/204557816-855c159b-80a6-454b-aa48-e260f2701037.png">

### getSession

`useSession`이 가끔 에러낼 때가 있어서 그에대한 대안으로 `getSession`을 사용할 수 있다.

`useSession`과의 차이점은 `getSession`은 새로운 요청을 보내서 최근 세션 데이터를 가져온다.
그리고 서버사이드와 클라이언트 양쪽에서 모두 사용할 수 있다. (useSession은 클라이언트 사이드에서만 사용가능.)

getSession을 사용한 리디렉션 처리 (클라이언트 사이드에서)

```js
// components - profile - user-profile
useEffect(() => {
  getSession().then((session) => {
    // 프로미스를 반환한다. session유무에 따른 제어.
    if (!session) {
      window.location.href = '/auth'; // useRouter를 이용해도 됨!
    } else {
      setIsLoading(false);
    }
  });
}, []);
```

> **session**
> 여기서 계속 언급되는 session은 JSON 웹 토큰을 말한다. JSON 웹 토큰은 NextAuth가 자동으로 관리하고 NextAuth가 브라우저에 저장하는 대상으로 브라우저에는 이 토큰을 가진 쿠키가 생성된다. 이 쿠키와 저장된 토큰을 통해 사용자의 로그인 여부를 확인해서 활성화된 세션인지를 결정한다.

<br/>

## 5-1.서버사이드 페이지 가드 추가하기

인증되지 않은 상태에서 프로필 페이지 접근시 잠깐 뜨는 로딩화면도 띄우지 않고 싶은 경우,
클라이언트 사이드 코드만으로는 제거하기 어렵다. (페이지 방문시 인증여부를 확인하는 동안 기다리는 시간이 발생.)

이 경우 서버사이드 코드를 사용해 인증여부를 확인해야 한다.

클라이언트 사이드에서 리디렉션 코드를 지우고 `getServerSideProps`를 추가한다.

페이지가 렌더링되기 이전에 서버에서 처리되기 때문에 불필요한 로딩스피너, 화면 깜빡임을 없앨 수 있다.

```js
import { getSession } from 'next-auth/client';
import UserProfile from '../components/profile/user-profile';

function ProfilePage() {
  return <UserProfile />;
}

export const getServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });

  // 세션이 없을 때 처리
  if (!session) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false, // 영구적인지 아닌지
      },
    };
  }

  return {
    props: { session },
  };
};

export default ProfilePage;
```

<br/>

## 6.API라우트 보호

클라이언트사이드 코드로 특정 페이지 접근을 막는것 외에도 API라우트에 접근하는 것도 보호되어야할 필요가 있다.
사용자 인터페이스를 제어한다고 하더라도 인증되지 않은 사용자가 다른 도구를 이용해 요청을 보낼 수 있기 떄문이다.
프로젝트에 API라우트가 있다면 해당 API라우트는 인증된 사용자가 보낸 요청인지 여부를 확인해야 한다.

예를 들어 사용자페이지에서 비밀번호 변경 요청을 해야 하는 경우 비밀번호 변경요청 로직 이전에 인증된 사용자 여부를 검증해야 한다.

비밀번호 변경 요청 전용 API라우트

```js
const session = await getSession({ req: req }); // 쿠키에 토큰 확인

// 인증되지 않은 사용자의 api라우트 접근 제어.
if (!session) {
  res.status(401).json({ message: 'Not authenticated!' });
  return;
}
```
