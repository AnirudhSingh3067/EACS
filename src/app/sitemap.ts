import { MetadataRoute } from 'next';
import { MOCK_PSYCHOLOGISTS } from '@/lib/mock-data';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://mindbridge.vercel.app';

    // Static routes
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: `${baseUrl}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${baseUrl}/psychologists`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
    ];

    // Dynamic psychologist routes
    const psychologistRoutes: MetadataRoute.Sitemap = MOCK_PSYCHOLOGISTS.map(
        (psychologist) => ({
            url: `${baseUrl}/psychologists/${psychologist.id}`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        })
    );

    return [...staticRoutes, ...psychologistRoutes];
}
