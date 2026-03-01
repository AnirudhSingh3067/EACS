
import Image from "next/image";
import { ShieldCheck, Heart, Brain, Users, Lock, AlertCircle, Sparkles, CheckCircle2 } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden border-b">
        <div className="absolute inset-0 bg-primary/5 dark:bg-primary/10 -z-10" />
        <div className="container mx-auto px-4 text-center max-w-4xl space-y-8 animate-fade-in-up">
          <div className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary border border-primary/20">
            <Sparkles className="mr-2 h-4 w-4" /> The Future of Psychological Care
          </div>
          <h1 className="text-5xl md:text-6xl font-headline font-bold tracking-tight">
            Bridging the Gap in <br />
            <span className="text-primary">Mental Wellness</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            MindBridge was founded on a simple principle: technology should empower human connection, not replace it. We combine AI-driven emotional triage with elite clinical expertise.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 relative aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl">
             <Image 
                src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxNHx8dGVhbXxlbnwwfHx8fDE3NzIyNzQ2MDd8MA&ixlib=rb-4.1.0&q=80&w=1080" 
                alt="MindBridge Mission" 
                fill 
                className="object-cover" 
                data-ai-hint="peaceful nature"
              />
          </div>
          <div className="flex-1 space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-headline font-bold">Our Mission</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Accessibility to quality mental health care is a global challenge. MindBridge solves this by providing immediate AI support for everyday emotional processing, while seamlessly connecting users to licensed professionals for deep healing work.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-3">
                <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h4 className="font-bold text-xl">Privacy First</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">Every conversation and session is encrypted and fully HIPAA compliant.</p>
              </div>
              <div className="space-y-3">
                <div className="h-12 w-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-500">
                  <Heart className="h-6 w-6" />
                </div>
                <h4 className="font-bold text-xl">Human Centric</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">AI assists our psychologists; it never makes final clinical decisions.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works / The Model */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
             <h2 className="text-4xl font-headline font-bold">The AI + Human Synergy</h2>
             <p className="text-muted-foreground text-lg">A cohesive care model designed for your long-term safety and growth.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-10 rounded-[2rem] border border-border space-y-6 hover:shadow-xl transition-all group">
              <div className="h-16 w-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                <Brain className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold">MindBridge AI</h3>
              <p className="text-muted-foreground leading-relaxed">
                Available 24/7, our AI detects subtle emotional shifts, provides grounding exercises, and monitors for high-risk language. It acts as a safety net that never sleeps.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm font-medium">
                  <CheckCircle2 className="h-4 w-4 text-primary" /> Real-time mood analysis
                </li>
                <li className="flex items-center gap-2 text-sm font-medium">
                  <CheckCircle2 className="h-4 w-4 text-primary" /> Instant grounding tools
                </li>
              </ul>
            </div>

            <div className="bg-card p-10 rounded-[2rem] border border-border space-y-6 hover:shadow-xl transition-all group">
              <div className="h-16 w-16 bg-secondary rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">Licensed Experts</h3>
              <p className="text-muted-foreground leading-relaxed">
                Our board-certified psychologists use AI-generated insights to dive deeper into your needs during sessions, making every minute of therapy more effective.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm font-medium">
                  <CheckCircle2 className="h-4 w-4 text-secondary-foreground" /> Evidence-based therapy
                </li>
                <li className="flex items-center gap-2 text-sm font-medium">
                  <CheckCircle2 className="h-4 w-4 text-secondary-foreground" /> Personalized care plans
                </li>
              </ul>
            </div>

            <div className="bg-card p-10 rounded-[2rem] border border-border space-y-6 hover:shadow-xl transition-all group">
              <div className="h-16 w-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Lock className="h-8 w-8 text-emerald-600 dark:text-emerald-500" />
              </div>
              <h3 className="text-2xl font-bold">Seamless Security</h3>
              <p className="text-muted-foreground leading-relaxed">
                We utilize military-grade encryption for all video sessions and chat logs. Your data is protected by multiple layers of modern digital security.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm font-medium">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> End-to-end encryption
                </li>
                <li className="flex items-center gap-2 text-sm font-medium">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> HIPAA/GDPR Compliant
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Safety & Crisis */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="bg-destructive/5 dark:bg-destructive/10 p-12 rounded-[3rem] border-2 border-dashed border-destructive/20 flex flex-col md:flex-row items-center gap-12">
            <div className="h-20 w-20 bg-destructive/10 rounded-[2rem] flex items-center justify-center shrink-0">
               <AlertCircle className="h-10 w-10 text-destructive animate-pulse" />
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-headline font-bold text-destructive">Crisis & Safety Commitment</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                MindBridge is designed for support, not immediate life-saving intervention. We are committed to the ethical use of AI, which means rigorous auditing of our algorithms and a "human-in-the-loop" requirement for any crisis escalation. 
              </p>
              <p className="font-bold text-foreground">
                If you are in immediate danger, please contact 988 (Suicide & Crisis Lifeline) or local emergency services immediately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Closing */}
      <section className="py-24 bg-slate-950 text-slate-100">
         <div className="container mx-auto px-4 text-center space-y-8">
            <h2 className="text-4xl font-headline font-bold">A Better Standard of Care</h2>
            <p className="max-w-2xl mx-auto text-slate-400 text-lg leading-relaxed">
               We aren't just building an app; we're building a digital sanctuary where expertise and empathy meet to help you live your most fulfilled life.
            </p>
         </div>
      </section>
    </div>
  );
}
