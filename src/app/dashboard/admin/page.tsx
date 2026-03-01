"use client";

import { useCollection, useFirestore } from "@/firebase";
import { collection, query, where, doc, updateDoc, orderBy, limit } from "firebase/firestore";
import { useMemoFirebase } from "@/firebase/provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  AlertCircle, 
  DollarSign, 
  ShieldAlert,
  Loader2,
  Activity
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const RISK_LEVELS = [
  { name: 'Critical', value: 4, color: '#ef4444' },
  { name: 'High', value: 12, color: '#f59e0b' },
  { name: 'Moderate', value: 45, color: '#3b82f6' },
  { name: 'Low', value: 139, color: '#10b981' },
];

export default function AdminDashboard() {
  const db = useFirestore();

  const highRiskQuery = useMemoFirebase(() => {
    return query(collection(db, "ai_chat_logs"), where("riskLevel", "in", ["high", "critical"]), orderBy("timestamp", "desc"), limit(10));
  }, [db]);
  const { data: flaggedChats, isLoading: loadingChats } = useCollection(highRiskQuery);

  const pendingPsychQuery = useMemoFirebase(() => {
    return query(collection(db, "psychologists"), where("isApproved", "==", false));
  }, [db]);
  const { data: pendingPsychs, isLoading: loadingPsychs } = useCollection(pendingPsychQuery);

  const approvePsych = async (id: string) => {
    await updateDoc(doc(db, "psychologists", id), { isApproved: true });
  };

  return (
    <div className="bg-background min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <h1 className="text-3xl font-headline font-bold mb-8 text-foreground">Clinical Oversight Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="friendly-card border-none shadow-sm">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-1">Total Users</p>
                <h3 className="text-3xl font-bold text-foreground">1,248</h3>
              </div>
              <Users className="h-10 w-10 text-primary/20" />
            </CardContent>
          </Card>
          <Card className="friendly-card border-none shadow-sm">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-1">High Risk Cases</p>
                <h3 className="text-3xl font-bold text-amber-500">16</h3>
              </div>
              <ShieldAlert className="h-10 w-10 text-amber-500/20" />
            </CardContent>
          </Card>
          <Card className="friendly-card border-none shadow-sm">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-1">Revenue</p>
                <h3 className="text-3xl font-bold text-emerald-500">$12,400</h3>
              </div>
              <DollarSign className="h-10 w-10 text-emerald-500/20" />
            </CardContent>
          </Card>
          <Card className="friendly-card border-none shadow-sm bg-destructive text-destructive-foreground">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest font-bold mb-1 opacity-80">Critical Alerts</p>
                <h3 className="text-3xl font-bold">3</h3>
              </div>
              <AlertCircle className="h-10 w-10 opacity-40" />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <Card className="lg:col-span-2 friendly-card border-none shadow-sm">
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2 text-foreground">
                <Activity className="h-5 w-5 text-primary" /> Active Risk Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingChats ? <Loader2 className="animate-spin text-primary" /> : (
                <div className="space-y-4">
                  {flaggedChats?.map(chat => (
                    <div key={chat.id} className={`p-4 border rounded-2xl flex items-center justify-between transition-colors ${chat.riskLevel === 'critical' ? 'bg-destructive/10 border-destructive/20' : 'bg-amber-500/10 border-amber-500/20'}`}>
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-sm text-foreground">Patient ID: {chat.userId.substring(0, 8)}</span>
                          <Badge variant={chat.riskLevel === 'critical' ? "destructive" : "secondary"} className="uppercase text-[10px]">
                            {chat.riskLevel} Risk
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1 italic">"{chat.message}"</p>
                      </div>
                      <Button variant="outline" size="sm" className="bg-card border-border">Review Case</Button>
                    </div>
                  ))}
                  {!flaggedChats?.length && <p className="text-sm text-muted-foreground text-center py-8">No high-risk logs to display.</p>}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-1 friendly-card border-none shadow-sm">
            <CardHeader>
              <CardTitle className="font-headline text-foreground">Patient Risk Distribution</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="h-[240px]">
                 <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie
                        data={RISK_LEVELS}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                     >
                       {RISK_LEVELS.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={entry.color} />
                       ))}
                     </Pie>
                     <Tooltip 
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '1rem', color: 'hsl(var(--foreground))' }}
                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                     />
                   </PieChart>
                 </ResponsiveContainer>
               </div>
               <div className="grid grid-cols-2 gap-2 mt-4">
                  {RISK_LEVELS.map(level => (
                    <div key={level.name} className="flex items-center gap-2 text-xs">
                      <div className="h-2 w-2 rounded-full" style={{backgroundColor: level.color}}></div>
                      <span className="text-muted-foreground">{level.name}</span>
                      <span className="font-bold ml-auto text-foreground">{level.value}</span>
                    </div>
                  ))}
               </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <Card className="friendly-card border-none shadow-sm">
             <CardHeader>
               <CardTitle className="font-headline text-foreground">Psychologist Applications</CardTitle>
             </CardHeader>
             <CardContent className="space-y-6">
               {loadingPsychs ? <Loader2 className="animate-spin text-primary" /> : (
                 <>
                   {pendingPsychs?.map(psych => (
                     <div key={psych.id} className="flex items-center justify-between p-4 border border-border rounded-2xl bg-muted/20">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {psych.id.substring(0, 1)}
                          </div>
                          <div>
                             <p className="font-bold text-sm text-foreground">Applicant {psych.id.substring(0, 5)}</p>
                             <p className="text-xs text-muted-foreground">{psych.experienceYears}y exp • {psych.specialization?.[0]}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => approvePsych(psych.id)}>Approve</Button>
                          <Button variant="ghost" size="sm" className="text-foreground">Details</Button>
                        </div>
                     </div>
                   ))}
                   {!pendingPsychs?.length && <p className="text-sm text-muted-foreground">No pending applications.</p>}
                 </>
               )}
             </CardContent>
           </Card>

           <Card className="friendly-card border-none shadow-sm">
             <CardHeader>
               <CardTitle className="font-headline text-foreground">System Performance</CardTitle>
             </CardHeader>
             <CardContent>
                <div className="space-y-6">
                   <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-foreground">Session Success Rate</span>
                      <span className="text-sm font-bold text-emerald-500">98.2%</span>
                   </div>
                   <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[98.2%]"></div>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-foreground">AI Accuracy (Clinically Verified)</span>
                      <span className="text-sm font-bold text-primary">94.5%</span>
                   </div>
                   <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                      <div className="bg-primary h-full w-[94.5%]"></div>
                   </div>
                </div>
             </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}