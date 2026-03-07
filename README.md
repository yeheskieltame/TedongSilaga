<div align="center">
  <img src="./Logo_TedongSilaga.png" width="200" alt="Tedong Silaga Logo">

# Tedong Silaga

**Decentralized prediction market for traditional Torajan buffalo fighting,**
**powered by World Chain, Chainlink CRE, and Google Gemini AI.**

[![World Chain](https://img.shields.io/badge/World_Chain-Sepolia-blue)](https://sepolia.worldscan.org)
[![Chainlink CRE](https://img.shields.io/badge/Chainlink-CRE-375BD2)](https://docs.chain.link/cre)
[![Gemini AI](https://img.shields.io/badge/Google-Gemini_AI-4285F4)](https://aistudio.google.com)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)](./LICENSE)

</div>

---

## 🐃 What is Tedong Silaga?

Deeply rooted in the highlands of **Tana Toraja, Indonesia**, _Ma'pasilaga Tedong_ (Tedong Silaga) is a centuries-old buffalo fighting tradition held during **Rambu Solo'** — grand, multi-day funeral festivals honoring the passing of nobility. These spectacular events showcase massive, highly revered water buffaloes — some worth tens of thousands of dollars, such as the sacred albino _Tedong Bonga_ — clashing in open arenas before thousands of passionate spectators. For generations, these prestigious matches have sparked intense, informal community betting. Yet this traditional system relies entirely on localized trust, verbal agreements, and word-of-mouth results shared through social media. **Tedong Silaga** bridges this ancient heritage with Web3 technology, transforming localized, opaque wagers into a globally accessible, mathematically fair, and transparent prediction market — while routing a portion of every pool directly back to preserving Torajan culture.

### 📚 Learn More About the Culture

| Source                                                                                                                                                                                                    | Description                                                                 |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| [Wikipedia — Ma'pasilaga Tedong](https://id.wikipedia.org/wiki/Ma%27pasilaga_tedong)                                                                                                                      | Comprehensive overview of the buffalo fighting tradition within Rambu Solo' |
| [1001Indonesia — Mapasilaga Tedong](https://1001indonesia.net/mapasilaga-tedong-di-tana-toraja)                                                                                                           | In-depth article on the ritual, meaning, and cultural significance          |
| [Authentic Indonesia — Tana Toraja Traditions](https://authentic-indonesia.com/blog/5-unique-culture-and-traditions-of-tana-toraja/)                                                                      | Tedong Silaga as ceremonial entertainment for the grieving family           |
| [Detik.com — Tradisi Silaga Tedong](https://www.detik.com/sulsel/berita/d-6801472/mengenal-tradisi-silaga-tedong-pada-upacara-rambu-solo-suku-toraja)                                                     | Local news explaining the ancestral origins and cultural values             |
| [YouTube — Live Tedong Silaga](https://www.youtube.com/results?search_query=tedong+silaga+toraja+rambu+solo)                                                                                              | Real-life match footage and Rambu Solo' procession videos                   |
| [Academia.edu — Tedong Silaga](https://www.academia.edu/145803022/Tedong_Silaga)                                                                                                                          | Academic paper on cultural values, bravery, and community solidarity        |
| [ResearchGate — Tedong as Symbol](https://www.researchgate.net/publication/380691799_Tedong_Buffalo_Symbol_of_Nobility_Humanity_and_Entertaiment_in_Funeral_Ceremony_in_The_Indigenous_Torajan_Indonesia) | Study on the buffalo as a symbol of status, humanity, and entertainment     |

---

## Problem

| Problem              | Description                                                                                                          |
| -------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **No Transparency**  | Traditional betting is prone to manipulation. No verifiable record of bets or outcomes.                              |
| **Oracle Problem**   | Buffalo fight results aren't on any sports API. Results are scattered as unstructured text on local Facebook groups. |
| **Sybil Attacks**    | Without identity verification, bots can manipulate pools.                                                            |
| **Cultural Erosion** | The Torajan buffalo fighting tradition lacks global visibility and sustainable funding.                              |

## Solution

| Solution                  | How                                                                                                       |
| ------------------------- | --------------------------------------------------------------------------------------------------------- |
| **Trustless Settlement**  | Funds locked in smart contracts — only distributed based on verified on-chain data.                       |
| **AI-Powered Oracle**     | CRE Workflow scrapes Facebook posts via Apify, sends to Gemini AI, and writes on-chain via CRE Forwarder. |
| **Sybil Resistance**      | World ID ensures 1 human = 1 account. Gasless transactions via World Chain Paymaster.                     |
| **Cultural Preservation** | 1% of every pool automatically sent to the Torajan cultural fund.                                         |

## Key Features

- 🐃 **Fully On-Chain** — All bets, results, and payouts recorded on World Chain
- 🤖 **AI Oracle** — Gemini AI extracts results from real Facebook posts
- 📱 **Facebook Integration** — Apify scrapes community pages for match results
- ⛓️ **CRE Forwarder** — ERC-165 compliant on-chain settlement via `onReport()`
- 💰 **Fair Fees** — Only 2% total (1% platform + 1% cultural fund)
- 🌍 **Gasless UX** — World ID + Paymaster for zero-gas transactions

## System Architecture

```mermaid
graph TB
    subgraph Users
        U1["User A (Budi)"]
        U2["User B (Andi)"]
    end

    subgraph World Chain
        MF["MarketFactory"]
        TM["TedongMarket + ReceiverTemplate"]
        FW["CRE Forwarder (ERC-165)"]
        PW["Platform Wallet (1%)"]
        CF["Cultural Fund (1%)"]
    end

    subgraph Chainlink CRE Workflow
        TR["Log Trigger: MarketLocked"]
        RD["EVM Read: buffalo names"]
        AP["Apify: scrape Facebook Page"]
        LLM["Gemini AI: determine winner"]
        WR["EVM Write: onReport()"]
    end

    subgraph External
        FB["Facebook Page: Tedong Silaga Result"]
    end

    U1 -->|"stake(1, amount)"| TM
    U2 -->|"stake(2, amount)"| TM
    MF -->|"createMarket()"| TM
    TM -->|"emit MarketLocked"| TR
    TR --> RD
    RD --> AP
    AP -->|"scrape posts"| FB
    AP --> LLM
    LLM -->|"winner: 1/2/3"| WR
    WR -->|"report()"| FW
    FW -->|"onReport()"| TM
    TM -->|"1% fee"| PW
    TM -->|"1% fee"| CF
    TM -->|"claimWinnings()"| U1
```

## Market Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Open: createMarket()
    Open --> Open: stake()
    Open --> Locked: lockMarket()
    Locked --> Resolved: CRE onReport()
    Resolved --> [*]: claimWinnings()
```

| Phase        | Action                                                      | Actor         |
| ------------ | ----------------------------------------------------------- | ------------- |
| **Open**     | Users stake tokens on Buffalo A or B                        | Users         |
| **Locked**   | Market locked when match starts, emits `MarketLocked` event | Admin         |
| **Resolved** | CRE Workflow scrapes Facebook → Gemini AI → `onReport()`    | Chainlink CRE |
| **Claimed**  | Winners withdraw proportional share                         | Users         |

## Fee Distribution

| Recipient                  | %   | Purpose                                            |
| -------------------------- | --- | -------------------------------------------------- |
| Platform Wallet            | 1%  | Operational costs, CRE execution fees              |
| Cultural Preservation Fund | 1%  | Torajan cultural council for heritage preservation |
| Winners                    | 98% | Distributed proportionally based on stake          |

## Project Structure

```
TedongSilaga/
├── SmartContracts-TedongSilaga/   # Solidity contracts (Foundry)
│   ├── src/                        # TedongMarket, MarketFactory, ReceiverTemplate
│   ├── test/                       # 18 tests across 4 suites
│   └── script/                     # Deploy & verify scripts
├── cre-workflow/                   # Chainlink CRE Workflow
│   └── tedong-workflow/            # Apify + Gemini → on-chain settlement
├── frontend/                       # Next.js (coming soon)
└── PRD.md                          # Product Requirements Document
```

## Documentation

| Document                                                              | Description                                            |
| --------------------------------------------------------------------- | ------------------------------------------------------ |
| **[Smart Contracts README](./SmartContracts-TedongSilaga/README.md)** | Contract functions, errors, events, deployed addresses |
| **[CRE Workflow README](./cre-workflow/tedong-workflow/README.md)**   | Workflow flow, Apify/Gemini config, simulation guide   |
| **[PRD](./PRD.md)**                                                   | Product Requirements Document                          |

## Deployed Contracts (World Chain Sepolia)

| Contract      | Address                                                                                                                          | Verified |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------- | -------- |
| MockUSDC      | [`0x6c4A665934214351e2886540a273Dc1A1dfAf775`](https://sepolia.worldscan.org/address/0x6c4A665934214351e2886540a273Dc1A1dfAf775) | Yes      |
| MarketFactory | [`0x49b4eec85810d31044dc7F06d1714Dcb93Cb96aA`](https://sepolia.worldscan.org/address/0x49b4eec85810d31044dc7F06d1714Dcb93Cb96aA) | Yes      |

## Tech Stack

| Layer           | Technology                             |
| --------------- | -------------------------------------- |
| Blockchain      | World Chain (L2)                       |
| Smart Contracts | Solidity 0.8.20, OpenZeppelin, ERC-165 |
| Development     | Foundry (Forge, Cast, Anvil)           |
| Oracle          | Chainlink CRE (Runtime Environment)    |
| AI              | Google Gemini (gemini-3-flash-preview) |
| Data Source     | Facebook Page via Apify API            |
| Identity        | World ID (Sybil resistance)            |
| Token           | WLD / Mock USDC on World Chain         |
