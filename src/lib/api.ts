export function getBackendUrl(): string {
    const url = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!url) {
        console.warn("NEXT_PUBLIC_BACKEND_URL is not defined, falling back to localhost:8000");
        return "http://localhost:8000";
    }
    return url;
}
