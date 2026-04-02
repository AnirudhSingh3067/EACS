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

export default function Home() {
  return (
    <div className="flex flex-col gap-0 bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <div className="absolute inset-0 bg-slate-50/50 dark:bg-slate-950/20" />
        <div className="container relative mx-auto px-4 flex flex-col lg:flex-row items-center gap-16">
          <ScrollReveal delay={0.1} className="flex-1 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center rounded-full bg-primary/5 px-4 py-1.5 text-sm font-semibold text-primary border border-primary/10">
              <span className="mr-2">✨</span> Professional Psychological Care
            </div>
            <h1 className="text-5xl md:text-7xl font-headline font-bold tracking-tight text-foreground leading-[1.05]">
              Expert Healing <br />
              <span className="text-primary">Human Centered</span>.
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              MindBridge connects you with licensed clinical psychologists. Secure, confidential, and enhanced by AI for continuous emotional well-being.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="h-14 px-10 text-lg shadow-lg shadow-primary/20" asChild>
                <Link href="/psychologists">Find Your Specialist</Link>
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-10 text-lg border-border" asChild>
                <Link href="/dashboard/user">Start Conversation</Link>
              </Button>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.2} className="flex-1 relative">
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl ring-8 ring-white/50 dark:ring-slate-900/50">
              <Image
                src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxzdXBwb3J0fGVufDB8fHx8MTc3MjI3MTAyNnww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Professional therapy session"
                width={800}
                height={800}
                className="object-cover w-full aspect-square"
                data-ai-hint="therapy session"
                priority={true}
              />
            </div>
            <div className="absolute -bottom-8 -left-8 bg-card p-6 rounded-2xl shadow-xl z-20 hidden md:block border border-border max-w-[240px]">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Practitioners Online</span>
              </div>
              <p className="text-lg font-bold text-foreground">120+ Specialists</p>
              <p className="text-xs text-muted-foreground mt-1">Ready for your consultation</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-background border-y border-border">
        <ScrollReveal stagger={true} className="container mx-auto px-4 flex flex-wrap justify-center gap-10 md:gap-24 items-center">
          <ScrollRevealItem className="flex items-center gap-3 text-muted-foreground font-semibold uppercase tracking-wider text-xs">
            <ShieldCheck className="w-5 h-5 text-primary/60" /> HIPAA Compliant
          </ScrollRevealItem>
          <ScrollRevealItem className="flex items-center gap-3 text-muted-foreground font-semibold uppercase tracking-wider text-xs">
            <CheckCircle2 className="w-5 h-5 text-primary/60" /> Secure Encryption
          </ScrollRevealItem>
          <ScrollRevealItem className="flex items-center gap-3 text-muted-foreground font-semibold uppercase tracking-wider text-xs">
            <CheckCircle2 className="w-5 h-5 text-primary/60" /> Verified Licenses
          </ScrollRevealItem>
        </ScrollReveal>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-20">
          <ScrollReveal delay={0.1} className="flex-1 space-y-8">
            <h2 className="text-4xl font-headline font-bold text-foreground">A Modern Standard for <br />Mental Wellness</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We believe quality therapy should be accessible, professional, and data-informed. By combining expert human insight with AI monitoring, we provide a safety net that spans far beyond the therapy room.
            </p>
            <ScrollReveal stagger={true} className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <ScrollRevealItem className="space-y-3">
                <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <Brain className="h-6 w-6" />
                </div>
                <h4 className="font-bold text-foreground">Clinical Triage</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">Our AI detects subtle emotional shifts to prioritize crisis intervention.</p>
              </ScrollRevealItem>
              <ScrollRevealItem className="space-y-3">
                <div className="h-12 w-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-500">
                  <Heart className="h-6 w-6" />
                </div>
                <h4 className="font-bold text-foreground">Human Connection</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">Technology serves only to empower the relationship with your specialist.</p>
              </ScrollRevealItem>
            </ScrollReveal>
          </ScrollReveal>
          <ScrollReveal delay={0.2} className="flex-1 relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
              <Image src="https://images.unsplash.com/photo-1666362755385-1856fca1a330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxQc3ljaG9sb2d5JTIwfGVufDB8fHx8MTc3MjI3MDUwNXww&ixlib=rb-4.1.0&q=80&w=1080" alt="Mindfulness and peace" fill className="object-cover" data-ai-hint="serene nature" />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Featured Psychologists */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <ScrollReveal className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="space-y-4 max-w-2xl text-center md:text-left">
              <h2 className="text-4xl font-headline font-bold text-foreground">Our Clinical Specialists</h2>
              <p className="text-muted-foreground text-lg">Every practitioner on MindBridge is board-certified and undergoes rigorous vetting.</p>
            </div>
            <Button variant="link" className="text-primary font-bold group text-lg" asChild>
              <Link href="/psychologists">View Directory <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" /></Link>
            </Button>
          </ScrollReveal>
          <ScrollReveal stagger={true} className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {MOCK_PSYCHOLOGISTS.map((p) => (
              <ScrollRevealItem key={p.id}>
                <Card className="friendly-card group overflow-hidden">
                  <div className="relative h-72 w-full">
                    <Image
                      src={p.imageUrl}
                      alt={p.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      data-ai-hint="professional headshot"
                    />
                    <div className="absolute top-5 right-5 bg-background/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm text-foreground">
                      <span className="text-yellow-500">★</span> {p.rating}
                    </div>
                  </div>
                  <CardContent className="p-8 space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">{p.name}</h3>
                      <p className="text-sm text-primary font-semibold uppercase tracking-wider mt-1">{p.specialization[0]}</p>
                    </div>
                    <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed italic">"{p.bio}"</p>
                    <div className="pt-6 border-t flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-2xl font-bold text-foreground">${p.price}</span>
                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">Per Session</span>
                      </div>
                      <Button variant="secondary" size="sm" asChild className="rounded-xl px-5">
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
      <section className="py-32 bg-background text-center">
        <ScrollReveal className="container mx-auto px-4 space-y-10">
          <h2 className="text-5xl font-headline font-bold text-foreground">Your Journey Starts with a <br />Single Step.</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Invest in your mental health with a platform designed for professional efficacy and human care.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" className="h-16 px-12 text-lg rounded-2xl shadow-xl shadow-primary/20" asChild>
              <Link href="/psychologists">Browse Specialists</Link>
            </Button>
            <Button size="lg" variant="outline" className="h-16 px-12 text-lg rounded-2xl border-border bg-card">
              Speak to Support
            </Button>
          </div>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            MindBridge is a HIPAA-compliant platform. Your data is encrypted and strictly confidential.
          </p>
        </ScrollReveal>
      </section>
    </div>
  );
}
