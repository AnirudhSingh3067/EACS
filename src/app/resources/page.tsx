"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Wind, 
  Heart, 
  Brain, 
  ArrowRight,
  Search
} from "lucide-react";
import { Input } from "@/components/ui/input";
import Image from "next/image";

const RESOURCES = [
  {
    id: "r1",
    title: "Understanding Anxiety: A Guide",
    category: "Mental Health",
    type: "Article",
    image: "https://picsum.photos/seed/res1/400/250",
    description: "Learn about the physiological roots of anxiety and daily coping strategies."
  },
  {
    id: "r2",
    title: "5-Minute Grounding Exercise",
    category: "Coping",
    type: "Exercise",
    image: "https://picsum.photos/seed/res2/400/250",
    description: "A quick audio-guided exercise to help you return to the present moment."
  },
  {
    id: "r3",
    title: "Better Sleep Hygiene",
    category: "Wellness",
    type: "Tips",
    image: "https://picsum.photos/seed/res3/400/250",
    description: "Proven techniques to improve your sleep quality and mental clarity."
  },
  {
    id: "r4",
    title: "Breathing for Stress Relief",
    category: "Coping",
    type: "Exercise",
    image: "https://picsum.photos/seed/res4/400/250",
    description: "Master the 4-7-8 technique for immediate relaxation."
  }
];

export default function ResourcesPage() {
  return (
    <div className="bg-background min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center space-y-6 mb-16">
           <h1 className="text-5xl font-headline font-bold text-foreground">Self-Help Resource Library</h1>
           <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
             Tools, guides, and exercises designed by mental health professionals to support your daily wellness.
           </p>
           <div className="max-w-md mx-auto relative mt-8">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
             <Input placeholder="Search resources..." className="pl-10 h-12 bg-card shadow-sm border-border rounded-2xl text-foreground focus-visible:ring-primary" />
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
           <div className="p-6 bg-card rounded-3xl border border-border shadow-sm flex flex-col items-center text-center gap-4 group hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 group-hover:bg-white/20 flex items-center justify-center">
                 <Wind className="h-6 w-6 text-primary group-hover:text-primary-foreground" />
              </div>
              <h3 className="font-bold text-foreground group-hover:text-primary-foreground">Breathing</h3>
           </div>
           <div className="p-6 bg-card rounded-3xl border border-border shadow-sm flex flex-col items-center text-center gap-4 group hover:bg-emerald-600 hover:text-white transition-all cursor-pointer">
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 group-hover:bg-white/20 flex items-center justify-center">
                 <Heart className="h-6 w-6 text-emerald-600 dark:text-emerald-500 group-hover:text-white" />
              </div>
              <h3 className="font-bold text-foreground group-hover:text-white">Anxiety</h3>
           </div>
           <div className="p-6 bg-card rounded-3xl border border-border shadow-sm flex flex-col items-center text-center gap-4 group hover:bg-amber-500 hover:text-white transition-all cursor-pointer">
              <div className="h-12 w-12 rounded-2xl bg-amber-500/10 group-hover:bg-white/20 flex items-center justify-center">
                 <Brain className="h-6 w-6 text-amber-500 group-hover:text-white" />
              </div>
              <h3 className="font-bold text-foreground group-hover:text-white">Focus</h3>
           </div>
           <div className="p-6 bg-card rounded-3xl border border-border shadow-sm flex flex-col items-center text-center gap-4 group hover:bg-purple-600 hover:text-white transition-all cursor-pointer">
              <div className="h-12 w-12 rounded-2xl bg-purple-500/10 group-hover:bg-white/20 flex items-center justify-center">
                 <BookOpen className="h-6 w-6 text-purple-500 group-hover:text-white" />
              </div>
              <h3 className="font-bold text-foreground group-hover:text-white">All Guides</h3>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {RESOURCES.map(res => (
             <Card key={res.id} className="friendly-card group overflow-hidden border-none shadow-sm">
                <div className="relative h-48 w-full">
                  <Image src={res.image} alt={res.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute bottom-4 left-4">
                     <Badge className="bg-background/90 backdrop-blur text-foreground border-none px-3 py-1">{res.type}</Badge>
                  </div>
                </div>
                <CardContent className="p-8 space-y-4">
                   <div className="space-y-2">
                     <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{res.category}</p>
                     <h4 className="text-xl font-bold leading-tight text-foreground group-hover:text-primary transition-colors">{res.title}</h4>
                   </div>
                   <p className="text-sm text-muted-foreground leading-relaxed">
                     {res.description}
                   </p>
                   <Button variant="ghost" className="p-0 h-auto font-bold group/btn text-foreground hover:bg-transparent hover:text-primary">
                      Read More <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                   </Button>
                </CardContent>
             </Card>
           ))}
        </div>
      </div>
    </div>
  );
}