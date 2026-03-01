"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Calendar, Clock, Loader2, RefreshCw } from "lucide-react";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, where, orderBy, Timestamp } from "firebase/firestore";

interface Session {
    id: string;
    patientId: string;
    practitionerId: string;
    startTime: Timestamp | any;
    status: "upcoming" | "completed";
    meetingLink?: string;
    createdAt: any;
}

export function PatientHistoryPanel() {
    const { user } = useUser();
    const db = useFirestore();

    const targetQuery = useMemoFirebase(() => {
        if (!user?.uid) return null;
        return query(
            collection(db, "sessions"),
            where("patientId", "==", user.uid),
            orderBy("startTime", "asc")
        );
    }, [user?.uid, db]);

    const { data: sessionsData, isLoading } = useCollection<Session>(targetQuery);

    const sessions = (sessionsData && Array.isArray(sessionsData)) ? sessionsData : [];

    const getStatusColor = (status: Session["status"]) => {
        switch (status) {
            case "upcoming":
                return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800";
            case "completed":
                return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
            default:
                return "bg-muted text-muted-foreground";
        }
    };

    return (
        <div className="w-80 h-screen sticky top-0 overflow-y-auto border-r border-border bg-card/50 flex flex-col shrink-0">
            <div className="p-6 border-b border-border sticky top-0 bg-background/95 backdrop-blur z-10 flex justify-between items-center">
                <div>
                    <h2 className="font-headline font-bold text-lg text-foreground">Session History</h2>
                    <p className="text-sm text-muted-foreground">Your recent appointments</p>
                </div>
                <button
                    disabled={true}
                    className="p-2 rounded-full hover:bg-muted transition-colors disabled:opacity-50"
                    title="Live sync active"
                >
                    <RefreshCw className={`h-4 w-4 text-emerald-500`} />
                </button>
            </div>

            <div className="p-4 flex-1">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-40 space-y-4 text-muted-foreground">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm font-medium">Loading history...</p>
                    </div>
                ) : sessions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 space-y-3 text-center px-4 bg-muted/20 rounded-2xl border border-dashed border-border mt-4">
                        <Calendar className="h-8 w-8 text-muted-foreground/40" />
                        <p className="text-sm text-muted-foreground font-medium">No sessions found</p>
                    </div>
                ) : (
                    <div className="space-y-4 mt-2">
                        {sessions.map((session) => {
                            const startDate = session.startTime?.toDate ? session.startTime.toDate() : new Date();
                            const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
                            const hasLink = !!session.meetingLink?.trim();

                            return (
                                <div
                                    key={session.id}
                                    className="bg-background rounded-2xl p-4 border border-border/60 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden flex flex-col gap-3"
                                >
                                    <div className={`absolute top-0 left-0 w-1 h-full ${session.status === 'upcoming' ? 'bg-blue-500' : 'bg-emerald-500'}`} />

                                    <div className="flex justify-between items-start mb-3 ml-1">
                                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${getStatusColor(session.status)}`}>
                                            {session.status}
                                        </span>
                                        {hasLink && (
                                            <a
                                                href={session.meetingLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-primary text-primary-foreground font-bold text-xs py-1.5 px-3 rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
                                            >
                                                Join Room
                                            </a>
                                        )}
                                    </div>

                                    <div className="space-y-2 ml-1">
                                        <div className="flex items-center text-foreground font-medium">
                                            <Calendar className="h-4 w-4 mr-2 text-primary" />
                                            <span className="text-sm">{format(startDate, "MMM d, yyyy")}</span>
                                        </div>

                                        <div className="flex items-center text-muted-foreground text-sm">
                                            <Clock className="h-4 w-4 mr-2" />
                                            <span>
                                                {format(startDate, "h:mm a")} - {format(endDate, "h:mm a")}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
