import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  Calendar,
  ShieldCheck,
  ArrowRight,
  Heart,
  Brain,
  CheckCircle2,
  Quote
} from "lucide-react";
import { MOCK_PSYCHOLOGISTS } from "@/lib/mock-data";
import Image from "next/image";
import { ScrollReveal, ScrollRevealItem } from "@/components/ui/scroll-reveal";
import { MouseGlow } from "@/components/ui/mouse-glow";

export default function Home() {
  return (
    <div className="flex flex-col gap-0 bg-background min-h-screen relative">
      <MouseGlow />
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-24 lg:pt-40 lg:pb-32">
        {/* Animated Background Blobs */}
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob dark:bg-purple-900/40" />
        <div className="absolute top-0 -right-4 w-96 h-96 bg-emerald-500/30 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob animation-delay-2000 dark:bg-emerald-900/40" />
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob animation-delay-4000 dark:bg-blue-900/40" />

        <div className="container relative mx-auto px-4 flex flex-col items-center text-center z-10">
          <ScrollReveal delay={0.1} className="w-full max-w-4xl space-y-8">
            <div className="inline-flex flex-col items-center">
              <div className="inline-flex items-center rounded-full glass-panel px-4 py-1.5 text-sm font-semibold text-primary mb-6 shadow-[inset_0_0_20px_rgba(255,255,255,0.03)] border border-primary/20 backdrop-blur-xl">
                <span className="mr-2">✨</span> Professional Psychological Care
              </div>
              <div style={{ filter: 'drop-shadow(0 0 15px rgba(59,130,246,0.2))' }}>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-headline font-extrabold tracking-tighter text-foreground leading-[1.05] text-balance">
                  Expert Healing <br className="hidden md:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300 animate-gradient-shift inline-block mt-2" style={{ textShadow: '0 0 10px rgba(59,130,246,0.25), 0 0 25px rgba(59,130,246,0.18), 0 0 50px rgba(168,85,247,0.12)' }}>Human Centered</span>.
                </h1>
              </div>
            </div>
            <p className="text-xl md:text-2xl text-muted-foreground mx-auto leading-relaxed max-w-3xl font-light">
              MindBridge connects you with licensed clinical psychologists. Secure, confidential, and enhanced by AI for continuous emotional well-being.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="h-14 px-10 text-lg shadow-[0_0_10px_rgba(59,130,246,0.2),0_0_30px_rgba(168,85,247,0.15)] hover:shadow-[0_0_15px_rgba(59,130,246,0.3),0_0_40px_rgba(168,85,247,0.25)] transition-shadow duration-300 btn-bounce rounded-full font-bold relative overflow-hidden group" asChild>
                <Link href="/psychologists">
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-300"></span>
                  <span className="relative z-10">Find Your Specialist</span>
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-10 text-lg border-white/20 glass-panel rounded-full btn-bounce font-bold hover:bg-white/10 hover:shadow-[0_0_10px_rgba(59,130,246,0.1),0_0_20px_rgba(168,85,247,0.1)] transition-shadow duration-300 relative overflow-hidden group" asChild>
                <Link href="/dashboard/user">
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-300"></span>
                  <span className="relative z-10">Start Conversation</span>
                </Link>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="pb-16 relative z-10">
        <ScrollReveal stagger={true} className="container mx-auto px-4 flex flex-wrap justify-center gap-6 md:gap-12 items-center">
          <ScrollRevealItem className="flex items-center gap-3 glass-panel px-6 py-3 rounded-full text-muted-foreground font-semibold uppercase tracking-wider text-xs">
            <ShieldCheck className="w-5 h-5 text-primary/60" /> HIPAA Compliant
          </ScrollRevealItem>
          <ScrollRevealItem className="flex items-center gap-3 glass-panel px-6 py-3 rounded-full text-muted-foreground font-semibold uppercase tracking-wider text-xs">
            <CheckCircle2 className="w-5 h-5 text-primary/60" /> Secure Encryption
          </ScrollRevealItem>
          <ScrollRevealItem className="flex items-center gap-3 glass-panel px-6 py-3 rounded-full text-muted-foreground font-semibold uppercase tracking-wider text-xs">
            <CheckCircle2 className="w-5 h-5 text-primary/60" /> Verified Licenses
          </ScrollRevealItem>
        </ScrollReveal>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 lg:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent dark:via-primary/5" />
        <div className="container relative mx-auto px-4 flex flex-col md:flex-row items-center gap-20">
          <ScrollReveal delay={0.1} className="flex-1 space-y-8">
            <h2 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tight text-foreground leading-tight">A Modern Standard for <br />Mental Wellness</h2>
            <p className="text-lg text-muted-foreground leading-relaxed font-light">
              We believe quality therapy should be accessible, professional, and data-informed. By combining expert human insight with AI monitoring, we provide a safety net that spans far beyond the therapy room.
            </p>
            <ScrollReveal stagger={true} className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
              <ScrollRevealItem className="glass-card gradient-border p-8 rounded-3xl space-y-4">
                <div className="flex justify-between items-start">
                  <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-inner">
                    <Brain className="h-7 w-7" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-full">AI Insight</span>
                </div>
                <h4 className="font-extrabold text-foreground tracking-tight text-xl">Clinical Triage</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">Our AI detects subtle emotional shifts to prioritize crisis intervention effectively.</p>
              </ScrollRevealItem>
              <ScrollRevealItem className="glass-card gradient-border p-8 rounded-3xl space-y-4">
                <div className="flex justify-between items-start">
                  <div className="h-14 w-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-500 shadow-inner">
                    <Heart className="h-7 w-7" />
                  </div>
                </div>
                <h4 className="font-extrabold text-foreground tracking-tight text-xl">Human Connection</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">Technology serves only to empower the relationship with your human specialist.</p>
              </ScrollRevealItem>
            </ScrollReveal>
          </ScrollReveal>
          <ScrollReveal delay={0.2} className="flex-1 relative flex justify-center md:justify-end w-full">
            <div className="w-full max-w-[90%] md:max-w-md lg:max-w-lg mx-auto md:ml-auto md:mr-0 p-2 bg-secondary/20 dark:bg-white/5 backdrop-blur-sm border border-border dark:border-white/10 shadow-xl rounded-[2.5rem]">
              <div className="w-full aspect-[4/5] rounded-[2.2rem] overflow-hidden relative shadow-inner">
                <Image src="https://images.unsplash.com/photo-1666362755385-1856fca1a330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxQc3ljaG9sb2d5JTIwfGVufDB8fHx8MTc3MjI3MDUwNXww&ixlib=rb-4.1.0&q=80&w=1080" alt="Mindfulness and peace" fill className="object-cover" data-ai-hint="serene nature" />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Featured Psychologists */}
      <section className="py-24 lg:py-32 relative">
        <div className="container mx-auto px-4">
          <ScrollReveal className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="space-y-4 max-w-2xl text-center md:text-left">
              <h2 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tight text-foreground">Our Clinical Specialists</h2>
              <p className="text-muted-foreground text-lg font-light">Every practitioner on MindBridge is board-certified and undergoes rigorous vetting.</p>
            </div>
            <Button variant="link" className="text-primary font-bold group text-lg btn-bounce" asChild>
              <Link href="/psychologists">View Directory <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" /></Link>
            </Button>
          </ScrollReveal>
          <ScrollReveal stagger={true} className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {MOCK_PSYCHOLOGISTS.map((p) => (
              <ScrollRevealItem key={p.id}>
                <Card className="glass-card gradient-border friendly-card group overflow-hidden border-0">
                  <div className="relative h-72 w-full overflow-hidden">
                    <Image
                      src={p.imageUrl}
                      alt={p.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      data-ai-hint="professional headshot"
                    />
                    <div className="absolute top-5 right-5 glass-panel px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm text-foreground">
                      <span className="text-yellow-500">★</span> {p.rating}
                    </div>
                  </div>
                  <CardContent className="p-8 space-y-6">
                    <div>
                      <h3 className="text-2xl font-extrabold tracking-tight text-foreground group-hover:text-primary transition-colors">{p.name}</h3>
                      <p className="text-sm text-primary font-bold uppercase tracking-widest mt-1">{p.specialization[0]}</p>
                    </div>
                    <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed font-light">"{p.bio}"</p>
                    <div className="pt-6 border-t border-border flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-2xl font-bold text-foreground tracking-tight">${p.price}</span>
                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Per Session</span>
                      </div>
                      <Button variant="secondary" size="sm" asChild className="rounded-xl px-5 btn-bounce">
                        <Link href={`/psychologists/${p.id}`}>Profile</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </ScrollRevealItem>
            ))}
          </ScrollReveal>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <ScrollReveal className="max-w-4xl mx-auto space-y-16">
            <div className="text-center">
              <Quote className="h-16 w-16 text-primary-foreground/20 mx-auto mb-6" />
              <h2 className="text-4xl font-headline font-bold">Trusted by Thousands</h2>
            </div>
            <ScrollReveal stagger={true} className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <ScrollRevealItem>
                <blockquote className="space-y-6">
                  <p className="text-2xl font-light leading-relaxed">
                    "MindBridge helped me find a specialist who actually understands my culture. The AI check-ins between sessions kept me accountable during the hardest months."
                  </p>
                  <footer className="text-primary-foreground/60 font-bold uppercase tracking-widest text-xs">— Maria S., Patient</footer>
                </blockquote>
              </ScrollRevealItem>
              <ScrollRevealItem>
                <blockquote className="space-y-6">
                  <p className="text-2xl font-light leading-relaxed">
                    "As a practitioner, the insights provided by the dashboard allow me to start sessions with a deep understanding of my patient's week, making every minute count."
                  </p>
                  <footer className="text-primary-foreground/60 font-bold uppercase tracking-widest text-xs">— Dr. Marcus W., Clinical Psychologist</footer>
                </blockquote>
              </ScrollRevealItem>
            </ScrollReveal>
          </ScrollReveal>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/20 hover:bg-primary/30 transition-colors duration-1000 rounded-full mix-blend-multiply filter blur-[120px] opacity-50 dark:bg-primary/20 dark:mix-blend-screen" />

        <ScrollReveal className="container relative mx-auto px-4 z-10">
          <div className="glass-panel max-w-5xl mx-auto rounded-[3rem] p-12 md:p-20 text-center space-y-10 shadow-[inset_0_0_30px_rgba(255,255,255,0.03)] border border-white/10 dark:border-white/10">
            <div style={{ filter: 'drop-shadow(0 0 15px rgba(59,130,246,0.2))' }}>
              <h2 className="text-4xl md:text-6xl font-headline font-extrabold tracking-tight text-foreground leading-[1.1] text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/80" style={{ textShadow: '0 0 10px rgba(59,130,246,0.25), 0 0 25px rgba(59,130,246,0.18), 0 0 50px rgba(168,85,247,0.12)' }}>Start Your Mental Wellness <br className="hidden md:block" /> Journey Today.</h2>
            </div>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light">
              Invest in your mental health with a platform designed for professional efficacy and human care.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-4">
              <Button size="lg" className="h-16 px-12 text-lg rounded-2xl shadow-[0_0_10px_rgba(59,130,246,0.2),0_0_30px_rgba(168,85,247,0.15)] hover:shadow-[0_0_15px_rgba(59,130,246,0.3),0_0_40px_rgba(168,85,247,0.25)] transition-shadow duration-300 btn-bounce font-bold relative overflow-hidden group" asChild>
                <Link href="/dashboard/user">
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-300"></span>
                  <span className="relative z-10">Start Chat</span>
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-16 px-12 text-lg rounded-2xl border-white/20 dark:border-white/10 bg-white/5 backdrop-blur-md btn-bounce font-bold hover:bg-white/10 hover:shadow-[0_0_10px_rgba(59,130,246,0.1),0_0_20px_rgba(168,85,247,0.1)] transition-shadow duration-300 relative overflow-hidden group">
                <span className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-300"></span>
                <span className="relative z-10">Speak to Support</span>
              </Button>
            </div>
            <div className="pt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-primary/60" />
              <span>HIPAA-compliant. Your data is encrypted and strictly confidential.</span>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
