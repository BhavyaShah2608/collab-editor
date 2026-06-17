import { useEffect, useState } from 'react';
import { HomePage } from './pages/HomePage';
import { DocumentPage } from './pages/DocumentPage';

function getPath() {
  return window.location.pathname;
}

export default function App() {
  const [path, setPath] = useState(getPath());

  useEffect(() => {
    const onPopState = () => setPath(getPath());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  if (path.startsWith('/doc/')) {
    return <DocumentPage documentId={path.split('/doc/')[1]} />;
  }

  return <HomePage navigate={setPath} />;
}