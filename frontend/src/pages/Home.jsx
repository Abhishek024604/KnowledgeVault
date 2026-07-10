import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

export default function Home() {
  const queryClient = useQueryClient();
  const [sort, setSort] = useState('Last updated');
  const { data: topics = [], isLoading, error } = useQuery({
    queryKey: ['topics'],
    queryFn: async () => {
      const res = await api.get('/topics');
      return res.data;
    }
  });

  const createTopicMutation = useMutation({
    mutationFn: async (name) => {
      const res = await api.post('/topics', { name, color: 'bg-indigo-500' });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
    },
    onError: (err) => {
      alert('Failed to create topic: ' + (err.response?.data?.error || err.message));
    }
  });

  const handleCreateTopic = () => {
    const name = window.prompt('Enter new topic name:');
    if (name) {
      createTopicMutation.mutate(name);
    }
  };

  if (isLoading) return <div className="p-8 text-center font-bold">Loading library...</div>;
  if (error) return <div className="p-8 text-center text-destructive font-bold">Error loading library</div>;

  const prefetchTopic = (topicId) => {
    queryClient.prefetchQuery({
      queryKey: ['entries', topicId],
      queryFn: async () => {
        const res = await api.get(`/entries?topicId=${topicId}`);
        return res.data;
      },
      staleTime: 1000 * 60 * 5,
    });
  };

  const sortedTopics = [...topics].sort((a, b) => {
    if (sort === 'Last updated') return new Date(b.updatedAt) - new Date(a.updatedAt);
    if (sort === 'A-Z') return a.name.localeCompare(b.name);
    if (sort === 'Most entries') return (b.entryCount || 0) - (a.entryCount || 0);
    return 0;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Your library</h1>
        <select 
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="bg-transparent border-2 border-foreground p-2 font-bold outline-none focus:ring-2 focus:ring-primary cursor-pointer w-full sm:w-auto"
        >
          <option value="Last updated">Last updated</option>
          <option value="A-Z">A-Z</option>
          <option value="Most entries">Most entries</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sortedTopics.map(topic => (
          <Link 
            key={topic.id}
            to={`/app/topic/${topic.id}`}
            onMouseEnter={() => prefetchTopic(topic.id)}
            onTouchStart={() => prefetchTopic(topic.id)}
            className="block group bg-card brutal-border p-5 brutal-shadow hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            {/* Collage mockup */}
            <div className="flex gap-2 mb-4 h-24">
              <div className="flex-1 bg-muted/50 brutal-border flex items-center justify-center">
                <span className="text-muted-foreground">📄</span>
              </div>
              <div className="flex-1 bg-muted/30 brutal-border flex items-center justify-center">
                <span className="text-muted-foreground">+</span>
              </div>
              <div className="flex-1 bg-muted/10 brutal-border flex items-center justify-center">
                <span className="text-muted-foreground">=</span>
              </div>
            </div>

            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${topic.color || 'bg-indigo-500'} brutal-border inline-block`}></span>
                  {topic.name}
                  {topic.revisit && (
                    <span className="ml-2 text-xs bg-amber-100 text-amber-900 border-2 border-amber-900 px-2 py-0.5 rounded-full">
                      {topic.revisit} to revisit
                    </span>
                  )}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 font-medium">
                  {topic.entryCount} entries • Updated {new Date(topic.updatedAt).toLocaleDateString()}
                </p>
              </div>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </div>

            <div className="flex gap-2 mt-4 flex-wrap">
              {(topic.tags || []).map(tag => (
                <span key={tag} className="text-xs font-bold text-muted-foreground bg-muted px-2 py-1 brutal-border">
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}

        {/* Add new topic card */}
        <button onClick={handleCreateTopic} disabled={createTopicMutation.isPending} className="flex flex-col items-center justify-center gap-2 p-5 border-2 border-dashed border-foreground bg-muted/20 hover:bg-muted/40 transition-colors h-full min-h-[220px]">
          <Plus size={24} />
          <span className="font-bold">{createTopicMutation.isPending ? 'Creating...' : 'New topic'}</span>
        </button>
      </div>
    </div>
  );
}
