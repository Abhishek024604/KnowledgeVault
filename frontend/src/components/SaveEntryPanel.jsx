import { useState, useRef, useEffect } from 'react';
import { X, Link as LinkIcon, FileText, StickyNote, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

export default function SaveEntryPanel({ isOpen, onClose, shareData }) {
  const [activeTab, setActiveTab] = useState('Link');
  const [url, setUrl] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [topicId, setTopicId] = useState('');
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isOpen && shareData) {
      const sharedUrl = shareData.url || (shareData.text && shareData.text.startsWith('http') ? shareData.text : '');
      if (sharedUrl) {
        setActiveTab('Link');
        setUrl(sharedUrl);
      } else if (shareData.text) {
        setActiveTab('Note');
        setContent(shareData.title ? `${shareData.title}\n\n${shareData.text}` : shareData.text);
      }
    }
  }, [isOpen, shareData]);

  const { data: topics = [] } = useQuery({
    queryKey: ['topics'],
    queryFn: async () => {
      const res = await api.get('/topics');
      return res.data;
    }
  });

  const mutation = useMutation({
    mutationFn: async (data) => {
      if (data.type === 'File' && data.file) {
        const formData = new FormData();
        formData.append('type', data.type);
        formData.append('topicId', data.topicId);
        formData.append('title', data.title);
        formData.append('file', data.file);
        
        const res = await api.post('/entries', formData);
        return res.data;
      } else {
        const res = await api.post('/entries', data);
        return res.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      queryClient.invalidateQueries({ queryKey: ['entries'] });
      handleClose();
    }
  });

  const createTopicMutation = useMutation({
    mutationFn: async (name) => {
      const res = await api.post('/topics', { name, color: 'bg-indigo-500' });
      return res.data;
    },
    onSuccess: (newTopic) => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      setTopicId(newTopic.id);
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

  const handleClose = () => {
    onClose();
    setActiveTab('Link');
    setUrl('');
    setContent('');
    setFile(null);
    setTopicId('');
    mutation.reset();
  };

  const handleSave = () => {
    if (!topicId) return alert('Please select a topic');
    const title = activeTab === 'Link' ? (url || 'New Link') : activeTab === 'File' ? (file?.name || 'New File') : 'New Note';
    mutation.mutate({
      type: activeTab,
      title,
      url: activeTab === 'Link' ? url : null,
      content: activeTab === 'Note' ? content : null,
      file: activeTab === 'File' ? file : null,
      topicId
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={handleClose} className="fixed inset-0 bg-black/50 z-40"
          />
          
          <motion.div 
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[400px] bg-background border-l-4 border-foreground z-50 flex flex-col brutal-shadow"
          >
            <div className="flex items-center justify-between p-6 border-b-2 border-foreground">
              <h2 className="text-xl font-bold">Save an entry</h2>
              <button onClick={handleClose} className="p-1 hover:bg-muted brutal-border">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto space-y-6">
              <div className="flex gap-2 p-1 bg-muted brutal-border">
                {['Link', 'File', 'Note'].map(tab => (
                  <button 
                    key={tab} onClick={() => setActiveTab(tab)}
                    className={`flex-1 flex flex-col items-center gap-1 py-3 font-bold brutal-border ${activeTab === tab ? 'bg-background shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'border-transparent text-muted-foreground'}`}
                  >
                    {tab === 'Link' && <LinkIcon size={18} />}
                    {tab === 'File' && <FileText size={18} />}
                    {tab === 'Note' && <StickyNote size={18} />}
                    {tab}
                  </button>
                ))}
              </div>

              {activeTab === 'Link' && (
                <div className="space-y-2">
                  <label className="font-bold text-sm">URL</label>
                  <input 
                    type="url" placeholder="https://" value={url} onChange={e => setUrl(e.target.value)}
                    className="w-full p-3 brutal-border outline-none focus:ring-2 focus:ring-primary" autoFocus
                  />
                </div>
              )}

              {activeTab === 'File' && (
                <div 
                  className="border-2 border-dashed border-foreground p-8 text-center bg-muted/30 cursor-pointer hover:bg-muted transition-colors relative"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <p className="font-bold mb-2">{file ? file.name : 'Click to select file'}</p>
                  <p className="text-sm text-muted-foreground">PDF or DOCX (max 20MB)</p>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden" 
                    onChange={e => setFile(e.target.files[0])}
                    accept=".pdf,.docx,.doc"
                  />
                </div>
              )}

              {activeTab === 'Note' && (
                <div className="space-y-2">
                  <label className="font-bold text-sm">Note</label>
                  <textarea 
                    rows={5} placeholder="Write your thought here..." value={content} onChange={e => setContent(e.target.value)}
                    className="w-full p-3 brutal-border outline-none focus:ring-2 focus:ring-primary resize-none" autoFocus
                  />
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-sm">Topic</label>
                  <button onClick={handleCreateTopic} disabled={createTopicMutation.isPending} className="text-xs font-bold text-primary hover:underline">
                    {createTopicMutation.isPending ? 'Creating...' : '+ Create new'}
                  </button>
                </div>
                <select 
                  value={topicId} onChange={e => setTopicId(e.target.value)}
                  className="w-full p-3 brutal-border outline-none focus:ring-2 focus:ring-primary bg-background"
                >
                  <option value="" disabled>Select a topic</option>
                  {topics.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
                {topics.length === 0 && (
                  <p className="text-sm text-destructive font-bold">You need to create a topic first!</p>
                )}
              </div>
            </div>

            <div className="p-6 border-t-2 border-foreground bg-muted/30">
              <button 
                onClick={handleSave} disabled={mutation.isPending || !topicId}
                className="w-full bg-primary text-primary-foreground py-3 font-bold brutal-border brutal-shadow flex justify-center items-center gap-2 hover:translate-x-px hover:translate-y-px hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] disabled:opacity-50"
              >
                {mutation.isPending ? 'Saving...' : 'Save Entry'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
