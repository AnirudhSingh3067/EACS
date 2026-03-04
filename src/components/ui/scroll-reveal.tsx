"use client";

import { useEffect, useRef, useState, ReactNode, createContext, useContext } from "react";
import { cn } from "@/lib/utils";

const StaggerContext = createContext<{ isVisible: boolean; staggerChildren: number; indexRef: React.MutableRefObject<number> } | null>(null);

interface ScrollRevealProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
    stagger?: boolean;
    staggerChildren?: number;
}

export function ScrollReveal({
    children,
    className,
    delay = 0,
    duration = 0.7,
    stagger = false,
    staggerChildren = 0.15
}: ScrollRevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    // Reset index ref for child staggering tracking
    const indexRef = useRef(0);

    useEffect(() => {
        const currentRef = ref.current;
        if (!currentRef) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(currentRef);
                }
            },
            { threshold: 0.05, rootMargin: "-20px" } // Triggers slightly after entered view
        );

        observer.observe(currentRef);

        return () => {
            if (currentRef) observer.unobserve(currentRef);
        };
    }, []);

    if (stagger) {
        // Reset the index counter on every render to ensure consistent delays when re-rendering
        indexRef.current = 0;
        return (
            <div ref={ref} className={className}>
                <StaggerContext.Provider value={{ isVisible, staggerChildren, indexRef }}>
                    {children}
                </StaggerContext.Provider>
            </div>
        );
    }

    return (
        <div
            ref={ref}
            className={cn(
                className,
                "transition-all cubic-bezier-easing",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            )}
            style={{
                transitionDuration: `${duration}s`,
                transitionDelay: `${delay}s`,
                transitionTimingFunction: "cubic-bezier(0.25, 0.1, 0.25, 1)",
                willChange: "transform, opacity"
            }}
        >
            {children}
        </div>
    );
}

export function ScrollRevealItem({
    children,
    className,
    duration = 0.7
}: Omit<ScrollRevealProps, "stagger" | "staggerChildren" | "delay">) {
    const ctx = useContext(StaggerContext);
    // Initialize to 0 to guarantee SSR match. 
    const [itemIndex, setItemIndex] = useState(0);

    // Assign index permanently on first mount
    useEffect(() => {
        if (ctx) {
            setItemIndex(ctx.indexRef.current);
            ctx.indexRef.current += 1;
        }
    }, [ctx]);

    const delay = ctx ? itemIndex * ctx.staggerChildren : 0;
    const isVisible = ctx ? ctx.isVisible : true;

    return (
        <div
            className={cn(
                className,
                "transition-all cubic-bezier-easing",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            )}
            style={{
                transitionDuration: `${duration}s`,
                transitionDelay: `${delay}s`,
                transitionTimingFunction: "cubic-bezier(0.25, 0.1, 0.25, 1)",
                willChange: "transform, opacity"
            }}
        >
            {children}
        </div>
    );
}
