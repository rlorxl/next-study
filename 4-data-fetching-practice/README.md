## 데이터 페칭 최적화

### 동적 매개변수 작업시 getStaticPath 최적화

```jsx
export const getStaticPaths = async () => {
  const events = await getAllEvents();

  const paths = events.map((event) => ({ params: { eventId: event.id } }));

  return {
    paths: paths,
    fallback: false,
  };
};
```

getAllEvents로 모든 이벤트를 페칭하는것에는 문제가 있다. 모든 이벤트 (getAllEevents)를 페칭함면 실제 페이지일 경우 수백수천개의 이벤트가 표시될 것이다.
모든 이벤트를 페칭해서 페이지를 전부 사전생성하는것은 불필요하며 성능이슈도 발생할 수 있다. 현실적으로는 주된 이벤트만 사전 렌더링해야 한다. (실제 방문율과 관련있는 페이지)

하지만 이때 일부 페이지는 사전생성되지 않고 404에러가 나올 것이다. 지금 준비된 페이지보다 더 많이 필요하다고 알리는 설정이 필요하다.

이를 해결하기 위해 fallback설정을 'true'로 설정해야 한다. ('blocking'으로 설정해도 된다. 사용자 경험의 차이만 있을 뿐 정상 동작한다.) 그러면 사전생성되지않은 페이지를 발견할 경우에도 동적으로 페이지를 생성할 수 있다.

👉

```jsx
export const getStaticPaths = async () => {
  const events = await getFeaturedEvents();

  const paths = events.map((event) => ({ params: { eventId: event.id } }));

  return {
    paths: paths,
    fallback: true,
  };
};
```
