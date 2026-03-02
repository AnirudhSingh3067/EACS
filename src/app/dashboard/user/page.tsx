"use client";

import { useState, useMemo, useEffect } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp,
  History,
  Settings,
  Plus,
  Brain,
  User as UserIcon,
  Loader2,
  Heart,
  EyeOff,
  Eye,
  Flame,
  Award,
  Sparkles,
  ArrowRight,
  Smile,
  CheckCircle2,
  Zap,
  X,
  Calendar,
  Clock,
  Video
} from "lucide-react";
import { Line, LineChart, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { AnimatePresence, motion } from "framer-motion";
import { AIChatDrawer } from "@/components/chat/ai-chat-drawer";
import { useUser, useDoc, useFirestore, useCollection } from "@/firebase";
import { doc, collection, serverTimestamp, query, where, orderBy, limit } from "firebase/firestore";
import { useMemoFirebase } from "@/firebase/provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { addDocumentNonBlocking, updateDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { cn } from "@/lib/utils";

const MOODS = [
  { label: "Happy", icon: "😊", color: "#FBBF24", desc: "Feeling sunny!", score: 5 },
  { label: "Calm", icon: "😌", color: "#3b82f6", desc: "Just chillin'.", score: 4 },
  { label: "Neutral", icon: "😐", color: "#94a3b8", desc: "Steady as a rock.", score: 3 },
  { label: "Stressed", icon: "😫", color: "#f59e0b", desc: "A bit heavy.", score: 2 },
  { label: "Anxious", icon: "😨", color: "#8b5cf6", desc: "Feeling jittery.", score: 2 },
  { label: "Sad", icon: "😢", color: "#ef4444", desc: "Tough day.", score: 1 }
];

const ACHIEVEMENTS = [
  { id: "1", title: "First Step", icon: <Award className="h-5 w-5" />, color: "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400", desc: "Logged your first mood!" },
  { id: "2", title: "Zen Master", icon: <Flame className="h-5 w-5" />, color: "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400", desc: "7-day log streak." },
  { id: "3", title: "Soul Searcher", icon: <Sparkles className="h-5 w-5" />, color: "bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400", desc: "30 logs complete." }
];

export default function UserDashboard() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [moodNote, setMoodNote] = useState("");
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { user, isUserLoading } = useUser();
  const db = useFirestore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const userProfileRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, "users", user.uid);
  }, [db, user?.uid]);

  const { data: profile, isLoading: isProfileLoading } = useDoc(userProfileRef);

  const moodLogsQuery = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return query(
      collection(db, "mood_logs"),
      where("userId", "==", user.uid),
      orderBy("timestamp", "desc"),
      limit(7)
    );
  }, [db, user?.uid]);

  const { data: moodLogs } = useCollection(moodLogsQuery);

  const stats = useMemo(() => {
    if (!moodLogs || moodLogs.length === 0) return { avg: 0, frequent: "N/A" };
    const relevantLogs = moodLogs.slice(0, 4);
    const scores = relevantLogs.map(log => MOODS.find(m => m.label === log.mood)?.score || 3);
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;

    const frequency: Record<string, number> = {};
    moodLogs.forEach(log => frequency[log.mood] = (frequency[log.mood] || 0) + 1);
    const frequent = Object.entries(frequency).reduce((a, b) => a[1] > b[1] ? a : b)[0];

    return { avg: avg.toFixed(1), frequent };
  }, [moodLogs]);

  const chartData = useMemo(() => {
    if (!moodLogs || !isMounted) return [];
    return [...moodLogs].slice(0, 4).reverse().map(log => {
      const dateObj = log.timestamp?.seconds ? new Date(log.timestamp.seconds * 1000) : new Date();
      return {
        date: dateObj.toLocaleDateString('en-US', { weekday: 'short' }),
        value: MOODS.find(m => m.label === log.mood)?.score || 3,
        mood: log.mood
      };
    });
  }, [moodLogs, isMounted]);

  const handleLogMood = (mood: string) => {
    if (!user) return;

    addDocumentNonBlocking(collection(db, "mood_logs"), {
      userId: user.uid,
      mood,
      note: moodNote,
      timestamp: serverTimestamp()
    });

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);

    toast({
      title: "Vibe Logged! ✨",
      description: `We've noted that you're feeling ${mood.toLowerCase()}. You're doing great!`
    });
    setMoodNote("");
    setSelectedMood(null);
  };

  const toggleAnonymous = () => {
    if (!userProfileRef || !profile) return;
    updateDocumentNonBlocking(userProfileRef, { isAnonymous: !profile.isAnonymous });
    toast({ title: "Privacy Switched", description: `You are now ${!profile.isAnonymous ? "incognito" : "back to yourself"}.` });
  };

  // -----------------------------------------
  // Fetch session history for the drawer
  // -----------------------------------------
  const sessionsQuery = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return query(
      collection(db, "sessions"),
      where("patientId", "==", user.uid),
      orderBy("startTime", "asc")
    );
  }, [user?.uid, db]);

  const { data: rawSessionsData, isLoading: isSessionsLoading } = useCollection(sessionsQuery);

  const sessions = useMemo(() => {
    if (!rawSessionsData || !Array.isArray(rawSessionsData)) return [];

    const upcoming = rawSessionsData.filter((s: any) => s.status === "upcoming");
    const past = rawSessionsData.filter((s: any) => s.status === "completed" || s.status === "cancelled");

    return [...upcoming, ...past];
  }, [rawSessionsData]);

  if (isUserLoading || isProfileLoading || !isMounted) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-sm font-medium text-muted-foreground font-headline animate-pulse">Setting the mood for you...</p>
        </div>
      </div>
    );
  }

  const displayName = profile?.isAnonymous ? (profile?.nickname || "Anonymous Friend") : (profile?.name || user?.displayName || "Friend");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800";
      case "completed":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
      case "cancelled":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 bg-background py-10 w-full overflow-x-hidden">
        <div className="container mx-auto px-4 max-w-6xl space-y-10">

          {/* Profile Header Section */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 px-4">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <Avatar className="h-20 w-20 border-4 border-background shadow-xl transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                  {!profile?.isAnonymous && <AvatarImage src={`https://picsum.photos/seed/${user?.uid}/200`} />}
                  <AvatarFallback className="bg-primary/5 text-primary">
                    {profile?.isAnonymous ? <EyeOff className="h-8 w-8" /> : <UserIcon className="h-8 w-8" />}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 bg-amber-400 p-1.5 rounded-full shadow-lg animate-float">
                  <Flame className="h-4 w-4 text-white" />
                </div>
              </div>
              <div className="space-y-1">
                <h1 className="text-3xl font-headline font-bold text-foreground tracking-tight">Hey {displayName}! 👋</h1>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 rounded-full font-bold text-xs animate-pulse">
                    3 Day Streak! 🔥
                  </span>
                  <p className="text-sm text-muted-foreground font-medium">Ready for your daily check-in?</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="bg-card rounded-2xl shadow-sm border-border" onClick={() => setHistoryOpen(true)}>
                <History className="h-4 w-4 mr-2" />
                Session History
              </Button>
              <Button variant="outline" className="bg-card rounded-2xl shadow-sm border-border" onClick={toggleAnonymous}>
                {profile?.isAnonymous ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
                {profile?.isAnonymous ? "Reveal Me" : "Go Incognito"}
              </Button>
              <Button variant="outline" size="icon" className="bg-card rounded-2xl shadow-sm">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Daily Mood Tracker */}
            <div className="lg:col-span-1 space-y-8">
              <Card className="friendly-card overflow-hidden">
                <CardHeader className="pb-0">
                  <CardTitle className="text-xl font-bold font-headline flex items-center gap-2">
                    <Heart className="h-6 w-6 text-red-500 animate-float" /> How's your heart?
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">Pick the emoji that matches your vibe.</p>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  {showSuccess ? (
                    <div className="py-10 text-center animate-in zoom-in-95 duration-500">
                      <div className="h-20 w-20 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="h-10 w-10" />
                      </div>
                      <h4 className="text-xl font-bold text-foreground">Vibe Saved!</h4>
                      <p className="text-sm text-muted-foreground">You're taking great care of yourself.</p>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-3 gap-4">
                        {MOODS.map(m => (
                          <button
                            key={m.label}
                            onClick={() => setSelectedMood(m.label)}
                            className={cn(
                              "flex flex-col items-center p-4 rounded-[1.5rem] border-2 transition-all duration-300 active:scale-90",
                              selectedMood === m.label
                                ? "bg-primary/10 border-primary shadow-inner scale-105"
                                : "bg-muted/50 border-transparent hover:bg-card hover:border-border hover:scale-110"
                            )}
                          >
                            <span className="text-3xl mb-1">{m.icon}</span>
                            <span className="text-[10px] font-bold uppercase tracking-tight text-muted-foreground">{m.label}</span>
                          </button>
                        ))}
                      </div>
                      {selectedMood && (
                        <div className="space-y-4 animate-in slide-in-from-top-4 fade-in duration-500">
                          <p className="text-xs font-bold text-primary text-center uppercase tracking-widest">
                            "{MOODS.find(m => m.label === selectedMood)?.desc}"
                          </p>
                          <Textarea
                            placeholder="What's making you feel this way?"
                            className="rounded-2xl border-border bg-muted/30 min-h-[100px] transition-all focus:bg-card"
                            value={moodNote}
                            onChange={(e) => setMoodNote(e.target.value)}
                          />
                          <Button className="w-full cta-glow" onClick={() => handleLogMood(selectedMood)}>
                            Lock in my Vibe
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Achievements Card */}
              <Card className="friendly-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-bold font-headline flex items-center gap-2">
                    <Award className="h-5 w-5 text-amber-500" /> Your Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <AnimatePresence>
                    {ACHIEVEMENTS.map((ach, idx) => (
                      <motion.div
                        key={ach.id}
                        initial={{ opacity: 0, y: 16, scale: 0.995 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.3, delay: idx * 0.05, ease: [0.22, 1, 0.36, 1] }}
                        className="flex items-center gap-4 p-3 rounded-2xl bg-muted/30 group hover:bg-card hover:shadow-sm transition-all duration-300"
                      >
                        <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110 group-hover:rotate-12", ach.color)}>
                          {ach.icon}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">{ach.title}</p>
                          <p className="text-[10px] text-muted-foreground">{ach.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </div>

            {/* Analytics and Insights */}
            <div className="lg:col-span-2 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Weekly Reflection Upgrade */}
                <Card className="friendly-card col-span-1 md:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-bold font-headline flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" /> Weekly Reflection
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
                      <div className="md:col-span-2 space-y-6">
                        <div className="h-[220px] w-full">
                          {isMounted && chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.1)" />
                                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis hide domain={[0, 6]} />
                                <Tooltip
                                  content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                      return (
                                        <div className="bg-card border border-border shadow-xl rounded-2xl p-3 text-xs">
                                          <p className="font-bold text-primary">{payload[0].payload.mood}</p>
                                          <p className="text-muted-foreground">Score: {payload[0].value}</p>
                                        </div>
                                      );
                                    }
                                    return null;
                                  }}
                                />
                                <Line
                                  type="monotone"
                                  dataKey="value"
                                  stroke="hsl(var(--primary))"
                                  strokeWidth={4}
                                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 6, stroke: 'white' }}
                                  activeDot={{ r: 8, strokeWidth: 0 }}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-3 bg-muted/20 rounded-[2rem] p-6 border-2 border-dashed border-border">
                              <Smile className="h-10 w-10 text-muted-foreground/30" />
                              <p className="text-sm text-muted-foreground font-medium">Log your first vibe to see your mood map!</p>
                            </div>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-muted/30 rounded-2xl flex flex-col items-center justify-center text-center">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Average Mood</p>
                            <span className="text-2xl font-bold text-primary">{stats.avg} / 5.0</span>
                          </div>
                          <div className="p-4 bg-muted/30 rounded-2xl flex flex-col items-center justify-center text-center">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Top Feeling</p>
                            <span className="text-2xl font-bold text-primary">{stats.frequent}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="p-6 bg-primary/5 dark:bg-primary/10 rounded-3xl border border-primary/10 h-full flex flex-col">
                          <div className="flex items-center gap-2 mb-4">
                            <Brain className="h-5 w-5 text-primary" />
                            <h4 className="font-bold text-sm">AI Soul Insight</h4>
                          </div>
                          <p className="text-sm text-foreground/80 leading-relaxed italic mb-6">
                            "It looks like you've been finding more moments of calm recently. Your resilience is showing through in how you handle stress. Keep prioritizing these small moments of peace, as they are building a strong foundation for your long-term wellness."
                          </p>
                          <div className="mt-auto space-y-3">
                            <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Actionable Tip</p>
                            <div className="flex items-start gap-3 p-3 bg-white dark:bg-slate-900 rounded-xl shadow-sm">
                              <Zap className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                              <p className="text-xs font-medium">Try a 2-minute box breathing session before bed tonight.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions & Sessions */}
                <Card className="friendly-card md:col-span-2">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="font-headline text-xl font-bold">Your Healing Path</CardTitle>
                    <Button onClick={() => setIsChatOpen(true)} className="cta-glow">
                      <Plus className="mr-2 h-4 w-4" /> Start AI Chat
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {moodLogs && moodLogs.length > 0 ? (
                        <div className="space-y-4">
                          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Recent Reflections</p>
                          <AnimatePresence>
                            {moodLogs.slice(0, 3).map((log, idx) => (
                              <motion.div
                                key={log.id}
                                initial={{ opacity: 0, y: 16, scale: 0.995 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.3, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                                className="flex items-center justify-between p-4 bg-muted/30 rounded-[1.5rem] group hover:bg-card hover:shadow-md transition-all duration-300"
                              >
                                <div className="flex items-center gap-4">
                                  <span className="text-2xl transition-transform group-hover:scale-125">{MOODS.find(m => m.label === log.mood)?.icon}</span>
                                  <div>
                                    <p className="font-bold text-sm text-foreground">{log.mood}</p>
                                    <p className="text-[10px] text-muted-foreground">
                                      {log.timestamp?.seconds ? new Date(log.timestamp.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                                    </p>
                                  </div>
                                </div>
                                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <div className="text-center py-10 space-y-4">
                          <div className="h-20 w-20 bg-muted/30 rounded-full flex items-center justify-center mx-auto">
                            <History className="h-8 w-8 text-muted-foreground/30" />
                          </div>
                          <p className="text-sm text-muted-foreground">No session history yet. Let's start your journey!</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        <AIChatDrawer open={isChatOpen} onOpenChange={setIsChatOpen} />

        {/* Drawer Overlay */}
        {historyOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40 transition-opacity"
            onClick={() => setHistoryOpen(false)}
          />
        )}

        {/* Slide-in Drawer */}
        <div
          className={cn(
            "fixed inset-y-0 right-0 w-full md:w-[400px] bg-background dark:bg-gray-900 shadow-2xl z-50 overflow-y-auto transform transition-all duration-[250ms] ease-out",
            historyOpen ? "translate-y-0 opacity-100 scale-100 pointer-events-auto" : "translate-y-[24px] opacity-0 scale-[0.98] pointer-events-none"
          )}
        >
          <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-background/95 backdrop-blur z-10">
            <h2 className="font-headline font-bold text-xl">Session History</h2>
            <Button variant="ghost" size="icon" onClick={() => setHistoryOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="p-6">
            {isSessionsLoading ? (
              <div className="space-y-4 mt-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-28 rounded-2xl shimmer shadow-sm opacity-50 border border-border" />
                ))}
              </div>
            ) : sessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-20 bg-muted/20 rounded-3xl border border-dashed border-border mt-4">
                <Calendar className="h-10 w-10 text-muted-foreground/40 mb-3" />
                <p className="text-sm text-muted-foreground font-medium">No sessions found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sessions.map((session: any) => {
                  const startDate = session.startTime?.toDate ? session.startTime.toDate() : new Date();
                  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

                  return (
                    <div
                      key={session.id}
                      className="bg-card rounded-2xl p-5 border border-border shadow-sm relative overflow-hidden flex flex-col gap-3 group hover:border-primary/50 transition-colors"
                    >
                      <div className={cn("absolute top-0 left-0 w-1 h-full", session.status === 'upcoming' ? 'bg-blue-500' : session.status === 'cancelled' ? 'bg-red-500' : 'bg-emerald-500')} />

                      <div className="flex justify-between items-start ml-2 text-sm">
                        <span className={cn("text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border", getStatusColor(session.status))}>
                          {session.status}
                        </span>
                      </div>

                      <div className="space-y-3 ml-2 mt-1">
                        <div className="flex items-center text-foreground font-medium text-sm">
                          <UserIcon className="h-4 w-4 mr-2 text-primary" />
                          <span>{session.practitionerName || `Practitioner: ${session.practitionerId.substring(0, 6)}...`}</span>
                        </div>

                        <div className="flex items-center justify-between gap-4 mt-1">
                          <div className="space-y-2">
                            <div className="flex items-center text-muted-foreground text-xs">
                              <Calendar className="h-3.5 w-3.5 mr-2" />
                              <span>{format(startDate, "MMM d, yyyy")}</span>
                            </div>

                            <div className="flex items-center text-muted-foreground text-xs">
                              <Clock className="h-3.5 w-3.5 mr-2" />
                              <span>
                                {format(startDate, "h:mm a")} - {format(endDate, "h:mm a")}
                              </span>
                            </div>
                          </div>

                          {session.meetingLink && (
                            <a
                              href={session.meetingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center whitespace-nowrap text-xs font-semibold transition-colors focus-visible:outline-none h-8 px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-sm"
                            >
                              <Video className="h-3.5 w-3.5 mr-1.5" /> Join Meeting
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}