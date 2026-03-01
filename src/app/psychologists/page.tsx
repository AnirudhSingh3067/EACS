"use client";

import { useState, useMemo } from "react";
import { MOCK_PSYCHOLOGISTS } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  SlidersHorizontal,
  Star,
  Sparkles,
  Languages,
  Clock,
  ArrowRight,
  Filter,
  CheckCircle2,
  DollarSign
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@/firebase";
import { cn } from "@/lib/utils";

const SPECIALIZATIONS = ["CBT", "Trauma", "Anxiety", "Depression", "ADHD", "Family Therapy", "Couples Counseling"];
const PRICE_RANGES = ["Under $100", "$100 - $150", "$150+"];

export default function PsychologistsPage() {
  const [search, setSearch] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const { user } = useUser();

  const filteredPsychologists = useMemo(() => {
    return MOCK_PSYCHOLOGISTS.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.specialization.some(s => s.toLowerCase().includes(search.toLowerCase()));
      const matchesSpecialty = !selectedSpecialty || p.specialization.includes(selectedSpecialty);
      return matchesSearch && matchesSpecialty;
    });
  }, [search, selectedSpecialty]);

  const recommended = useMemo(() => {
    return MOCK_PSYCHOLOGISTS.slice(0, 2);
  }, []);

  return (
    <div className="bg-background text-foreground min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-7xl">

        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-16">
          <div className="space-y-4 max-w-2xl">
            <h1 className="text-5xl font-headline font-bold tracking-tight">Expert Directory</h1>
            <p className="text-xl text-muted-foreground">
              Connect with {MOCK_PSYCHOLOGISTS.length} board-certified clinical psychologists vetted for efficacy and empathy.
            </p>
          </div>
          <div className="relative w-full lg:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search by name or clinical focus..."
              className="pl-12 h-14 bg-card rounded-2xl shadow-sm border-border text-lg transition-all focus-visible:ring-primary focus-visible:ring-offset-2"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Recommended for Logged In Users */}
        {user && (
          <section className="mb-20 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <Sparkles className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-headline font-bold">AI Clinical Match</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {recommended.map(p => (
                <Card key={`rec-${p.id}`} className="friendly-card border-2 border-primary/20 overflow-hidden group">
                  <div className="flex flex-col sm:flex-row h-full">
                    <div className="relative w-full sm:w-56 h-56 sm:h-auto">
                      <Image
                        src={p.imageUrl}
                        alt={p.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        data-ai-hint="therapist portrait"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent sm:hidden" />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-primary text-primary-foreground border-none px-3 py-1 shadow-lg flex items-center gap-1.5">
                          <CheckCircle2 className="h-3 w-3" /> Best Match
                        </Badge>
                      </div>
                    </div>
                    <div className="flex-1 p-8 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold">{p.name}</h3>
                        <p className="text-sm text-primary font-bold uppercase tracking-wider">{p.specialization[0]}</p>
                        <p className="text-sm text-muted-foreground italic leading-relaxed">
                          "Based on your recent stress patterns, Dr. {p.name.split(' ')[2]}'s expertise in CBT would be highly effective."
                        </p>
                      </div>
                      <Button className="w-full h-12 rounded-xl group-hover:cta-glow" asChild>
                        <Link href={`/psychologists/${p.id}`} className="flex items-center justify-center gap-2">
                          Book Consultation <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Sidebar Filters */}
          <aside className="lg:col-span-3 space-y-8 lg:sticky lg:top-24 h-fit">
            <Card className="friendly-card p-8 space-y-8 bg-card border-border">
              <div className="flex items-center justify-between pb-4 border-b">
                <h3 className="font-bold flex items-center gap-2 text-lg">
                  <Filter className="h-5 w-5 text-primary" /> Filters
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs h-auto p-0 text-muted-foreground hover:text-primary"
                  onClick={() => { setSearch(""); setSelectedSpecialty(null); }}
                >
                  Reset
                </Button>
              </div>

              <div className="space-y-5">
                <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Clinical Specialization</h4>
                <div className="flex flex-wrap gap-2">
                  {SPECIALIZATIONS.map(tag => (
                    <button
                      key={tag}
                      onClick={() => setSelectedSpecialty(selectedSpecialty === tag ? null : tag)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-medium border transition-all active:scale-95",
                        selectedSpecialty === tag
                          ? "bg-primary text-primary-foreground border-primary shadow-md"
                          : "bg-muted/50 text-muted-foreground border-border hover:border-primary/40 hover:text-primary"
                      )}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-5">
                <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Session Pricing</h4>
                <div className="space-y-4">
                  {PRICE_RANGES.map(price => (
                    <label key={price} className="flex items-center gap-3 text-sm cursor-pointer group">
                      <div className="h-5 w-5 rounded-full border border-border flex items-center justify-center group-hover:border-primary transition-colors">
                        <div className="h-2.5 w-2.5 rounded-full bg-primary opacity-0 group-hover:opacity-20 transition-opacity" />
                      </div>
                      <span className="text-muted-foreground group-hover:text-foreground transition-colors">{price}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-4 space-y-4">
                <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Confidentiality Note</p>
                  <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                    All therapists in our directory adhere to strict HIPAA confidentiality standards.
                  </p>
                </div>
              </div>
            </Card>
          </aside>

          {/* Directory List */}
          <div className="lg:col-span-9">
            {filteredPsychologists.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredPsychologists.map((p, idx) => (
                  <Card
                    key={p.id}
                    className="friendly-card group overflow-hidden border-border bg-card animate-fade-in-up"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <div className="flex flex-col h-full">
                      <div className="relative h-64 w-full overflow-hidden">
                        <Image
                          src={p.imageUrl}
                          alt={p.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-md px-4 py-1.5 rounded-full flex items-center gap-2 shadow-xl border border-border/50">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-bold text-foreground">{p.rating}</span>
                        </div>
                        <div className="absolute bottom-4 left-4 flex gap-2">
                          {p.specialization.slice(0, 2).map(spec => (
                            <Badge key={spec} variant="secondary" className="bg-background/90 backdrop-blur-md text-foreground border-none font-bold text-[10px]">{spec}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="p-8 flex flex-col flex-1 space-y-6">
                        <div className="space-y-2">
                          <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">{p.name}</h3>
                          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-muted-foreground">
                            <span className="flex items-center gap-1.5"><Languages className="h-3.5 w-3.5" /> {p.languages.join(", ")}</span>
                            <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {p.experience}y Exp.</span>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed italic">
                          "{p.bio}"
                        </p>

                        <div className="pt-6 border-t mt-auto flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-2xl font-bold text-foreground flex items-center gap-1">
                              <DollarSign className="h-5 w-5 text-primary" /> {p.price}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">per clinical hour</span>
                          </div>
                          <Button variant="secondary" className="rounded-xl px-8 font-bold hover:bg-primary hover:text-primary-foreground transition-all" asChild>
                            <Link href={`/psychologists/${p.id}`}>Profile</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-32 space-y-6 bg-card rounded-[3rem] border border-dashed border-border">
                <div className="h-20 w-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto">
                  <SlidersHorizontal className="h-10 w-10 text-muted-foreground/30" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-headline font-bold">No clinical matches found</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto">Try adjusting your filters or clinical specialization keywords.</p>
                </div>
                <Button variant="outline" onClick={() => { setSearch(""); setSelectedSpecialty(null); }}>Clear All Filters</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
