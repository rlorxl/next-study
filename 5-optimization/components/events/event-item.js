import Image from 'next/image';

import Button from '../ui/button';
import DateIcon from '../icons/date-icon';
import AddressIcon from '../icons/address-icon';
import ArrowRightIcon from '../icons/arrow-right-icon';
import styles from './event-item.module.css';

const EventItem = (props) => {
  const { title, image, date, location, id } = props;

  const readableDate = new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const formmatedAddress = location.replace(',', '/n');

  const exploreLink = `/events/${id}`;

  return (
    <>
      <li className={styles.item}>
        <Image src={'/' + image} alt={title} width={250} height={160} />
        {/* <img src={'/' + image} alt={title} />{' '} */}
        {/* 그냥 '/'만 붙여도 public폴더의 정적 콘텐츠로 인식됨. */}
        <div className={styles.content}>
          <div className={styles.summary}>
            <h2>{title}</h2>
            <div className={styles.date}>
              <DateIcon />
              <time>{readableDate}</time>
            </div>
            <div className={styles.address}>
              <AddressIcon />
              <address>{formmatedAddress}</address>
            </div>
          </div>
          <div className={styles.actions}>
            <Button link={exploreLink}>
              <span>Explore Event</span>
              <span className={styles.icon}>
                <ArrowRightIcon />
              </span>
            </Button>
          </div>
        </div>
      </li>
    </>
  );
};

export default EventItem;
