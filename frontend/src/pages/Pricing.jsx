import { Link } from 'react-router-dom';
import { FileText, Share2, Sparkles, Zap, Shield, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Pricing() {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary selection:text-primary-foreground">
      
      {/* Navigation */}
      <nav className="border-b-4 border-foreground bg-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <span className="w-5 h-5 rounded-full bg-primary brutal-border inline-block"></span>
              <Link to="/" className="font-black text-2xl tracking-tighter uppercase">Knoledge</Link>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="font-bold uppercase tracking-wider text-sm hover:text-primary transition-colors">About</Link>
              <Link to="/app" className="font-bold uppercase tracking-wider text-sm hover:text-primary transition-colors">Playground</Link>
              <span className="font-bold uppercase tracking-wider text-sm text-primary underline underline-offset-4 decoration-2">Pricing</span>
            </div>

            <div className="flex items-center gap-4">
              {currentUser ? (
                <Link to="/app" className="bg-primary text-primary-foreground px-6 py-2.5 font-bold uppercase tracking-wider text-sm brutal-border brutal-shadow hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                  Go to App
                </Link>
              ) : (
                <>
                  <Link to="/login" className="hidden sm:block font-bold uppercase tracking-wider text-sm hover:underline underline-offset-4 decoration-2">Sign in</Link>
                  <Link to="/signup" className="bg-primary text-primary-foreground px-6 py-2.5 font-bold uppercase tracking-wider text-sm brutal-border brutal-shadow hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Pricing Section */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/" className="inline-flex items-center gap-2 font-bold uppercase tracking-wider text-sm hover:text-primary transition-colors mb-8">
             <ArrowLeft size={16} /> Back to Home
          </Link>

          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Simple Pricing. No BS.</h1>
            <p className="text-lg mt-4 text-muted-foreground font-medium max-w-2xl mx-auto">Start for free. Upgrade when your brain gets too big.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free */}
            <div className="bg-card border-4 border-foreground p-8 flex flex-col brutal-shadow hover:-translate-y-2 transition-transform duration-300">
              <div className="mb-8">
                <h3 className="text-2xl font-black uppercase tracking-tight mb-2">Free</h3>
                <div className="text-4xl font-black tracking-tighter">$0<span className="text-sm text-muted-foreground">/mo</span></div>
                <p className="text-sm text-muted-foreground mt-4 font-medium border-l-4 border-muted pl-3">Perfect for getting started.</p>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 font-bold text-sm"><FileText size={18} className="text-primary"/> Up to 200 Entries</li>
                <li className="flex items-center gap-3 font-bold text-sm"><Zap size={18} className="text-primary"/> Basic AI Summaries</li>
                <li className="flex items-center gap-3 font-bold text-sm"><Share2 size={18} className="text-primary"/> PWA Mobile App</li>
              </ul>
              <Link to="/signup" className="block w-full py-4 text-center font-bold uppercase tracking-wider text-sm text-foreground bg-muted border-2 border-foreground hover:bg-foreground hover:text-background transition-colors">
                Start Free
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-primary text-primary-foreground border-4 border-foreground p-8 flex flex-col shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative transform md:-translate-y-4 hover:-translate-y-6 transition-transform duration-300">
              <div className="absolute top-0 right-8 -translate-y-1/2 bg-yellow-400 text-black font-black uppercase text-[10px] px-3 py-1 border-2 border-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                Most Popular
              </div>
              <div className="mb-8">
                <h3 className="text-2xl font-black uppercase tracking-tight mb-2">Pro</h3>
                <div className="text-4xl font-black tracking-tighter">$5<span className="text-sm opacity-80">/mo</span></div>
                <p className="text-sm opacity-90 mt-4 font-medium border-l-4 border-primary-foreground/30 pl-3">For digital hoarders.</p>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 font-bold text-sm"><FileText size={18}/> Unlimited Entries</li>
                <li className="flex items-center gap-3 font-bold text-sm"><Sparkles size={18}/> Advanced AI & Tag Generation</li>
                <li className="flex items-center gap-3 font-bold text-sm"><Shield size={18}/> Priority Support</li>
              </ul>
              <Link to="/signup" className="block w-full py-4 text-center font-bold uppercase tracking-wider text-sm bg-background text-foreground border-2 border-foreground hover:bg-yellow-400 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]">
                Go Pro
              </Link>
            </div>

            {/* Lifetime */}
            <div className="bg-card border-4 border-foreground p-8 flex flex-col brutal-shadow hover:-translate-y-2 transition-transform duration-300">
              <div className="mb-8">
                <h3 className="text-2xl font-black uppercase tracking-tight mb-2">Vault</h3>
                <div className="text-4xl font-black tracking-tighter">$49<span className="text-sm text-muted-foreground">/once</span></div>
                <p className="text-sm text-muted-foreground mt-4 font-medium border-l-4 border-muted pl-3">Pay once. Yours forever.</p>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 font-bold text-sm"><FileText size={18} className="text-primary"/> Unlimited Entries Forever</li>
                <li className="flex items-center gap-3 font-bold text-sm"><Sparkles size={18} className="text-primary"/> All Pro Features</li>
                <li className="flex items-center gap-3 font-bold text-sm"><Shield size={18} className="text-primary"/> Early Access to New Features</li>
              </ul>
              <Link to="/signup" className="block w-full py-4 text-center font-bold uppercase tracking-wider text-sm text-foreground bg-background border-2 border-foreground hover:bg-foreground hover:text-background transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]">
                Buy Lifetime
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-4 border-foreground bg-card py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
             <span className="w-5 h-5 rounded-full bg-primary border-2 border-foreground inline-block"></span>
             <span className="font-black text-lg tracking-tighter uppercase">Knoledge</span>
          </div>
          <p className="text-sm font-bold text-muted-foreground">© 2026 Knoledge Inc. Brutalized on the web.</p>
        </div>
      </footer>
    </div>
  );
}
