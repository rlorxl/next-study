# API route

API라우트란 특수한 형태의 url로 Next.js에 추가하여 데이터를 저장한 뒤 원하는 형태의 데이터를 돌려보내는 역할을 한다.
REST API와 같은 API를 Next.js에 포함함으로써 도메인 뒤에 붙는 url이나 경로 (/api/feedback)를 통해 http요청을 받을 수 있게 해주는 기능이다.

## 요청 보내기

fetch나 axios등으로 요청 보내기가 가능하고 put,post,get,delete와 같은 모든 요청 메서드에 대한 수행이 가능하다.
전반적인 방법은 Node.js, express와 거의 같고 pages폴더에 '📂api - 파일명.js'를 생성한다.

```jsx
// index.js에서 보내는 post요청
fetch('/api/feedback', {
  method: 'POST',
  body: JSON.stringify(reqBody),
  headers: { 'Content-Type': 'application/json' },
})
  .then((response) => response.json())
  .then((data) => console.log(data));
```

```jsx
// 📂api - feedback.js

import fs from 'fs';
import path from 'path';

const buildFeedbackPath = () => {
  return path.join(process.cwd(), 'data', 'feedback.json'); // 파일경로 (data폴더의 feedback.json파일)
};

const extractFeedback = (filePath) => {
  const fileData = fs.readFileSync(filePath); // 저장된 파일경로에서 먼저 파일을 읽는 작업.
  const data = JSON.parse(fileData); // JSON -> JavaScript
  return data;
};

const handler = (req, res) => {
  // 서버 측 코드
  if (req.method === 'POST') {
    console.log(req.body);
    const email = req.body.email;
    const feedbackText = req.body.text;

    const newFeedback = {
      id: new Date().toISOString(),
      email: email,
      text: feedbackText,
    };

    // 데이터베이스나 파일에 저장.
    const filePath = buildFeedbackPath();
    const data = extractFeedback(filePath);
    data.push(newFeedback);
    fs.writeFileSync(filePath, JSON.stringify(data)); // 데이터를 오버라이드 (경로, 데이터양식)
    res.status(201).json({ message: 'Success', feedback: newFeedback });
  } else {
    const filePath = buildFeedbackPath();
    const data = extractFeedback(filePath);
    res.status(200).json({ feedback: data });
  }
};

export default handler;
```

1.pages - api폴더의 하위로 **feedback.js파일을 생성**했다. url주소는 `localhost:3000/api/feedback`으로 접근 가능하다.

2.Node.js에서 **fs와 path를 임포트**한다.

3.handler함수의 매개변수로 **req, res**를 넘겨받을 수 있고 req.body에 접근 가능하다.

4.프로젝트 루트에 db용 파일로 **data - feedback.json을 생성**한다.

5.데이터를 파일에 저장하기 전에 명확히 하기 위해 먼저 **저장된 데이터들을 가져와서 파싱하고 그 후 오버라이드**하여 데이터를 저장한다.

6.post요청이 성공하면 데이터가 (여기서는 newFeedback) feedback.json파일에 저장된다.

> 사전렌더링에 API라우트 추가  
> 사전렌더링시 저장된 데이터를 사용하는 경우, 자체 API이기 때문에 getStaticProps나 getServerSideProps에 fetch함수를 사용할 수 없고 Node.js코드를 바로 실행해야 한다.

## 동적 API라우트

api - feedback.js와 같은 파일구조에서는 url경로가 /api/feedback 으로 오로지 단일경로만 생성할 수 있다.
/api/id01 과 같이 동적경로 세그먼트를 설정하려면 api폴더 하위에 '[]'로 감싼 파일을 만들어주어야 한다.

url 플레이스홀더값으로 인코딩된 구체적인 값에는 req,res객체를 통해 접근이 가능하고 `req.body`, `req.method`, `req.query`를 사용할 수 있다.
