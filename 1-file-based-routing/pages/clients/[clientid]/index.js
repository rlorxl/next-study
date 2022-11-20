import { useRouter } from 'next/router';

const ClinetProjectsPage = () => {
  const router = useRouter();
  console.log(router.query);

  const loadProjectHandler = () => {
    // load data...
    // router.push('/clients/max/project1')
    router.push({
      pathname: '/clients/[id]/[clientprojectid]',
      query: { id: 'max', clientprojectid: 'project1' },
    });
    // router.replace('/clients/max/project1')
  };

  return (
    <div>
      <h1>Projects of a Given Client</h1>
      <button onClick={loadProjectHandler}>Load Project A</button>
    </div>
  );
};

export default ClinetProjectsPage;
