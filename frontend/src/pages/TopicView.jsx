import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Settings, FileText, Link as LinkIcon, StickyNote, Trash2, Edit2, Check, X } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

export default function TopicView() {
  const { id: topicId } = useParams();
  const [filter, setFilter] = useState('All');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Reset filter to 'All' when navigating to a new topic
  useEffect(() => {
    setFilter('All');
    setIsEditing(false);
  }, [topicId]);

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');

  const updateTopicMutation = useMutation({
    mutationFn: async (newName) => {
      const res = await api.patch(`/topics/${topicId}`, { name: newName });
      return res.data;
    },
    onSuccess: (updatedTopic) => {
      queryClient.setQueryData(['topic', topicId], updatedTopic);
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      setIsEditing(false);
    }
  });

  const handleEditClick = () => {
    setEditName(topic?.name || '');
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (editName.trim() && editName !== topic?.name) {
      updateTopicMutation.mutate(editName.trim());
    } else {
      setIsEditing(false);
    }
  };

  const deleteTopicMutation = useMutation({
    mutationFn: async () => {
      await api.delete(`/topics/${topicId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      navigate('/app');
    }
  });

  const handleDeleteTopic = () => {
    if (window.confirm('Are you sure you want to delete this entire topic AND all its entries? This cannot be undone.')) {
      deleteTopicMutation.mutate();
    }
  };

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ['entries', topicId],
    queryFn: async () => {
      const res = await api.get(`/entries?topicId=${topicId}`);
      return res.data;
    }
  });

  const { data: topic } = useQuery({
    queryKey: ['topic', topicId],
    queryFn: async () => {
      const res = await api.get('/topics');
      return res.data.find(t => t.id === topicId) || {};
    },
    initialData: () => {
      const allTopics = queryClient.getQueryData(['topics']);
      return allTopics?.find(t => t.id === topicId);
    }
  });

  const filteredEntries = filter === 'All'
    ? entries
    : entries.filter(e => e.type === (filter === 'Links' ? 'Link' : filter === 'Files' ? 'File' : 'Note'));

  if (isLoading) return <div className="p-8 text-center font-bold">Loading topic...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-start justify-between border-b-2 border-foreground pb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-indigo-500 flex items-center justify-center text-2xl font-bold text-white brutal-border">
            {topic?.name ? topic.name.charAt(0) : 'T'}
          </div>
          <div>
            {isEditing ? (
              <div className="flex items-center gap-2 mb-1">
                <input 
                  type="text" 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveEdit();
                    if (e.key === 'Escape') setIsEditing(false);
                  }}
                  autoFocus
                  className="text-3xl font-bold tracking-tight bg-transparent border-b-2 border-foreground outline-none px-1 py-0 w-full sm:w-64"
                />
                <button 
                  onClick={handleSaveEdit}
                  disabled={updateTopicMutation.isPending}
                  className="p-1 bg-primary text-primary-foreground brutal-border hover:translate-x-px hover:translate-y-px hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                  <Check size={20} />
                </button>
                <button 
                  onClick={() => setIsEditing(false)}
                  disabled={updateTopicMutation.isPending}
                  className="p-1 bg-muted brutal-border hover:translate-x-px hover:translate-y-px hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight">{topic?.name || 'Topic'}</h1>
                <button 
                  onClick={handleEditClick}
                  className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                  title="Rename Topic"
                >
                  <Edit2 size={16} />
                </button>
              </div>
            )}
            <p className="text-muted-foreground font-medium mt-1">{topic?.entryCount || 0} entries</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleDeleteTopic}
            disabled={deleteTopicMutation.isPending}
            className="p-2 border-2 border-destructive text-destructive brutal-shadow hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-destructive hover:text-white transition-all disabled:opacity-50"
            title="Delete Topic"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-4 sm:gap-6 border-b-2 border-foreground overflow-x-auto no-scrollbar">
        {['All', 'Links', 'Files', 'Notes'].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`pb-3 px-3 font-bold text-sm uppercase tracking-wide border-b-4 transition-all whitespace-nowrap ${filter === tab ? 'border-foreground text-foreground bg-foreground/5' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-foreground/30'}`}
          >
            {tab} <span className="ml-1 opacity-50">
              {tab === 'All' ? entries.length : entries.filter(e => e.type === (tab === 'Links' ? 'Link' : tab === 'Files' ? 'File' : 'Note')).length}
            </span>
          </button>
        ))}
      </div>

      {/* Masonry Grid Simulation */}
      <div className="columns-1 md:columns-2 gap-6 space-y-6">
        {filteredEntries.map(entry => (
          <Link
            key={entry.id}
            to={`/app/entry/${entry.id}`}
            className="block break-inside-avoid bg-card brutal-border p-5 brutal-shadow hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-xs font-bold px-2 py-1 flex items-center gap-1 brutal-border ${entry.type === 'Link' ? 'bg-blue-100 text-blue-900' : entry.type === 'File' ? 'bg-emerald-100 text-emerald-900' : 'bg-purple-100 text-purple-900'}`}>
                {entry.type === 'Link' && <LinkIcon size={12} />}
                {entry.type === 'File' && <FileText size={12} />}
                {entry.type === 'Note' && <StickyNote size={12} />}
                {entry.type}
              </span>
            </div>

            <h3 className="font-bold text-xl leading-tight mb-3">{entry.title}</h3>

            <p className="text-sm border-l-4 border-indigo-500 pl-3 italic mb-4">
              {entry.type === 'Note' ?
                (entry.content?.length > 50 ? `"${entry.content.substring(0, 150)}..."` : `"${entry.content}"`) :
                (entry.summary ? `"${entry.summary}"` : '')}
            </p>

            <div className="flex items-center justify-between text-xs font-bold text-muted-foreground mt-6">
              <div className="flex gap-2 flex-wrap">
                {(entry.tags || []).map(tag => (
                  <span key={tag.id || tag} className="bg-background text-foreground px-2 py-1 brutal-border shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                    #{tag.name || tag}
                  </span>
                ))}
              </div>
              <span className="ml-4 shrink-0">{new Date(entry.createdAt).toLocaleDateString()}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
