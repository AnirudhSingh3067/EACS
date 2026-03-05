'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Optionally log the error to an error reporting service here
        console.error('Unhandled application error:', error);
    }, [error]);

    return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
            <div className="space-y-6 max-w-md">
                <div className="flex justify-center">
                    <div className="rounded-full bg-destructive/10 p-4">
                        <AlertCircle className="h-12 w-12 text-destructive" />
                    </div>
                </div>
                <h2 className="text-4xl font-headline font-bold tracking-tight">
                    Something went wrong!
                </h2>
                <p className="text-lg text-muted-foreground">
                    We encountered an unexpected error. Our team has been notified.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Button size="lg" onClick={() => reset()} className="h-12 px-8">
                        Try again
                    </Button>
                    <Button size="lg" variant="outline" className="h-12 px-8" onClick={() => window.location.href = '/'}>
                        Go to Home
                    </Button>
                </div>
            </div>
        </div>
    );
}
