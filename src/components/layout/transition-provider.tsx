"use client";

import { AnimatePresence } from "framer-motion";

export function TransitionProvider({ children }: { children: React.ReactNode }) {
    return (
        <AnimatePresence mode="popLayout" initial={false}>
            {children}
        </AnimatePresence>
    );
}
