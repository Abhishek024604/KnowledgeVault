import { Outlet, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Plus, LayoutGrid, Library, Settings, LogOut, Menu, X as XIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import SaveEntryPanel from '../components/SaveEntryPanel';

export default function MainLayout() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [shareData, setShareData] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const share_title = searchParams.get('share_title');
    const share_text = searchParams.get('share_text');
    const share_url = searchParams.get('share_url');
    
    if (share_title || share_text || share_url) {
      setShareData({ title: share_title || '', text: share_text || '', url: share_url || '' });
      setIsPanelOpen(true);
      
      // Clean up the URL
      searchParams.delete('share_title');
      searchParams.delete('share_text');
      searchParams.delete('share_url');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const { data: topics = [] } = useQuery({
    queryKey: ['topics'],
    queryFn: async () => {
      const res = await api.get('/topics');
      return res.data;
    }
  });

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Brutalist styling with sharp borders */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 border-r-2 border-foreground flex flex-col bg-card transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 border-b-2 border-foreground flex items-center justify-between">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="font-bold text-xl tracking-tight flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-primary brutal-border inline-block"></span>
            Knoledge
          </Link>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden p-1 brutal-border">
            <XIcon size={20} />
          </button>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto">
          <nav className="space-y-6">
            <div>
              <p className="text-xs font-bold uppercase text-muted-foreground mb-2">Library</p>
              <ul className="space-y-1">
                <li>
                  <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 p-2 hover:bg-muted font-medium brutal-border">
                    <LayoutGrid size={18} />
                    All topics
                  </Link>
                </li>
                <li>
                  <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 p-2 hover:bg-muted font-medium">
                    <Library size={18} />
                    Revisit queue
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-bold uppercase text-muted-foreground mb-2 flex justify-between">
                Topics
                <span className="text-foreground">{topics.length}</span>
              </p>
              <ul className="space-y-1">
                {topics.map((topic) => (
                  <li key={topic.id}>
                    <Link to={`/topic/${topic.id}`} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 p-2 hover:bg-muted text-sm font-medium break-words">
                      <span className={`w-2 h-2 rounded-full ${topic.color || 'bg-primary'} shrink-0`}></span>
                      <span className="truncate">{topic.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        <div className="p-4 border-t-2 border-foreground">
          <button onClick={handleLogout} className="flex items-center gap-2 p-2 w-full hover:bg-muted font-medium text-left">
            <LogOut size={18} />
            Log out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative h-full w-full overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 border-b-2 border-foreground flex items-center justify-between px-3 md:px-6 bg-card shrink-0 gap-2">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 brutal-border bg-muted flex items-center justify-center shrink-0"
          >
            <Menu size={20} />
          </button>

          <div className="flex-1 max-w-xl min-w-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hidden sm:block" size={18} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full sm:pl-10 px-3 py-2 bg-transparent brutal-border outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-muted-foreground text-sm sm:text-base"
              />
            </div>
          </div>
          
          <div className="flex items-center shrink-0">
            <button 
              onClick={() => setIsPanelOpen(true)}
              className="bg-primary text-primary-foreground px-3 py-2 sm:px-4 sm:py-2 font-bold brutal-border brutal-shadow hover:translate-y-px hover:translate-x-px hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] flex items-center gap-2"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Save entry</span>
            </button>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-background">
          <Outlet />
        </div>

        {/* Slide-over Panel for Saving Entries */}
        <SaveEntryPanel 
          isOpen={isPanelOpen} 
          onClose={() => {
            setIsPanelOpen(false);
            setShareData(null);
          }} 
          shareData={shareData}
        />
      </main>
    </div>
  );
}
