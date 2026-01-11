# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
pnpm dev      # Start development server
pnpm build    # Build for production
pnpm preview  # Preview production build
```

## Architecture

This is an Astro-based e-commerce website for Tirecalligraphy fashion brand, using React islands for interactive components.

### Tech Stack
- **Framework**: Astro 3.x with React integration
- **State Management**: Nanostores (`@nanostores/react`) for cart state shared between Astro and React
- **Payments**: PayPal Checkout SDK (server-side) with PayPal JS SDK (client-side)
- **Animations**: GSAP and curtainsjs for shader effects
- **Smooth Scroll**: Lenis (@studio-freight/lenis)
- **Deployment**: Netlify with serverless functions

### Directory Structure
- `src/pages/` - Astro pages; product pages follow pattern `[Product-Name]/index.astro` and `[Product-Name]/details.astro`
- `src/components/` - Astro components (`.astro`) and React islands (`.tsx`)
- `src/store/cartStore.ts` - Nanostores atom for cart quantity, synced with React components
- `src/data/inventory.json` - Product catalog with id, price, name, imgUrl
- `src/js/` - Vanilla JS for page-specific functionality (GSAP animations, UI interactions)
- `src/hooks/` - React custom hooks (useLocalStorage for cart persistence)
- `src/utils/` - Cart manipulation functions (increaseCartQuantity, decreaseCartQuantity, removeFromCart)
- `functions/` - Netlify serverless functions
- `public/img/` - Product images organized by product name folders

### Netlify Functions
- `paypal/paypal.js` - Creates PayPal orders with AUTHORIZE intent, handles discounts
- `subscribe/subscribe.js` - Mailchimp newsletter subscription
- `webhook/webhook.js` - Slack notifications

### Data Flow
1. Cart items stored in localStorage via `useLocalStorage` hook
2. Cart quantity synced to `cartQuantityStore` nanostore for header icon updates
3. Checkout creates order via `/.netlify/functions/paypal` endpoint
4. PayPal order authorized, then user redirected to `/success`

### Environment Variables (Netlify)
- `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`
- `MAILCHIMP_API_KEY`, `MAILCHIMP_SERVER_PREFIX`, `MAILCHIMP_LIST_ID`
- `SLACK_URL`

### React Islands Pattern
React components use `client:only="react"` directive in Astro templates for client-side hydration. Key interactive components:
- `CartIcon.tsx` - Header cart icon with quantity badge
- `ShoppingCart.tsx` - Full cart page with PayPal integration
- `Button.tsx`, `Buttons.tsx` - Add to cart functionality on product pages
