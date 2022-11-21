import { useRouter } from 'next/router';
import { getFilteredEvents } from '../../dummy-data';
import EventList from '../../components/events/event-list';
import ResultsTitle from '../../components/events/results-title';
import Button from '../../components/ui/button';
import ErrorAlert from '../../components/ui/error-alert';

const FilteredEventsPage = () => {
  const router = useRouter();

  const filterData = router.query.slug;

  /* useRouter훅은 컴포넌트가 첫 번째 렌더링을 마친 후에 실행된다. 
  router.query는 데이터에 접근이 되기 전에는 undefined인 상태다.
  데이터에 접근이 되기 전 상태일 때는 로딩텍스트를 렌더링한다. */
  if (!filterData) {
    return <p className='center'>Loading...</p>;
    // 'center'클래스는 global.css파일에 정의된 css클래스이기 때문에 일반 문자열로 정의한다.
  }

  const filteredYear = filterData[0];
  const filteredMonth = filterData[1];

  const numYear = +filteredYear;
  const numMonth = +filteredMonth;

  // url에 수기로 입력했을 때 대안 (numYear, numMonth가 문자열일 때의 경우, 잘못된 날짜경로 입력시)
  if (
    isNaN(numYear) ||
    isNaN(numMonth) ||
    numYear > 2030 ||
    numYear < 2021 ||
    numMonth < 1 ||
    numMonth > 12
  ) {
    return (
      <>
        <ErrorAlert>
          <p>Invalid filter. Please adjust your values!</p>
        </ErrorAlert>
        <div className='center'>
          <Button link='/events'>Show All Events</Button>
        </div>
      </>
    );
  }

  const filteredEvents = getFilteredEvents({
    year: numYear,
    month: numMonth,
  });

  if (!filteredEvents || filteredEvents.length === 0) {
    return (
      <>
        <ErrorAlert>
          <p>No events found for the chosen filter!</p>
        </ErrorAlert>
        <div className='center'>
          <Button link='/events'>Show All Events</Button>
        </div>
      </>
    );
  }

  const date = new Date(numYear, numMonth - 1);

  return (
    <>
      <ResultsTitle date={date} />
      <EventList items={filteredEvents} />
    </>
  );
};

export default FilteredEventsPage;
