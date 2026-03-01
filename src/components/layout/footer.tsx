import Link from "next/link";
import { BrainCircuit } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-card py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <BrainCircuit className="h-6 w-6 text-primary" />
              <span className="text-xl font-headline font-bold text-primary">MindBridge</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              MindBridge connects individuals with licensed mental health professionals, enhanced by AI for real-time emotional triage and support.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-foreground">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/psychologists" className="hover:text-primary transition-colors">Our Psychologists</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">How it Works</Link></li>
              <li><Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-foreground">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/help" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold mb-4 text-foreground">Emergency</h4>
            <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/20">
              <p className="text-xs text-destructive font-medium leading-relaxed">
                If you are in a life-threatening situation or need immediate help, please call emergency services or a crisis hotline immediately.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border text-center text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} MindBridge Health. All rights reserved.</p>
          <p className="mt-2 leading-relaxed max-w-2xl mx-auto">Disclaimer: MindBridge AI is not a medical device and should not replace professional human diagnosis or therapy.</p>
        </div>
      </div>
    </footer>
  );
}