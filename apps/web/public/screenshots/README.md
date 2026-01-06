# Screenshots Directory

This directory contains screenshots used in the ChaosFix landing page Demo section.

## Screenshot Requirements

### Main Application Screenshot

**Filename**: `app-screenshot.png`

**Recommended Dimensions**:

- Width: 1920px (minimum 1280px)
- Height: 1080px (minimum 720px)
- Aspect ratio: 16:9

**Format**: PNG (preferred for quality) or WebP (preferred for performance)

**Content Guidelines**:

- Show multiple terminal panels with Claude Code sessions
- Display the repository sidebar with multiple workspaces
- Include visible terminal output to demonstrate real usage
- Use a dark theme for consistency with the landing page design
- Ensure text is legible at reduced sizes

### Optimization Tips

1. Compress images using tools like:
   - [Squoosh](https://squoosh.app/) - Web-based compression
   - [ImageOptim](https://imageoptim.com/) - macOS application
   - `pnpm dlx sharp-cli resize` - CLI tool

2. Consider providing multiple formats:
   - `app-screenshot.png` - High quality fallback
   - `app-screenshot.webp` - Smaller file size for modern browsers

3. For retina displays, provide 2x versions:
   - `app-screenshot@2x.png` (3840x2160)

## Usage

Screenshots are referenced in the `DemoShowcase` component located at:
`apps/web/src/components/organisms/DemoShowcase.organism.tsx`

When adding screenshots, update the component to use an `<Image>` component from Next.js for optimal loading performance.
