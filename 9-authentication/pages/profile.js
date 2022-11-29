import { getSession } from 'next-auth/client';
import UserProfile from '../components/profile/user-profile';

function ProfilePage() {
  return <UserProfile />;
}

export const getServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });

  if (!session) {
    // session = json web token
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
