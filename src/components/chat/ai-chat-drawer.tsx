"use client";

import { useState, useRef, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Brain, Send, User, AlertTriangle, Loader2, Sparkles, Heart } from "lucide-react";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useUser, useFirestore } from "@/firebase";
import { collection, serverTimestamp } from "firebase/firestore";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { cn } from "@/lib/utils";

type Message = {
  role: "user" | "ai";
  content: string;
};

const QUICK_ACTIONS = [
  { label: "I'm feeling anxious", value: "I'm feeling very anxious right now and need some grounding." },
  { label: "I need to talk", value: "I've had a tough day and just need someone to listen." },
  { label: "Book a session", value: "I'd like to book a session with a therapist." },
  { label: "Coping tools", value: "Can you suggest some coping tools for stress?" },
  { label: "Urgent support", value: "I need urgent emotional support." }
];

export function AIChatDrawer({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const { user } = useUser();
  const db = useFirestore();
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: "Hey there! I'm MindBridge AI. I'm here to listen, validate, and support you. How are things going in your world today? ✨" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [riskAlert, setRiskAlert] = useState<{ riskLevel: string; suggestion: string } | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      const scrollArea = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollArea) scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (overrideInput?: string) => {
    const textToSend = overrideInput || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = { role: "user", content: textToSend };
    setMessages(prev => [...prev, userMsg]);
    if (!overrideInput) setInput("");
    setIsLoading(true);

    try {
      const apiResponse = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend }),
      });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json().catch(() => ({}));
        throw new Error(errorData.reply || "Failed to fetch from chat API");
      }

      const data = await apiResponse.json();
      const aiMsg: Message = { role: "ai", content: data.reply };
      setMessages(prev => [...prev, aiMsg]);

      // Log chat history
      try {
        if (user && db) {
          addDocumentNonBlocking(collection(db, "ai_chat_logs"), {
            userId: user.uid,
            message: textToSend,
            sender: "user",
            timestamp: serverTimestamp()
          });
          addDocumentNonBlocking(collection(db, "ai_chat_logs"), {
            userId: user.uid,
            message: data.reply,
            sender: "ai",
            timestamp: serverTimestamp()
          });
        }
      } catch (logError) {
        console.warn("Log tracking temporarily unavailable:", logError);
      }
    } catch (error: any) {
      console.error("AI Error:", error);
      // Attempt to show backend error if available
      let errorMessage = "I'm sorry, I'm having a bit of trouble connecting right now. Please try again in a moment.";
      if (error?.message) {
        errorMessage = `System Error: ${error.message}`;
      }
      setMessages(prev => [...prev, { role: "ai", content: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="sm:max-w-[500px] flex flex-col p-0 border-l border-border shadow-2xl rounded-l-[3rem] overflow-hidden bg-background">
          <SheetHeader className="p-10 border-b border-border bg-card shrink-0">
            <div className="flex items-center gap-5">
              <div className="h-14 w-14 bg-primary/10 rounded-[1.5rem] flex items-center justify-center text-primary shadow-inner">
                <Brain className="h-8 w-8 animate-float" />
              </div>
              <div className="space-y-1">
                <SheetTitle className="text-2xl font-headline font-bold text-foreground">MindBridge Support AI</SheetTitle>
                <SheetDescription className="text-xs font-medium text-primary/60 flex items-center gap-1.5 uppercase tracking-widest">
                  <Sparkles className="h-3 w-3" /> Human-Enhanced Support
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <ScrollArea className="flex-1 px-8 py-10 bg-muted/20" ref={scrollRef}>
            <div className="space-y-8 pb-10">
              {messages.map((m, i) => (
                <div key={i} className={cn("flex gap-4 animate-section-flow", m.role === "user" ? "flex-row-reverse" : "")}>
                  <div className={cn(
                    "h-11 w-11 rounded-[1.2rem] flex items-center justify-center shrink-0 shadow-md transition-transform hover:scale-110",
                    m.role === "user" ? "bg-card border-2 border-border" : "bg-primary text-primary-foreground"
                  )}>
                    {m.role === "user" ? <User className="h-5 w-5 text-muted-foreground" /> : <Brain className="h-5 w-5" />}
                  </div>
                  <div className={cn(
                    "p-6 text-sm leading-relaxed shadow-sm transition-all",
                    m.role === "user"
                      ? "bg-card rounded-[2rem] rounded-tr-none border border-border text-foreground"
                      : "bg-primary/5 border border-primary/10 rounded-[2rem] rounded-tl-none text-foreground"
                  )}>
                    {m.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-4 items-center ml-4">
                  <div className="h-11 w-11 bg-primary/10 rounded-[1.2rem] flex items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest animate-pulse">Thinking with empathy...</p>
                  </div>
                </div>
              )}
              {messages.length === 1 && !isLoading && (
                <div className="grid grid-cols-1 gap-2 pt-4 animate-section-flow">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 ml-1">Quick Actions:</p>
                  {QUICK_ACTIONS.map((action) => (
                    <Button
                      key={action.label}
                      variant="outline"
                      size="sm"
                      className="justify-start rounded-xl bg-card border-border hover:bg-primary/5 hover:border-primary/20 text-xs py-5"
                      onClick={() => handleSend(action.value)}
                    >
                      <Heart className="h-3 w-3 mr-2 text-primary/60" />
                      {action.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-10 border-t border-border space-y-8 bg-card shrink-0">
            <div className="flex gap-3">
              <Input
                placeholder="What’s been on your mind lately?"
                className="h-14 rounded-[1.5rem] border-border bg-muted/30 px-6 focus-visible:ring-primary shadow-inner text-foreground"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <Button onClick={() => handleSend()} className="h-14 w-14 rounded-[1.5rem] p-0 btn-bounce shadow-lg shadow-primary/20 bg-primary text-primary-foreground" disabled={isLoading || !input.trim()}>
                <Send className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!riskAlert} onOpenChange={() => setRiskAlert(null)}>
        <AlertDialogContent className="border-border rounded-[2.5rem] p-10 shadow-2xl bg-card">
          <AlertDialogHeader>
            <div className="flex items-center gap-5 text-destructive mb-6">
              <div className="h-16 w-16 bg-destructive/10 rounded-[1.5rem] flex items-center justify-center shadow-inner">
                <AlertTriangle className="h-8 w-8 animate-pulse" />
              </div>
              <AlertDialogTitle className="text-3xl font-headline font-bold">Safety First 🤍</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-muted-foreground text-lg leading-relaxed mb-8 font-medium">
              {riskAlert?.riskLevel === 'critical'
                ? "Our system has detected signs of immediate crisis. We want to make sure you are safe and supported right now."
                : "It sounds like you're carrying a lot right now. We strongly encourage reaching out to one of our licensed specialists who can help carry the load."}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="bg-muted/50 p-8 rounded-[2rem] border-2 border-dashed border-border space-y-4 text-sm mb-8">
            <p className="font-bold text-foreground uppercase tracking-widest text-[10px]">Immediate Safe Zones:</p>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex justify-between items-center p-4 bg-card rounded-2xl border border-border shadow-sm">
                <span className="font-medium text-foreground">National Suicide Prevention</span>
                <span className="font-bold text-primary">Call 988</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-card rounded-2xl border border-border shadow-sm">
                <span className="font-medium text-foreground">Crisis Text Line</span>
                <span className="font-bold text-primary">Text HOME to 741741</span>
              </div>
            </div>
          </div>

          <AlertDialogFooter className="gap-4">
            <Button variant="outline" className="rounded-2xl flex-1 h-12 font-bold text-muted-foreground border-border" onClick={() => setRiskAlert(null)}>Dismiss</Button>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl flex-1 h-12 font-bold shadow-lg shadow-primary/20" asChild>
              <a href="/psychologists">See a Specialist</a>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
