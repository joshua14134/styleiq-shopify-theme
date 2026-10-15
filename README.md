
# STYLEIQ — Luxury Fashion Shopify Theme

**Dress Intuitively. Discover Your Style.**

STYLEIQ is a luxury-inspired fashion e-commerce storefront built with Shopify Liquid, featuring refined typography, editorial layouts, curated collections, and a sophisticated shopping experience.

---

## Live Storefront

**Website:** [Visit STYLEIQ](https://tygx7k-kw.myshopify.com/)

**Storefront Password:** `123456`

If prompted by the storefront password page, enter the password above.

**GitHub Repository:** [joshua14134/styleiq-shopify-theme](https://github.com/joshua14134/styleiq-shopify-theme)

> **Note:** The storefront password works only while Shopify password protection is enabled and the password remains unchanged. For unrestricted public access, disable storefront password protection in Shopify.

---

## Overview

STYLEIQ brings a modern luxury aesthetic to fashion e-commerce, combining minimal design, thoughtful presentation, and responsive layouts to create a refined shopping experience.

The project focuses on brand identity, curated product discovery, elegant navigation, and a consistent visual experience across desktop and mobile devices.

## Features

- **Luxury Editorial Design** — Refined typography, generous whitespace, and a sophisticated dark, ivory, and champagne-gold palette.
- **Custom Header** — Brand logo, responsive navigation, and configurable mega menu.
- **Hero Slider** — Fashion-led homepage presentation.
- **Featured Collections** — Curated product displays with responsive layouts.
- **Product Cards** — Product imagery, pricing, sale information, and shopping actions.
- **Newsletter Signup** — Shopify customer newsletter form.
- **Custom Footer** — Brand identity, navigation, social links, and policy links.
- **Responsive Layout** — Designed for desktop and mobile storefronts.
- **Theme Customization** — Configurable settings through Shopify's theme editor.
- **Shopify Commerce** — Uses Shopify's native product, cart, collection, and storefront functionality.

Actual behavior depends on the implementation and configuration of the installed theme.

---

## Technology Stack

- Shopify
- Shopify Liquid
- HTML5
- CSS3
- JavaScript
- Shopify Theme Schema
- Git
- GitHub
- Shopify CLI

---

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

The exact structure depends on the theme files included in the repository.

---

## Getting Started

### Prerequisites

Before running the theme locally, make sure you have:

- A Shopify store with permission to manage themes
- Git installed
- Node.js and npm installed
- Shopify CLI installed

### 1. Clone the Repository

```bash
git clone https://github.com/joshua14134/styleiq-shopify-theme.git
cd styleiq-shopify-theme
```

### 2. Install Shopify CLI

```bash
npm install -g @shopify/cli
```

Verify the installation:

```bash
shopify version
```

### 3. Authenticate with Shopify

```bash
shopify auth login
```

Complete the authentication process in your browser.

### 4. Start Local Development

```bash
shopify theme dev --store your-store.myshopify.com
```

Replace `your-store.myshopify.com` with your actual Shopify store domain.

Shopify CLI will provide a development preview URL.

---

## Theme Validation

Run Shopify Theme Check to identify common Liquid, schema, and theme code issues.

```bash
shopify theme check
```

Review and resolve relevant errors before deploying.

---

## Deployment

STYLEIQ uses Shopify for storefront hosting and GitHub for source control.

### Upload an Unpublished Theme

```bash
shopify theme push --unpublished --store your-store.myshopify.com
```

Replace the example domain with your actual store domain.

This uploads the theme as an unpublished theme so you can review it before publishing.

### Publish the Theme

1. Open Shopify Admin.
2. Navigate to **Online Store → Themes**.
3. Locate the uploaded STYLEIQ theme.
4. Preview the theme and test its functionality.
5. Select **Publish** when ready.

Publishing makes the selected theme the live storefront theme.

### Update the GitHub Repository

After making changes to your local theme:

```bash
git add .
git commit -m "Update STYLEIQ theme"
git push
```

These commands save your changes to GitHub. They do not automatically upload changes to Shopify unless you have configured an integration or separately deploy the theme.

---

## Customization

Depending on the installed theme sections and settings, you can customize:

- Logo image and logo width
- Header navigation and mega menu
- Homepage hero content
- Featured collections
- Product card appearance
- Newsletter signup
- Footer navigation
- Social media links
- Homepage imagery and content

Use Shopify's theme editor for supported settings and edit the relevant Liquid, CSS, and JavaScript files for code-level changes.

---

## Responsive Design

STYLEIQ is designed with responsive layouts for desktop and mobile shopping.

Before publishing, verify:

- Header and mobile navigation
- Hero slider behavior
- Product image sizing
- Collection and product layouts
- Shopping cart interactions
- Newsletter form feedback
- Footer navigation and spacing

---

## Contributing

Contributions and suggestions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Implement your changes.
4. Test the theme locally.
5. Submit a pull request describing your changes.

---

## Security

- Do not commit API keys, access tokens, passwords, or private customer information.
- Review configuration files before making the repository public.
- Avoid publishing storefront passwords in public repositories.
- Disable storefront password protection when you are ready to make the store publicly accessible.

The storefront password documented above is intended for the current preview setup and should be changed if it is no longer secure.

---

## License

All rights reserved unless a separate license is provided.

This repository does not grant permission to redistribute or commercially reuse its code, branding, imagery, or other assets.

---

## Project Information

**Project:** STYLEIQ — Luxury Fashion Shopify Theme

**Developer:** Joshua Colaco

**Storefront:** https://tygx7k-kw.myshopify.com/

**Source Code:** https://github.com/joshua14134/styleiq-shopify-theme

---

**STYLEIQ**

*Less guesswork. More personal style.*
