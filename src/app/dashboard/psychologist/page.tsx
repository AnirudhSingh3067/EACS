"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, where, orderBy, Timestamp, doc, deleteDoc } from "firebase/firestore";
import { updateDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Clock,
  Users,
  DollarSign,
  Star,
  Settings,
  Video,
  Brain,
  TrendingUp,
  AlertCircle,
  Trash2
} from "lucide-react";
import { MOCK_REVIEWS } from "@/lib/mock-data";

interface Session {
  id: string;
  patientId: string;
  practitionerId: string;
  startTime: Timestamp | any;
  status: "upcoming" | "completed";
  meetingLink?: string | null;
  createdAt: any;
}

const DEV_PRACTITIONER_UID = "Ci1YkKY538QVfn6X7OjS6wIIktm1";

export default function PsychologistDashboard() {
  const [meetingLinks, setMeetingLinks] = useState<Record<string, string>>({});
  const { user } = useUser();
  const db = useFirestore();

  const targetQuery = useMemoFirebase(() => {
    if (!user?.uid) return null;
    return query(
      collection(db, "sessions"),
      where("practitionerId", "==", DEV_PRACTITIONER_UID),
      orderBy("startTime", "desc")
    );
  }, [user?.uid, db]);

  const { data: sessionsData, isLoading } = useCollection<Session>(targetQuery);

  const sessions = (sessionsData && Array.isArray(sessionsData)) ? sessionsData : [];

  useEffect(() => {
    if (sessionsData && Array.isArray(sessionsData)) {
      const links: Record<string, string> = {};
      sessionsData.forEach((s) => {
        if (s.meetingLink) links[s.id] = s.meetingLink;
      });
      setMeetingLinks(links);
    }
  }, [sessionsData]);

  const saveMeetingLink = async (sessionId: string) => {
    try {
      updateDocumentNonBlocking(doc(db, "sessions", sessionId), {
        meetingLink: meetingLinks[sessionId] || null
      });
    } catch (err) {
      console.error(err);
    }
  };

  const deleteSession = async (sessionId: string) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      try {
        await deleteDoc(doc(db, "sessions", sessionId));
      } catch (err) {
        console.error("Failed to delete session:", err);
      }
    }
  };

  return (
    <div className="bg-background min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-headline font-bold text-foreground">Practitioner Panel</h1>
            <p className="text-muted-foreground">Welcome back, Dr. Jenkins.</p>
          </div>
          <Button variant="outline" className="gap-2 bg-card border-border">
            <Settings className="h-4 w-4" /> Manage Availability
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="friendly-card border-none shadow-sm">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Upcoming Today</p>
                <h3 className="text-2xl font-bold">4</h3>
              </div>
              <Calendar className="h-8 w-8 text-primary/40" />
            </CardContent>
          </Card>
          <Card className="friendly-card border-none shadow-sm">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Earnings</p>
                <h3 className="text-2xl font-bold">$4,820</h3>
              </div>
              <DollarSign className="h-8 w-8 text-emerald-500/40" />
            </CardContent>
          </Card>
          <Card className="friendly-card border-none shadow-sm">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Patient Rating</p>
                <h3 className="text-2xl font-bold">4.92</h3>
              </div>
              <Star className="h-8 w-8 text-yellow-500/40" />
            </CardContent>
          </Card>
          <Card className="friendly-card border-none shadow-sm">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Patients</p>
                <h3 className="text-2xl font-bold">28</h3>
              </div>
              <Users className="h-8 w-8 text-blue-500/40" />
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="bg-muted border p-1 rounded-xl">
            <TabsTrigger value="upcoming" className="rounded-lg px-6 data-[state=active]:bg-card data-[state=active]:text-foreground">Upcoming Sessions</TabsTrigger>
            <TabsTrigger value="history" className="rounded-lg px-6 data-[state=active]:bg-card data-[state=active]:text-foreground">Patient History</TabsTrigger>
            <TabsTrigger value="reviews" className="rounded-lg px-6 data-[state=active]:bg-card data-[state=active]:text-foreground">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2 friendly-card border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="font-headline text-foreground">Scheduled Appointments</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isLoading ? (
                    <div className="flex justify-center p-8"><p className="text-muted-foreground animate-pulse">Loading appointments...</p></div>
                  ) : sessions.length === 0 ? (
                    <div className="flex justify-center p-12 bg-muted/20 rounded-2xl border border-dashed border-border"><p className="text-muted-foreground font-medium">No upcoming appointments found.</p></div>
                  ) : [...sessions].sort((a, b) => {
                    const aHasLink = !!a.meetingLink && a.meetingLink.trim() !== "";
                    const bHasLink = !!b.meetingLink && b.meetingLink.trim() !== "";
                    if (aHasLink && !bHasLink) return -1;
                    if (!aHasLink && bHasLink) return 1;
                    return 0;
                  }).map(session => {
                    const startDate = session.startTime?.toDate ? session.startTime.toDate() : new Date();
                    return (
                      <div key={session.id} className="flex flex-col p-6 border border-border rounded-2xl hover:bg-muted/50 transition-colors gap-4">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                              <Users className="h-6 w-6" />
                            </div>
                            <div>
                              <p className="font-bold text-foreground">Patient: {session.patientId.substring(0, 8)}...</p>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {format(startDate, "MMM d, yyyy")}</span>
                                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {format(startDate, "h:mm a")}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 w-full md:w-auto">
                            {session.meetingLink ? (
                              <Button asChild className="flex-1 md:flex-none gap-2 bg-primary text-primary-foreground font-bold shadow hover:bg-primary/90">
                                <a href={session.meetingLink} target="_blank" rel="noopener noreferrer">
                                  <Video className="h-4 w-4" /> Join Room
                                </a>
                              </Button>
                            ) : (
                              <Button variant="outline" disabled className="flex-1 md:flex-none gap-2 border-dashed">
                                <Video className="h-4 w-4 opacity-50" /> No Link Set
                              </Button>
                            )}
                          </div>
                        </div>

                        <div className="pt-4 border-t border-border mt-2 flex gap-3 items-center">
                          <Input
                            placeholder="Paste secure meeting link here (Zoom, Meet)..."
                            value={meetingLinks[session.id] || ""}
                            onChange={(e) => setMeetingLinks(prev => ({ ...prev, [session.id]: e.target.value }))}
                            className="flex-1 rounded-xl text-xs bg-background border-slate-200 dark:border-slate-800"
                          />
                          <Button size="sm" onClick={() => saveMeetingLink(session.id)} className="rounded-xl px-6 font-bold bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">
                            Save Link
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => deleteSession(session.id)} className="rounded-xl px-4 font-bold bg-red-500 text-white hover:bg-red-700">
                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>

              {/* Pre-Session AI Summary Side Panel */}
              <div className="space-y-6">
                <Card className="friendly-card border-l-4 border-l-primary shadow-sm bg-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
                      <Brain className="h-4 w-4 text-primary" /> AI Pre-Session Insight
                    </CardTitle>
                    <CardDescription className="text-[10px] text-muted-foreground">Patient: Alex Thompson</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 bg-muted/50 rounded-xl space-y-2">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Recent Mood Trend</p>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-foreground">Increasing stress levels</span>
                      </div>
                    </div>
                    <div className="p-3 bg-destructive/10 rounded-xl space-y-2">
                      <p className="text-[10px] font-bold text-destructive uppercase tracking-widest">Risk Analysis</p>
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-destructive" />
                        <span className="text-sm font-medium text-destructive">Moderate Risk Detected</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed italic">
                      "AI logs show Alex has expressed recurring concerns about job stability over the last 72 hours. Recommend focusing on grounding techniques today."
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reviews">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {MOCK_REVIEWS.map(review => (
                <Card key={review.id} className="friendly-card border-none shadow-sm">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-foreground">{review.user}</span>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted/30'}`} />
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground italic">"{review.comment}"</p>
                    <p className="text-[10px] text-muted-foreground/50 mt-4">{review.date}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}