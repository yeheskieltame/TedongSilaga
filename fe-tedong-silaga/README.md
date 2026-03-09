# Tedong Silaga Arena Frontend

**Live APP**: [https://tedong.xyz/](https://tedong.xyz/)

Tedong Silaga Arena is a Web3 landing page and interface for a GameFi prediction arena centered around traditional Toraja buffalo competitions. Built on World Chain, it merges ancient cultural heritage with blockchain technology to create a professional, immersive, and transparent prediction experience.

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 14 | Core App Router framework |
| TailwindCSS | Styling and dark UI theme |
| Framer Motion | Scroll-driven animations |
| React Three Fiber | 3D WebGL ecosystem |
| Supabase | Database and state sync |
| Wagmi & Viem | Wallet connection and EVM interaction |

## Application Routes and Pages

| Route / Page | Description | Core Features |
|---|---|---|
| / | Home Landing Page | Cinematic 650vh scroll experience, interactive WebGL particle background, introduction to mechanics. |
| /markets | Arena Markets | Displays all active, locked, and resolved prediction markets. Includes search and filtering by status. |
| /markets/[id] | Market Detail | Specific match prediction where users can stake USDC on their chosen buffalo and track live odds. |
| /leaderboard | Global Leaderboard | Ranks the top champion buffaloes based on total wins and winning pools generated. Podium display for top 3. |
| /action | Testing Action Panel | Dev/Jury testing page to easily simulate Lock, Resolve (triggers CRE workflow), and Claim functions. |
| /admin | Admin Dashboard | Dashboard for the protocol administrator to create new prediction markets and publish them to World Chain. |

## Guide to Running the Frontend Server

To run the frontend Next.js application, follow these steps:

### 1. Install Dependencies

Open your terminal in the `fe-tedong-silaga` directory and install the required packages.

```bash
npm install
```

### 2. Configure Environment Variables

Create and populate the `.env.local` file with the necessary API keys and contract addresses.

```bash
cp .env.example .env.local
```

Ensure variables for Supabase (URL and ANON KEY) and Web3 (WalletConnect Project ID) are set correctly.

### 3. Start the Development Server

Run the development server.

```bash
npm run dev
```

### 4. Visit the Interface

Open your web browser and navigate to the local server.

```text
http://localhost:3000
```

## Stage Journey (Home Page)

| Stage | Purpose |
|---|---|
| Hero Introduction | Enter the universe of Tedong Silaga with an interactive particle sphere. |
| The Essence | Zoom into the particle core to understand the predictive mechanics. |
| Heritage Integration | Experience how Toraja buffalo culture meets on-chain innovation. |
| Active Arena | View live prediction markets with real-time token prize pools. |

## License

Built for the World Chain community. Preserving culture through innovation.
