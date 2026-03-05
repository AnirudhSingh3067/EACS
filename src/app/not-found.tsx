import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
            <div className="space-y-6">
                <div className="flex justify-center">
                    <div className="rounded-full bg-primary/10 p-4">
                        <ShieldAlert className="h-12 w-12 text-primary" />
                    </div>
                </div>
                <h1 className="text-5xl font-headline font-bold tracking-tight">
                    Page Not Found
                </h1>
                <p className="text-xl text-muted-foreground max-w-md mx-auto">
                    We couldn't find the page you're looking for. It might have been moved or doesn't exist.
                </p>
                <div className="flex justify-center pt-4">
                    <Button size="lg" className="h-12 px-8" asChild>
                        <Link href="/">Return to Home</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
