import { useContext } from 'react';
import Notification from '../ui/notification';
import NotificationContext from '../../store/notification-context';

import MainHeader from './main-header';

const Layout = (props) => {
  const notiCtx = useContext(NotificationContext);
  const activeNotification = notiCtx.notification;
  return (
    <>
      <MainHeader />
      <main>{props.children}</main>
      <Notification
        title={activeNotification?.title}
        message={activeNotification?.message}
        status={activeNotification?.status}
      />
    </>
  );
};

export default Layout;
