import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import TopicView from './pages/TopicView';
import EntryDetail from './pages/EntryDetail';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Landing from './pages/Landing';
// import Pricing from './pages/Pricing';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false, // Prevents refetching every time you switch apps on mobile
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Landing />} />
            {/* <Route path="/pricing" element={<Pricing />} /> */}
            <Route path="/app" element={
              <PrivateRoute>
                <MainLayout />
              </PrivateRoute>
            }>
              <Route index element={<Home />} />
              <Route path="topic/:id" element={<TopicView />} />
              <Route path="entry/:id" element={<EntryDetail />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
