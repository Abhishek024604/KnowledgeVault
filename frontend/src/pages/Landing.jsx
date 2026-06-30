import { Link } from 'react-router-dom';
import { Share2, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Landing() {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary selection:text-primary-foreground pb-20">

      {/* Navigation */}
      <nav className="border-b-4 border-foreground bg-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <span className="w-5 h-5 rounded-full bg-primary brutal-border inline-block"></span>
              <span className="font-black text-xl tracking-tighter uppercase">Knoledge</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#about" className="font-bold uppercase tracking-wider text-sm hover:text-primary transition-colors">About</a>
              <Link to="/app" className="font-bold uppercase tracking-wider text-sm hover:text-primary transition-colors">Playground</Link>
              <Link to="/pricing" className="font-bold uppercase tracking-wider text-sm hover:text-primary transition-colors">Pricing</Link>
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

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16 lg:pt-6 lg:pb-8 flex flex-col lg:flex-row gap-12 lg:gap-16 items-center lg:items-start">
        <div className="flex-1 space-y-8 lg:mt-4">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
            Save what you learn. <br />
            Actually <span className="text-primary">remember</span> it.
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-md leading-relaxed font-medium">
            Knoledge helps you capture, organize and revisit the knowledge that matters — with AI summaries and smart tags.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Link to={currentUser ? "/app" : "/signup"} className="bg-primary text-primary-foreground px-8 py-3.5 font-bold rounded-md hover:opacity-90 transition-opacity text-center shadow-md">
              {currentUser ? 'Enter Vault' : 'Get started for free'}
            </Link>
            <a href="#about" className="bg-background text-foreground border border-foreground/20 px-8 py-3.5 font-bold rounded-md hover:bg-muted transition-colors text-center shadow-sm">
              See how it works
            </a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-8 border-t border-foreground/10 mt-4">
            <div className="flex gap-3 items-start">
              <Share2 size={20} className="text-foreground shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm">Save in 30 seconds</h4>
                <p className="text-xs text-muted-foreground mt-1 font-medium">Links, files or notes</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <Sparkles size={20} className="text-foreground shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm">AI summaries</h4>
                <p className="text-xs text-muted-foreground mt-1 font-medium">Understand faster</p>
              </div>
            </div>
            <div className="flex gap-3 items-start col-span-2 md:col-span-1">
              <span className="font-bold text-xl leading-none text-foreground shrink-0 select-none">#</span>
              <div>
                <h4 className="font-bold text-sm">Smart tags</h4>
                <p className="text-xs text-muted-foreground mt-1 font-medium">Find things easily</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 w-full max-w-2xl lg:max-w-none pt-6">
          <div className="bg-card border border-foreground/10 rounded-xl shadow-2xl overflow-hidden flex flex-col aspect-[4/3]">
            {/* Mac Window Header */}
            <div className="bg-muted/50 border-b border-foreground/10 px-4 py-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            {/* Mock App UI */}
            <div className="flex flex-1 overflow-hidden">
              <div className="w-1/3 border-r border-foreground/10 p-4 flex flex-col gap-6 bg-muted/20">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <span className="w-4 h-4 rounded-full bg-primary inline-block"></span>
                  Knoledge
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="text-[10px] font-bold uppercase text-muted-foreground mb-2 tracking-wider">Library</div>
                    <div className="bg-background border border-foreground/20 rounded text-xs font-bold p-2 shadow-sm">All topics</div>
                    <div className="text-xs font-medium p-2 text-muted-foreground">Revisit queue</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase text-muted-foreground mb-2 flex justify-between tracking-wider">Topics <span>6</span></div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-medium"><span className="w-1.5 h-1.5 rounded-full bg-primary"></span> AI and Tech</div>
                      <div className="flex items-center gap-2 text-xs font-medium"><span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Youtube</div>
                      <div className="flex items-center gap-2 text-xs font-medium"><span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Linkedin</div>
                      <div className="flex items-center gap-2 text-xs font-medium"><span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Thoughts</div>
                      <div className="flex items-center gap-2 text-xs font-medium"><span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Assignments</div>
                      <div className="flex items-center gap-2 text-xs font-medium"><span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Leetcode</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 p-6 bg-background flex flex-col relative">
                <div className="absolute top-4 right-4">
                  <div className="bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1.5 rounded shadow-sm">+ Save entry</div>
                </div>
                <div className="flex justify-between items-center mb-6 mt-6">
                  <h2 className="font-bold text-xl">Your library</h2>
                  <div className="border border-foreground/20 rounded px-2 py-1 text-[10px] font-medium flex items-center gap-1">
                    Last updated <span>▼</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {/* Topic Cards */}
                  <div className="border border-foreground/20 rounded-lg p-3 shadow-sm">
                    <div className="flex gap-2 mb-3">
                      <div className="w-8 h-10 bg-muted/50 rounded-sm border border-foreground/5"></div>
                      <div className="w-8 h-10 bg-muted/50 rounded-sm border border-foreground/5"></div>
                      <div className="w-8 h-10 bg-muted/50 rounded-sm border border-foreground/5"></div>
                    </div>
                    <div className="font-bold text-sm flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-primary"></span> AI and Tech</div>
                    <div className="text-[10px] text-muted-foreground mt-1 font-medium">2 entries - Updated 29/6/2026</div>
                  </div>
                  <div className="border border-foreground/20 rounded-lg p-3 shadow-sm">
                    <div className="flex gap-2 mb-3">
                      <div className="w-8 h-10 bg-muted/50 rounded-sm border border-foreground/5"></div>
                      <div className="w-8 h-10 bg-muted/50 rounded-sm border border-foreground/5"></div>
                      <div className="w-8 h-10 bg-muted/50 rounded-sm border border-foreground/5"></div>
                    </div>
                    <div className="font-bold text-sm flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Youtube</div>
                    <div className="text-[10px] text-muted-foreground mt-1 font-medium">6 entries - Updated 29/6/2026</div>
                  </div>
                  <div className="border border-foreground/20 rounded-lg p-3 shadow-sm">
                    <div className="flex gap-2 mb-3">
                      <div className="w-8 h-10 bg-muted/50 rounded-sm border border-foreground/5"></div>
                      <div className="w-8 h-10 bg-muted/50 rounded-sm border border-foreground/5"></div>
                      <div className="w-8 h-10 bg-muted/50 rounded-sm border border-foreground/5"></div>
                    </div>
                    <div className="font-bold text-sm flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Linkedin</div>
                    <div className="text-[10px] text-muted-foreground mt-1 font-medium">2 entries - Updated 29/6/2026</div>
                  </div>
                  <div className="border border-foreground/20 rounded-lg p-3 shadow-sm">
                    <div className="flex gap-2 mb-3">
                      <div className="w-8 h-10 bg-muted/50 rounded-sm border border-foreground/5"></div>
                      <div className="w-8 h-10 bg-muted/50 rounded-sm border border-foreground/5"></div>
                      <div className="w-8 h-10 bg-muted/50 rounded-sm border border-foreground/5"></div>
                    </div>
                    <div className="font-bold text-sm flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Thoughts</div>
                    <div className="text-[10px] text-muted-foreground mt-1 font-medium">1 entries - Updated 29/6/2026</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive About & How It Works Section */}
      <section id="about" className="border-t border-foreground/10 bg-background text-foreground py-16 lg:py-10 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 relative z-10">
            <div className="text-primary font-bold text-sm mb-4 tracking-wide uppercase">
              How it works
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Your Brain, Organized.</h2>
            <p className="text-lg mt-3 max-w-2xl mx-auto font-medium opacity-90">Knoledge doesn't just store files; it reads them, understands them, and organizes them for you.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">
            {/* Step 1 */}
            <div className="space-y-4 max-w-md mx-auto lg:mx-0 text-center lg:text-left flex flex-col items-center lg:items-start">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold shadow-sm">1</div>
              <h3 className="text-2xl font-bold">Capture Everything</h3>
              <p className="text-base text-muted-foreground font-medium">Send links from your phone via the native Share Menu, upload PDFs from your laptop, or scribble raw markdown notes. Knoledge catches it all.</p>
            </div>
            <div className="bg-card border-4 border-foreground brutal-shadow w-full max-w-md mx-auto transform -rotate-1 hover:rotate-0 transition-transform overflow-hidden">
              <img src="/screenshots/step1.png" alt="Save Entry Form" className="w-full h-auto object-cover" />
            </div>

            {/* Step 2 */}
            <div className="bg-card border-4 border-foreground brutal-shadow w-full max-w-md mx-auto transform rotate-1 hover:rotate-0 transition-transform overflow-hidden order-last lg:order-none">
              <img src="/screenshots/step2.png" alt="Topics Grid" className="w-full h-auto object-cover" />
            </div>
            <div className="space-y-4 max-w-md mx-auto lg:mx-0 text-center lg:text-left flex flex-col items-center lg:items-start">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold shadow-sm">2</div>
              <h3 className="text-2xl font-bold">Browse Your Topics</h3>
              <p className="text-base text-muted-foreground font-medium">Your vault is organized into a clean grid of topics. Knoledge keeps things brutally simple so you can find exactly what you're looking for.</p>
            </div>

            {/* Step 3 */}
            <div className="space-y-4 max-w-md mx-auto lg:mx-0 text-center lg:text-left flex flex-col items-center lg:items-start">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold shadow-sm">3</div>
              <h3 className="text-2xl font-bold">Instant Recall</h3>
              <p className="text-base text-muted-foreground font-medium">Dive into any topic to see a beautiful masonry grid of your saved entries. The AI has already read them, generated summaries, and extracted semantic tags.</p>
            </div>
            <div className="bg-card border-4 border-foreground brutal-shadow w-full max-w-md mx-auto transform -rotate-1 hover:rotate-0 transition-transform overflow-hidden">
              <img src="/screenshots/step3.png" alt="Topic View with Entries" className="w-full h-auto object-cover" />
            </div>

            {/* Step 4 */}
            <div className="bg-card border-4 border-foreground brutal-shadow w-full max-w-md mx-auto transform rotate-1 hover:rotate-0 transition-transform overflow-hidden order-last lg:order-none">
              <img src="/screenshots/step4.png" alt="Entry Detail View" className="w-full h-auto object-cover" />
            </div>
            <div className="space-y-4 max-w-md mx-auto lg:mx-0 text-center lg:text-left flex flex-col items-center lg:items-start">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold shadow-sm">4</div>
              <h3 className="text-2xl font-bold">Deep Dive</h3>
              <p className="text-base text-muted-foreground font-medium">Open any entry to read the full AI summary, add your own personal reflections, and quickly launch the original link or file.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Everything in one place */}
      <section className="border-t border-foreground/10 bg-background py-16 lg:pt-10 pb-15 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <div className="text-primary font-bold text-sm mb-4 tracking-wide">All your knowledge. Structured & searchable.</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Everything in <span className="text-primary">one</span> place</h2>
            <p className="text-xl mt-4 text-muted-foreground font-medium">Links, PDFs, docs, notes — all structured, all searchable.</p>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-8 snap-x">
            {/* Card 1 */}
            <div className="min-w-[300px] w-full max-w-sm border border-foreground/20 rounded-xl p-6 bg-card shrink-0 snap-start shadow-sm">
              <div className="inline-flex items-center gap-1.5 border border-foreground/20 rounded text-xs font-bold px-2 py-1 mb-4 bg-muted/50">
                Link
              </div>
              <h3 className="font-bold text-xl leading-tight mb-4">I Ranked 7 Tech Engineering Careers After AI Impact (Brutal Truth)</h3>
              <p className="text-sm italic text-muted-foreground mb-6 font-medium">"The video ranks seven tech engineering careers based on their vulnerability to AI impact, providing a brutally honest assessment. It offers insights into how AI might reshape the job market for engineers."</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="border border-foreground/20 rounded px-2 py-1 text-[10px] font-bold">#career advice</span>
                <span className="border border-foreground/20 rounded px-2 py-1 text-[10px] font-bold">#tech careers</span>
                <span className="border border-foreground/20 rounded px-2 py-1 text-[10px] font-bold">#ai impact</span>
                <span className="border border-foreground/20 rounded px-2 py-1 text-[10px] font-bold">#engineering jobs</span>
              </div>
              <div className="text-[10px] text-muted-foreground text-right font-medium">29/6/2026</div>
            </div>

            {/* Card 2 */}
            <div className="min-w-[300px] w-full max-w-sm border border-foreground/20 rounded-xl p-6 bg-card shrink-0 snap-start shadow-sm">
              <div className="inline-flex items-center gap-1.5 border border-foreground/20 rounded text-xs font-bold px-2 py-1 mb-4 bg-muted/50">
                File
              </div>
              <h3 className="font-bold text-xl leading-tight mb-4">System Design Notes.pdf</h3>
              <p className="text-sm italic text-muted-foreground mb-6 font-medium">"Comprehensive notes covering core system design concepts including scalability, load balancing, databases, caching and microservices architecture."</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="border border-foreground/20 rounded px-2 py-1 text-[10px] font-bold">#system design</span>
                <span className="border border-foreground/20 rounded px-2 py-1 text-[10px] font-bold">#scalability</span>
                <span className="border border-foreground/20 rounded px-2 py-1 text-[10px] font-bold">#backend</span>
                <span className="border border-foreground/20 rounded px-2 py-1 text-[10px] font-bold">#notes</span>
              </div>
              <div className="text-[10px] text-muted-foreground text-right font-medium">28/6/2026</div>
            </div>

            {/* Card 3 */}
            <div className="min-w-[300px] w-full max-w-sm border border-foreground/20 rounded-xl p-6 bg-card shrink-0 snap-start shadow-sm">
              <div className="inline-flex items-center gap-1.5 border border-foreground/20 rounded text-xs font-bold px-2 py-1 mb-4 bg-muted/50">
                Note
              </div>
              <h3 className="font-bold text-xl leading-tight mb-4">Thoughts on Building in Public</h3>
              <p className="text-sm italic text-muted-foreground mb-6 font-medium">"Key takeaways on consistency, authenticity and long term compounding of content."</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="border border-foreground/20 rounded px-2 py-1 text-[10px] font-bold">#building in public</span>
                <span className="border border-foreground/20 rounded px-2 py-1 text-[10px] font-bold">#content</span>
                <span className="border border-foreground/20 rounded px-2 py-1 text-[10px] font-bold">#mindset</span>
              </div>
              <div className="text-[10px] text-muted-foreground text-right font-medium">27/6/2026</div>
            </div>
          </div>
          <div className="flex justify-center gap-2 mt-4">
            <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30"></div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t border-foreground/10 bg-background py-16 lg:pt-10 pb-16 bg-muted/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="text-primary font-bold text-sm mb-4 tracking-wide uppercase">Loved by learners</div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">What people are saying</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-card border border-foreground/10 p-8 rounded-2xl shadow-sm">
              <blockquote className="text-lg font-medium leading-relaxed mb-6">
                "Knoledge changed how I learn online. It keeps everything I learn organized and easy to revisit. The AI summaries and tags are on point."
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-muted border border-foreground/10 flex items-center justify-center">
                  <span className="font-bold text-sm">AM</span>
                </div>
                <div>
                  <div className="font-bold text-sm">Arjun Mehta</div>
                  <div className="text-xs text-muted-foreground">Software Engineer</div>
                </div>
              </div>
            </div>
            {/* Testimonial 2 */}
            <div className="bg-card border border-foreground/10 p-8 rounded-2xl shadow-sm">
              <blockquote className="text-lg font-medium leading-relaxed mb-6">
                "Finally, a tool that doesn't just act as a graveyard for my bookmarks. The AI actually helps me remember what I saved and why."
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-muted border border-foreground/10 flex items-center justify-center">
                  <span className="font-bold text-sm">SJ</span>
                </div>
                <div>
                  <div className="font-bold text-sm">Sarah Jenkins</div>
                  <div className="text-xs text-muted-foreground">Product Manager</div>
                </div>
              </div>
            </div>
            {/* Testimonial 3 */}
            <div className="bg-card border border-foreground/10 p-8 rounded-2xl shadow-sm">
              <blockquote className="text-lg font-medium leading-relaxed mb-6">
                "I use it for my university research. Capturing PDFs and instantly getting the summary saves me hours of reading every week."
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-muted border border-foreground/10 flex items-center justify-center">
                  <span className="font-bold text-sm">DK</span>
                </div>
                <div>
                  <div className="font-bold text-sm">David Kim</div>
                  <div className="text-xs text-muted-foreground">CS Student</div>
                </div>
              </div>
            </div>
            {/* Testimonial 4 */}
            <div className="bg-card border border-foreground/10 p-8 rounded-2xl shadow-sm">
              <blockquote className="text-lg font-medium leading-relaxed mb-6">
                "The YouTube integration is flawless. I can save a 40-minute tutorial and have the key points extracted instantly. Brilliant."
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-muted border border-foreground/10 flex items-center justify-center">
                  <span className="font-bold text-sm">EL</span>
                </div>
                <div>
                  <div className="font-bold text-sm">Elena Rustov</div>
                  <div className="text-xs text-muted-foreground">Tech Content Creator</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-b border-foreground/10 bg-background py-16 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight">Your knowledge.<br />Your advantage.</h2>
            </div>
            <div className="space-y-8">
              <p className="text-lg font-medium text-muted-foreground">Start building your personal knowledge library today.</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to={currentUser ? "/app" : "/signup"} className="bg-primary text-primary-foreground px-8 py-3.5 font-bold rounded-md hover:opacity-90 transition-opacity text-center shadow-md">
                  Get started for free
                </Link>
                <a href="#about" className="bg-background text-foreground border border-foreground/20 px-8 py-3.5 font-bold rounded-md hover:bg-muted transition-colors text-center shadow-sm">
                  See how it works
                </a>
              </div>
            </div>
          </div>
          <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4 pt-8 border-t border-foreground/10 justify-end md:justify-end">
            <div className="flex items-center gap-2 font-medium text-sm"><span className="w-4 h-4 rounded-full bg-foreground text-background flex items-center justify-center text-[10px]">✓</span> Free to use</div>
            <div className="flex items-center gap-2 font-medium text-sm"><span className="w-4 h-4 rounded-full bg-foreground text-background flex items-center justify-center text-[10px]">✓</span> No credit card required</div>
            <div className="flex items-center gap-2 font-medium text-sm"><span className="w-4 h-4 rounded-full bg-foreground text-background flex items-center justify-center text-[10px]">✓</span> Works on all devices</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-medium">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-primary inline-block"></span>
            <span className="font-bold tracking-tight">Knoledge</span>
          </div>
          <p className="text-muted-foreground">© 2026 Knoledge. All rights reserved.</p>
          <div className="flex gap-6 text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
