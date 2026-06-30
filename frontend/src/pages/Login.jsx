import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate('/app');
    }
  }, [currentUser, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/app');
    } catch (err) {
      setError('Failed to log in: ' + err.message);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md bg-card brutal-border p-8 brutal-shadow">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary brutal-border rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="w-4 h-4 bg-primary-foreground rounded-full"></span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
          <p className="text-muted-foreground mt-2 font-medium">Log in to access your library.</p>
        </div>

        {error && (
          <div className="bg-destructive/10 border-2 border-destructive text-destructive p-3 mb-6 font-bold text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Email</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full p-3 brutal-border outline-none focus:ring-2 focus:ring-primary bg-background"
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex justify-between">
              Password
              <a href="#" className="text-primary hover:underline lowercase font-medium">Forgot?</a>
            </label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full p-3 brutal-border outline-none focus:ring-2 focus:ring-primary bg-background"
              placeholder="••••••••"
            />
          </div>
          
          <button 
            disabled={loading}
            type="submit"
            className="w-full bg-primary text-primary-foreground py-3 font-bold brutal-border brutal-shadow mt-6 hover:translate-x-px hover:translate-y-px hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm font-medium">
          Need an account? <Link to="/signup" className="text-primary hover:underline font-bold">Sign up</Link>
        </div>
      </div>
    </div>
  );
}
