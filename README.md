
# STYLEIQ — Luxury Fashion Shopify Theme

**Dress Intuitively. Discover Your Style.**

STYLEIQ is a luxury-inspired fashion e-commerce storefront designed around elegant typography, editorial layouts, refined product displays, and a seamless shopping experience.

## Overview

STYLEIQ brings a modern, sophisticated aesthetic to Shopify with a focus on personal style, curated collections, and a clean, responsive shopping experience.

### Highlights

- **Luxury Editorial Design** — Refined typography, generous whitespace, and an elegant dark-and-ivory aesthetic.
- **Custom Header** — Brand logo, responsive navigation, and configurable mega menu.
- **Hero Slider** — Fashion-led homepage presentation.
- **Featured Collections** — Curated product displays with responsive layouts.
- **Product Cards** — Product imagery, pricing, sale information, and shopping actions.
- **Newsletter Signup** — Built-in Shopify customer newsletter form.
- **Custom Footer** — Brand identity, navigation, newsletter, and policy links.
- **Responsive Layout** — Designed for desktop and mobile storefronts.
- **Shopify Integration** — Uses Shopify's Liquid templates, theme sections, settings, and commerce features.

## Technology Stack

- Shopify
- Shopify Liquid
- HTML5
- CSS3
- JavaScript
- Shopify Theme Schema
- Git and GitHub

## Project Structure

```text
styleiq-shopify-theme/
├── assets/       # Stylesheets, scripts, fonts and images
├── config/       # Theme settings and configuration
├── layout/       # Main theme layout
├── locales/      # Language and translation files
├── sections/     # Reusable storefront sections
├── snippets/     # Reusable Liquid components
└── templates/    # Homepage, product and collection templates
```

## Getting Started

### Prerequisites

- A Shopify store
- Git
- Node.js and npm
- Shopify CLI

### Local Development

Install Shopify CLI:

```bash
npm install -g @shopify/cli
```

Authenticate with Shopify:

```bash
shopify auth login
```

Navigate to the theme directory and start a development preview:

```bash
shopify theme dev --store your-store.myshopify.com
```

Replace `your-store.myshopify.com` with your Shopify store domain.

### Validate the Theme

Run Shopify Theme Check:

```bash
shopify theme check
```

### Upload a Draft Theme

Upload the theme without immediately publishing it:

```bash
shopify theme push --unpublished --store your-store.myshopify.com
```

Review the uploaded theme in Shopify before publishing it.

## Customization

Customize the theme through Shopify's theme editor, where supported settings are available.

You can configure:

- Logo images and logo widths
- Navigation menus
- Mega menu content
- Featured collections
- Newsletter signup
- Footer navigation
- Social media links
- Homepage content and imagery

Available settings depend on the sections included in the installed theme.

## Deployment

STYLEIQ is designed to run on Shopify.

GitHub is used for source control and collaboration, while Shopify hosts the storefront and provides its commerce functionality.

Before publishing:

1. Run Theme Check.
2. Preview desktop and mobile layouts.
3. Test product pages and shopping cart behavior.
4. Verify navigation and newsletter signup.
5. Publish the approved theme through Shopify.

## Contributing

1. Fork or clone the repository.
2. Create a feature branch.
3. Make your changes.
4. Test the theme locally.
5. Submit a pull request.

## License

All rights reserved unless a separate license is provided.

This repository does not grant permission to redistribute or commercially reuse its code, imagery, branding, or other assets.

---

**STYLEIQ**  
*Less guesswork. More personal style.*
