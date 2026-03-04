"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BrainCircuit, Menu, UserCircle, LogOut, Settings, LayoutDashboard, Bell, BookOpen, Sun, Moon, Users, Brain } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useUser, useAuth, useCollection, useFirestore } from "@/firebase";
import { signOut } from "firebase/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMemoFirebase } from "@/firebase/provider";
import { query, collection, where, orderBy, limit } from "firebase/firestore";

export function Navbar() {
  const { user } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const navItems = [
    { href: "/psychologists", label: "Directory", icon: Users },
    { href: "/resources", label: "Resources", icon: BookOpen },
    { href: "/about", label: "Approach", icon: Brain },
  ];

  useEffect(() => {
    setIsMounted(true);
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const notificationsQuery = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return query(
      collection(db, "notifications"),
      where("userId", "==", user.uid),
      limit(10)
    );
  }, [db, user?.uid]);

  const { data: notifications } = useCollection(notificationsQuery);

  const handleLogout = async () => {
    await signOut(auth);
  };

  const formatTimestamp = (timestamp: any) => {
    if (!isMounted || !timestamp?.seconds) return 'Just now';
    try {
      return new Date(timestamp.seconds * 1000).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return 'Recently';
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/95 backdrop-blur-md dark:border-white/5 dark:bg-black/95">
      <div className="container mx-auto flex h-18 items-center justify-between px-4 py-3">
        {/* Logo - Far Left */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center text-white logo-aura">
              <BrainCircuit className="h-6 w-6" />
            </div>
            <span className="text-2xl font-headline font-bold text-foreground tracking-tight">MindBridge</span>
          </Link>
        </div>

        {/* Navigation & Utilities - Far Right */}
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`relative flex items-center justify-center h-10 px-3 transition-all duration-300 ease-out group ${isActive ? "text-white" : "text-zinc-400 hover:text-zinc-200"
                    }`}
                >
                  <Icon className={`h-5 w-5 shrink-0 transition-colors duration-300 ${isActive ? "text-purple-400" : "group-hover:text-zinc-200"}`} strokeWidth={1.5} />

                  <span
                    className={`whitespace-nowrap overflow-hidden transition-all duration-300 ease-out ${isActive ? "max-w-[100px] ml-2 opacity-100" : "max-w-0 opacity-0 ml-0"
                      }`}
                  >
                    {item.label}
                  </span>

                  {/* Neon Glow Active Indicator */}
                  {isActive && (
                    <span className="absolute -bottom-[1px] left-2 right-2 h-[2px] bg-purple-500 rounded-t-full shadow-[0_2px_10px_3px_rgba(168,85,247,0.6)]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Spacer between Nav and Utilities */}
          <div className="hidden md:block w-px h-6 bg-zinc-800" />

          {/* Right-side Utilities */}
          <div className="flex items-center gap-2 md:gap-4">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full text-muted-foreground hover:text-primary transition-colors">
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>

            <div className="hidden md:flex items-center gap-3">
              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full">
                      <Bell className="h-5 w-5 text-muted-foreground" />
                      {notifications && notifications.some(n => !n.readStatus) && (
                        <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-background"></span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80 p-0 rounded-2xl shadow-2xl border-border overflow-hidden bg-card text-card-foreground">
                    <div className="p-4 bg-muted border-b">
                      <h4 className="font-bold text-sm">Notifications</h4>
                    </div>
                    <div className="max-h-96 overflow-auto">
                      {notifications?.map(n => (
                        <div key={n.id} className={`p-4 border-b last:border-0 text-xs ${!n.readStatus ? 'bg-primary/5' : ''}`}>
                          <p className="leading-relaxed">{n.message}</p>
                          <p className="text-[10px] text-muted-foreground mt-2">
                            {formatTimestamp(n.timestamp)}
                          </p>
                        </div>
                      ))}
                      {!notifications?.length && <p className="p-8 text-center text-xs text-muted-foreground">No notifications yet</p>}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {!user ? (
                <>
                  <Button variant="ghost" asChild className="font-semibold text-muted-foreground">
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <Button variant="default" asChild className="bg-primary shadow-md font-bold px-6 text-primary-foreground">
                    <Link href="/signup">Get Started</Link>
                  </Button>
                </>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 overflow-hidden ring-2 ring-muted hover:ring-primary/20 transition-all">
                      <Avatar className="h-full w-full">
                        <AvatarImage src={`https://picsum.photos/${user.isAnonymous ? 'seed/guest' : `seed/${user.uid}`}/100`} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          <UserCircle className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 p-2 rounded-2xl shadow-2xl border-border bg-card text-card-foreground">
                    <DropdownMenuLabel className="font-headline font-bold p-3">Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="p-3 rounded-xl cursor-pointer">
                      <Link href="/dashboard/user" className="flex items-center gap-3">
                        <LayoutDashboard className="h-4 w-4" /> Patient Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="p-3 rounded-xl cursor-pointer">
                      <Link href="/dashboard/psychologist" className="flex items-center gap-3">
                        <Settings className="h-4 w-4" /> Professional Panel
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="p-3 rounded-xl cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/30">
                      <div className="flex items-center gap-3">
                        <LogOut className="h-4 w-4" /> Sign Out
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-2 rounded-2xl mt-2 bg-card text-card-foreground">
                <DropdownMenuItem asChild className="p-3 rounded-xl"><Link href="/psychologists">Directory</Link></DropdownMenuItem>
                <DropdownMenuItem asChild className="p-3 rounded-xl"><Link href="/resources">Resources</Link></DropdownMenuItem>
                <DropdownMenuItem asChild className="p-3 rounded-xl"><Link href="/about">Approach</Link></DropdownMenuItem>
                <DropdownMenuSeparator />
                {user ? (
                  <>
                    <DropdownMenuItem asChild className="p-3 rounded-xl"><Link href="/dashboard/user">Dashboard</Link></DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="p-3 rounded-xl text-red-600">Sign Out</DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem asChild className="p-3 rounded-xl"><Link href="/login">Sign In</Link></DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}