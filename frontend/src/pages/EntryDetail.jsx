import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Share2, Edit3, Trash2, Download, Edit2, Check, X } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

export default function EntryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [reflection, setReflection] = useState('');
  const [isEditingReflection, setIsEditingReflection] = useState(false);

  const { data: entry, isLoading } = useQuery({
    queryKey: ['entry', id],
    queryFn: async () => {
      const res = await api.get(`/entries/${id}`);
      return res.data;
    }
  });

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState('');

  useEffect(() => {
    if (entry) {
      setReflection(entry.reflection || '');
      setIsEditingReflection(false);
      setIsEditingTitle(false);
    }
  }, [entry, id]);

  const updateTitleMutation = useMutation({
    mutationFn: async (newTitle) => {
      const res = await api.put(`/entries/${id}`, { title: newTitle });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entry', id] });
      queryClient.invalidateQueries({ queryKey: ['entries'] });
      setIsEditingTitle(false);
    }
  });

  const handleEditTitleClick = () => {
    setEditTitle(entry?.title || '');
    setIsEditingTitle(true);
  };

  const handleSaveTitle = () => {
    if (editTitle.trim() && editTitle !== entry?.title) {
      updateTitleMutation.mutate(editTitle.trim());
    } else {
      setIsEditingTitle(false);
    }
  };

  const handleShare = async () => {
    const shareUrl = entry.url || window.location.href;
    const shareTitle = entry.title || 'Knoledge Entry';

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          url: shareUrl
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          copyToClipboard(shareUrl);
        }
      }
    } else {
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Link copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy', err);
      alert('Failed to copy link. You can manually copy it from the address bar.');
    });
  };

  const updateReflectionMutation = useMutation({
    mutationFn: async (text) => {
      const res = await api.put(`/entries/${id}`, { reflection: text });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entry', id] });
      setIsEditingReflection(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await api.delete(`/entries/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entries'] });
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      navigate('/app');
    }
  });

  if (isLoading) return <div className="p-8 font-bold">Loading entry...</div>;
  if (!entry) return <div className="p-8 font-bold text-destructive">Entry not found</div>;

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500 pb-20">
      {/* Breadcrumb & Actions */}
      <div className="flex items-center justify-between mb-8">
        <Link to={`/app/topic/${entry.topicId}`} className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground">
          <ArrowLeft size={16} />
          Back to {entry.topic?.name || 'Topic'}
        </Link>
        <div className="flex gap-2">
          <button 
            onClick={handleShare}
            className="p-2 border-2 border-foreground hover:bg-muted bg-card"
            title="Share or copy link"
          >
            <Share2 size={18} />
          </button>
          <button 
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this entry?')) {
                deleteMutation.mutate();
              }
            }}
            disabled={deleteMutation.isPending}
            className="p-2 border-2 border-destructive text-destructive hover:bg-destructive/10 bg-card disabled:opacity-50"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-card brutal-border brutal-shadow mb-12 relative overflow-hidden flex flex-col md:flex-row">
        
        {/* Content Side */}
        <div className="flex-1 p-8 relative z-10">
          {/* Abstract Background pattern */}
          <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl -z-10"></div>
          
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-blue-100 text-blue-900 border-2 border-blue-900 px-2 py-0.5 text-xs font-bold uppercase">{entry.type}</span>
            {entry.url && (
              <a href={entry.url} target="_blank" rel="noreferrer" className="text-muted-foreground text-sm font-bold flex items-center gap-1 hover:text-primary">
                <ExternalLink size={14} /> Open Link
              </a>
            )}
            {entry.fileUrl && (
              <a href={entry.fileUrl} target="_blank" rel="noreferrer" className="text-muted-foreground text-sm font-bold flex items-center gap-1 hover:text-primary">
                <Download size={14} /> Download File
              </a>
            )}
            <span className="text-muted-foreground text-sm font-bold">• {new Date(entry.createdAt).toLocaleDateString()}</span>
          </div>
          
          {isEditingTitle ? (
            <div className="flex items-center gap-2 mb-6 max-w-4xl">
              <input 
                type="text" 
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveTitle();
                  if (e.key === 'Escape') setIsEditingTitle(false);
                }}
                autoFocus
                className="text-4xl font-bold tracking-tight leading-tight bg-transparent border-b-2 border-foreground outline-none px-1 py-0 w-full"
              />
              <button 
                onClick={handleSaveTitle}
                disabled={updateTitleMutation.isPending}
                className="p-2 bg-primary text-primary-foreground brutal-border hover:translate-x-px hover:translate-y-px hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all shrink-0"
              >
                <Check size={24} />
              </button>
              <button 
                onClick={() => setIsEditingTitle(false)}
                disabled={updateTitleMutation.isPending}
                className="p-2 bg-muted brutal-border hover:translate-x-px hover:translate-y-px hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all shrink-0"
              >
                <X size={24} />
              </button>
            </div>
          ) : (
            <div className="flex items-start gap-3 mb-6 max-w-4xl group">
              <h1 className="text-4xl font-bold tracking-tight leading-tight">
                {entry.title || 'Untitled'}
              </h1>
              <button 
                onClick={handleEditTitleClick}
                className="p-2 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-all shrink-0 mt-1"
                title="Rename Entry"
              >
                <Edit2 size={20} />
              </button>
            </div>
          )}
          
          <div className="flex gap-2 flex-wrap">
            {(entry.tags || []).map(tag => (
              <span key={tag.id || tag.name} className="text-xs font-bold bg-muted border-2 border-foreground px-3 py-1">
                #{tag.name}
              </span>
            ))}
          </div>
        </div>
        
        {/* Image Side */}
        {entry.coverImage && (
          <div className="w-full md:w-2/5 shrink-0 border-t-2 md:border-t-0 md:border-l-2 border-foreground bg-card flex items-center justify-center">
            <img src={entry.coverImage} alt="Cover" className="w-full h-full object-contain min-h-[200px] max-h-[400px]" />
          </div>
        )}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Col - AI Summary or Content */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 border-2 border-emerald-600 px-2 py-0.5 bg-emerald-50">
              {entry.type === 'Note' ? 'Content' : 'AI Summary'}
            </span>
          </div>
          
          <div className="prose prose-p:leading-relaxed prose-p:text-lg">
            <p>{entry.type === 'Note' ? entry.content : (entry.summary || 'No summary available.')}</p>
          </div>
        </div>

        {/* Right Col - Reflection / Details */}
        <div className="lg:col-span-7">
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 border-2 border-indigo-600 px-2 py-0.5 bg-indigo-50">
              Your Reflection
            </span>
            {!isEditingReflection && (
              <button 
                onClick={() => setIsEditingReflection(true)}
                className="text-sm font-bold text-primary hover:underline flex items-center gap-1"
              >
                <Edit3 size={14} /> Edit Reflection
              </button>
            )}
          </div>
          
          <div className="space-y-4">
            {isEditingReflection ? (
              <div className="space-y-4">
                <textarea 
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  placeholder="Why does this matter? What did you learn?"
                  rows={6}
                  className="w-full p-4 bg-background border-2 border-foreground brutal-shadow outline-none focus:ring-2 focus:ring-primary resize-y"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button 
                    onClick={() => updateReflectionMutation.mutate(reflection)}
                    disabled={updateReflectionMutation.isPending}
                    className="bg-primary text-primary-foreground px-6 py-2 font-bold border-2 border-foreground brutal-shadow hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
                  >
                    {updateReflectionMutation.isPending ? 'Saving...' : 'Save'}
                  </button>
                  <button 
                    onClick={() => {
                      setReflection(entry.reflection || '');
                      setIsEditingReflection(false);
                    }}
                    className="bg-muted text-foreground px-6 py-2 font-bold border-2 border-foreground hover:bg-muted/80"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div 
                className="p-6 bg-card border-2 border-foreground brutal-shadow min-h-[150px] cursor-pointer group relative"
                onClick={() => setIsEditingReflection(true)}
              >
                {entry.reflection ? (
                  <p className="whitespace-pre-wrap">{entry.reflection}</p>
                ) : (
                  <p className="text-muted-foreground italic group-hover:text-foreground transition-colors">
                    Click to add your reflection...
                  </p>
                )}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground">
                  <Edit3 size={16} />
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
