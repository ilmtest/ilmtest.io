import type { Metadata } from 'next';

type OgImage = { alt: string; height: number; url: string; width: number };

type CreateMetadataInput = {
    description: string;
    image?: Partial<OgImage> & Pick<OgImage, 'url'>;
    path: string;
    title: string;
};

const baseUrl = 'https://ilmtest.io';
const siteName = 'IlmTest';
const siteDescription =
    'Islām in its original form. Explore translations, history, and tools built for the student of knowledge.';

const defaultImage: OgImage = { alt: `${siteName} logo`, height: 630, url: '/logo.svg', width: 1200 };

export const rootMetadata: Metadata = {
    applicationName: siteName,
    description: siteDescription,
    metadataBase: new URL(baseUrl),
    openGraph: {
        description: siteDescription,
        images: [defaultImage],
        siteName,
        title: siteName,
        type: 'website',
        url: baseUrl,
    },
    title: { default: siteName, template: `%s | ${siteName}` },
    twitter: { card: 'summary_large_image', description: siteDescription, images: [defaultImage.url], title: siteName },
};

export const siteMetadata = { baseUrl, defaultImage, description: siteDescription, siteName };

export function createPageMetadata({ description, image, path, title }: CreateMetadataInput): Metadata {
    const ogImage = image
        ? {
              alt: image.alt ?? defaultImage.alt,
              height: image.height ?? defaultImage.height,
              url: image.url,
              width: image.width ?? defaultImage.width,
          }
        : defaultImage;

    const canonicalUrl = new URL(path, baseUrl).toString();

    return {
        description,
        openGraph: { description, images: [ogImage], siteName, title, type: 'website', url: canonicalUrl },
        title,
        twitter: { card: 'summary_large_image', description, images: [ogImage.url], title },
    };
}
