
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BrainCircuit, Loader2 } from "lucide-react";
import { useAuth, useFirestore } from "@/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const auth = useAuth();
  const db = useFirestore();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });

      // Create user profile in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name,
        email: user.email,
        role: role,
        createdAt: serverTimestamp(),
      });

      // If psychologist, create initial empty profile
      if (role === "psychologist") {
        await setDoc(doc(db, "psychologists", user.uid), {
          uid: user.uid,
          isApproved: false,
          rating: 0,
          specialization: [],
          experienceYears: 0,
          licenseNumber: "",
          pricePerSession: 0,
          availabilitySlots: []
        });
      }

      toast({ title: "Account Created", description: "Welcome to MindBridge!" });
      router.push(role === "psychologist" ? "/dashboard/psychologist" : "/dashboard/user");
    } catch (error: any) {
      toast({ variant: "destructive", title: "Signup Failed", description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md shadow-xl border-border">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <BrainCircuit className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-headline font-bold">Create Account</CardTitle>
          <CardDescription>Join our mental health community</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            <div className="space-y-3 py-2">
              <Label>Register as:</Label>
              <RadioGroup value={role} onValueChange={setRole} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="user" id="r-user" />
                  <Label htmlFor="r-user" className="font-normal cursor-pointer">Patient</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="psychologist" id="r-psych" />
                  <Label htmlFor="r-psych" className="font-normal cursor-pointer">Psychologist</Label>
                </div>
              </RadioGroup>
            </div>

            <Button type="submit" className="w-full h-11" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign Up"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center">
          <p className="text-sm text-muted-foreground w-full">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-bold hover:underline">Sign In</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
