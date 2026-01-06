# Static Assets for ChaosFix Web

This directory contains static assets for the ChaosFix landing page.

## Required Assets

The following assets are needed for proper SEO and branding:

### Favicon and Icons

- `favicon.ico` - 32x32 favicon for browser tabs
- `icon-192.png` - 192x192 PNG icon for PWA/Android
- `icon-512.png` - 512x512 PNG icon for PWA splash screens
- `apple-touch-icon.png` - 180x180 PNG for iOS home screen

### Open Graph Images

- `og-image.png` - 1200x630 Open Graph image for social sharing (Facebook, LinkedIn)
- `twitter-image.png` - 1200x600 Twitter card image (or use og-image.png)

## Image Guidelines

### Open Graph Image (og-image.png)

- Dimensions: 1200x630 pixels (1.91:1 aspect ratio)
- Format: PNG or JPG
- File size: Under 8MB (recommended under 1MB)
- Content: Include ChaosFix logo, tagline, and visually appealing terminal/code imagery

### Twitter Card Image (twitter-image.png)

- Dimensions: 1200x600 pixels (2:1 aspect ratio)
- Can reuse og-image.png if aspect ratio is acceptable
- Format: PNG or JPG

### Favicon

- Include multiple sizes in favicon.ico (16x16, 32x32, 48x48)
- Use transparent background or match site theme color (#0a0a0a)

## Notes

- All images should represent the ChaosFix brand consistently
- Use dark theme colors to match the application aesthetic
- Consider including terminal/code visual elements to convey the developer tool nature

---

## Vercel Deployment Configuration

When deploying to Vercel, use the following settings:

### Project Settings

| Setting              | Value                                                     |
| -------------------- | --------------------------------------------------------- |
| **Framework Preset** | Next.js                                                   |
| **Root Directory**   | `apps/web`                                                |
| **Build Command**    | `cd ../.. && pnpm turbo run build --filter=@chaosfix/web` |
| **Install Command**  | `cd ../.. && pnpm install`                                |
| **Output Directory** | `.next`                                                   |

### Environment Variables

Copy the variables from `.env.example` to your Vercel project settings.
At minimum, set `NEXT_PUBLIC_SITE_URL` to your production domain.

### Monorepo Configuration

This app is part of a Turborepo monorepo. The build commands navigate to the
root directory to leverage Turborepo's build orchestration and caching.

### Build Dependencies

The `@chaosfix/web` package depends on:

- `@chaosfix/core` - Shared types and utilities
- `@chaosfix/ui` - Shared React components

Turborepo handles building these dependencies automatically via the
`dependsOn: ["^build"]` configuration in `turbo.json`.
