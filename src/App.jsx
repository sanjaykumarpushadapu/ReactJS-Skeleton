import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Lazy loading components
const Home = React.lazy(() => import('./components/Home'));
const About = React.lazy(() => import('./components/About'));
const PageNotFound = React.lazy(() => import('./components/PageNotFound'));
const AgGridSample = React.lazy(() => import('./components/AgGridSample'));

const App = () => {
  return (
    <Router>
      <div>
        <h1>React Web Skeleton</h1>

        {/* Suspense to show a fallback while loading components */}
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/grid" element={<AgGridSample />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
};

export default App;
