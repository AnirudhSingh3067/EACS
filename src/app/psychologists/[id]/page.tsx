
"use client";


import { useParams, useRouter } from "next/navigation";
import { MOCK_PSYCHOLOGISTS, MOCK_REVIEWS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Star,
  Languages,
  Clock,
  Shield,
  CalendarDays,
  Loader2,
  Lock,
  CreditCard,
  Video,
  Sparkles,
  ArrowRight,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useUser, useFirestore } from "@/firebase";
import { collection, serverTimestamp, Timestamp } from "firebase/firestore";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import Link from "next/link";

const DEV_PRACTITIONER_UID = "Ci1YkKY538QVfn6X7OjS6wIIktm1";

export default function ProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useUser();
  const db = useFirestore();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [meetingLink, setMeetingLink] = useState("");
  const [bookingState, setBookingState] = useState<"idle" | "loading" | "success">("idle");

  const psychologist = MOCK_PSYCHOLOGISTS.find(p => p.id === id);

  if (!psychologist) return <div className="container py-20 text-center">Psychologist not found.</div>;

  const handleBooking = async () => {
    if (!user) {
      toast({ title: "Authentication Required", description: "Please sign in to book a session." });
      router.push("/login");
      return;
    }

    if (!date) {
      toast({ title: "Selection Required", description: "Please pick a date for your session." });
      return;
    }

    if (!selectedTime) {
      toast({ title: "Time Required", description: "Please pick a time for your session." });
      return;
    }
    setBookingState("loading");

    // Combine selected date and time
    const [_, timeVal, period] = selectedTime.split(" ");
    let [hours, minutes] = timeVal.split(":").map(Number);
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;

    const sessionStart = new Date(date);
    sessionStart.setHours(hours, minutes, 0, 0);

    try {
      addDocumentNonBlocking(collection(db, "sessions"), {
        patientId: user.uid,
        practitionerId: DEV_PRACTITIONER_UID,
        startTime: Timestamp.fromDate(sessionStart),
        status: "upcoming",
        meetingLink: null,
        createdAt: serverTimestamp(),
      });

      // Dispatch event for PatientHistoryPanel to refresh
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("session-booked"));
      }

      setBookingState("success");

      toast({
        title: "Session Booked! ✨",
        description: `Your healing journey with ${psychologist.name} starts on ${date.toLocaleDateString()}.`,
      });

      setTimeout(() => {
        router.push("/dashboard/user");
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to book your session. Please try again.",
        variant: "destructive",
      });
      setBookingState("idle");
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-background min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Left Column: Profile Info */}
          <div className="lg:col-span-2 space-y-10">
            <Card className="friendly-card overflow-hidden">
              <div className="p-10 md:flex gap-10 items-start">
                <div className="relative h-56 w-56 rounded-[2.5rem] overflow-hidden shadow-2xl mb-8 md:mb-0 shrink-0 border-4 border-white dark:border-slate-800 transition-transform hover:rotate-2">
                  <Image src={psychologist.imageUrl} alt={psychologist.name} fill className="object-cover" />
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h1 className="text-4xl font-headline font-bold text-slate-900 dark:text-foreground tracking-tight">{psychologist.name}</h1>
                    <div className="flex flex-wrap items-center gap-4">
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5 rounded-full text-xs font-bold">
                        {psychologist.specialization[0]}
                      </Badge>
                      <div className="flex items-center text-sm font-bold bg-amber-50 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full border border-amber-100 dark:border-amber-900/60">
                        <Star className="h-4 w-4 fill-current mr-1.5" />
                        {psychologist.rating} ({psychologist.reviewsCount} verified reviews)
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-400">
                      <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-primary"><Clock className="h-4 w-4" /></div>
                      {psychologist.experience}+ years experience
                    </div>
                    <div className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-400">
                      <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-primary"><Languages className="h-4 w-4" /></div>
                      {psychologist.languages.join(", ")}
                    </div>
                    <div className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-400">
                      <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-primary"><Shield className="h-4 w-4" /></div>
                      Licensed: {psychologist.license}
                    </div>
                    <div className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-400">
                      <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-primary"><Video className="h-4 w-4" /></div>
                      Secure Video Session
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="friendly-card">
              <CardHeader>
                <CardTitle className="font-headline text-2xl font-bold">About the Specialist</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">{psychologist.bio}</p>

                <div className="space-y-4">
                  <h4 className="font-bold text-slate-900 dark:text-foreground flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" /> Areas of Expertise
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {psychologist.specialization.map(s => (
                      <Badge key={s} variant="outline" className="px-5 py-2 rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 transition-colors">{s}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonials */}
            <Card className="friendly-card">
              <CardHeader>
                <CardTitle className="font-headline text-2xl font-bold">What Patients Say</CardTitle>
              </CardHeader>
              <CardContent className="space-y-10">
                {MOCK_REVIEWS.map(r => (
                  <div key={r.id} className="space-y-4 pb-8 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0 group">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-primary">
                          {r.user[0]}
                        </div>
                        <span className="font-bold text-slate-900 dark:text-foreground">{r.user}</span>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < r.rating ? "text-amber-400 fill-current" : "text-slate-200 dark:text-slate-700"}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 italic text-lg leading-relaxed group-hover:text-slate-900 dark:group-hover:text-foreground transition-colors">"{r.comment}"</p>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">{r.date}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Booking Widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              <Card className="friendly-card ring-2 ring-primary/5 overflow-hidden">
                <div className="bg-primary/5 border-b dark:border-slate-800 p-8 space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-headline font-bold">Session Cost</h3>
                    <span className="text-3xl font-bold text-primary">${psychologist.price}</span>
                  </div>
                  <p className="text-xs text-primary/60 font-bold uppercase tracking-tighter">Per 50-minute clinical session</p>
                </div>
                <CardContent className="p-8 space-y-8">
                  {/* Steps Explanation */}
                  <div className="space-y-5 bg-slate-50/50 dark:bg-slate-800/20 p-6 rounded-[1.5rem] border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center">3 Easy Steps to Support</p>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="h-6 w-6 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center shrink-0">1</div>
                        <p className="text-sm font-medium">Pick your date & time</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="h-6 w-6 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center shrink-0">2</div>
                        <p className="text-sm font-medium">Provide meeting details</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="h-6 w-6 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center shrink-0">3</div>
                        <p className="text-sm font-medium">Connect via Secure Video</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-bold text-slate-900 dark:text-foreground flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-primary" /> 1. Select a Date
                    </label>
                    <div className="border border-slate-100 dark:border-slate-800 rounded-[1.5rem] p-4 bg-slate-50 dark:bg-slate-900/50 flex justify-center shadow-inner">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={{ before: new Date() }}
                        className="rounded-md"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-bold text-slate-900 dark:text-foreground">2. Pick a Time (EST)</label>
                      <Badge variant="outline" className="text-[10px] border-amber-200 text-amber-600 bg-amber-50 dark:bg-amber-900/40 dark:border-amber-900/60 dark:text-amber-400">Popular Slot</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {psychologist.availability.map(time => (
                        <Button
                          key={time}
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedTime(time)}
                          className={`rounded-xl border-slate-200 dark:border-slate-800 transition-all font-bold text-xs py-5 ${selectedTime === time
                            ? "bg-primary text-white border-primary"
                            : "hover:bg-primary/10 hover:border-primary/30"
                            }`}
                        >
                          {time.split(" ")[1]} {time.split(" ")[2]}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-bold text-slate-900 dark:text-foreground flex items-center gap-2">
                      <Video className="h-4 w-4 text-primary" /> 3. Meeting Link (Optional)
                    </label>
                    <Input
                      placeholder="e.g. https://meet.google.com/abc-defg-hij"
                      value={meetingLink}
                      onChange={(e) => setMeetingLink(e.target.value)}
                      className="rounded-xl border-slate-200 dark:border-slate-800 bg-background"
                    />
                    <p className="text-[10px] text-muted-foreground italic">
                      Enter a Google Meet or Zoom link for the session.
                    </p>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <Button
                      className={`w-full h-16 text-lg font-bold rounded-[1.5rem] cta-glow btn-bounce group text-white transition-all duration-300 ${bookingState === "success" ? "bg-emerald-500 hover:bg-emerald-600 scale-100" : "bg-primary hover:bg-primary/90"}`}
                      onClick={handleBooking}
                      disabled={bookingState !== "idle"}
                    >
                      {bookingState === "loading" ? (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      ) : bookingState === "success" ? (
                        <span className="flex items-center gap-2 animate-in zoom-in duration-300">
                          <CheckCircle2 className="h-6 w-6" /> Booked Successfully
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          Book Session <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                      )}
                    </Button>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center font-medium leading-relaxed">
                      100% Confidential. HIPAA Compliant Platform.<br />
                      Cancel anytime up to 24h before for a full refund.
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex flex-col items-center gap-1 opacity-40">
                      <Lock className="h-4 w-4" />
                      <span className="text-[8px] font-bold uppercase text-foreground">SSL Secure</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 opacity-40">
                      <CreditCard className="h-4 w-4" />
                      <span className="text-[8px] font-bold uppercase text-foreground">PCI Compliant</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 opacity-40">
                      <Shield className="h-4 w-4" />
                      <span className="text-[8px] font-bold uppercase">HIPAA</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="friendly-card border-0 bg-secondary/30 dark:bg-secondary/10">
                <CardContent className="p-8 flex items-start gap-5">
                  <div className="h-12 w-12 rounded-2xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center shrink-0">
                    <AlertCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-bold text-slate-900 dark:text-foreground">Not ready to book?</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Our AI-assisted chat is available 24/7 for immediate emotional triage and grounding exercises.
                    </p>
                    <Button variant="link" className="p-0 h-auto text-primary text-xs font-bold hover:no-underline group" asChild>
                      <Link href="/dashboard/user">Speak with MindBridge AI <ArrowRight className="inline-block ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" /></Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
