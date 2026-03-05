# Product Requirements Document (PRD)

## Tedong Silaga: Decentralized Prediction Market untuk Tradisi Adu Kerbau Toraja

**Status:** Draft / Hackathon Ideation
**Target Event:** Chainlink Hackathon
**Blockchain Target:** World Chain (L2) & Chainlink CRE (Chainlink Runtime Environment)

---

## 1. Visi & Overview Produk

**Tedong Silaga** adalah platform prediction market berbasis Web3 yang mendigitalkan dan men-transparansikan tradisi adu kerbau (Tedong Silaga) di Toraja. Platform ini memungkinkan pengguna global dan lokal untuk memprediksi hasil pertandingan secara adil, aman, dan tanpa perantara (trustless).

Alih-alih menggunakan sistem perjudian tradisional yang rawan manipulasi, platform ini memanfaatkan Chainlink CRE sebagai orkestrator yang menghubungkan data dunia nyata (Facebook), AI (LLM), dan Smart Contract di World Chain.

### 🎯 Use Case Bisnis (Skenario Nyata):

1. Ada acara Rambu Solo (upacara adat) keluarga besar di Makale, Tana Toraja. Diadakan adu kerbau antara "Salu" (Kerbau A) vs "Bonga" (Kerbau B).
2. Panitia membuat market di platform Tedong Silaga dan memasukkan link Facebook Group resmi desa tersebut sebagai sumber data.
3. Budi (di Jakarta) dan Andi (di Makassar) login menggunakan World ID (gratis biaya gas). Budi men-stake 10 WLD untuk Salu, Andi 10 WLD untuk Bonga.
4. Pertandingan selesai. Chainlink CRE Workflow secara otomatis berjalan: sistem mengambil postingan Facebook terbaru, mengirim teksnya ke Google Gemini LLM untuk menganalisis sentimen dan memastikan siapa pemenangnya, lalu Workflow tersebut memicu Smart Contract untuk membagikan hadiah 20 WLD (dipotong fee 1%) langsung ke wallet Budi. Tidak ada bandar yang bisa kabur atau memanipulasi hasil!

---

## 2. Masalah yang Diselesaikan

- **Kurangnya Transparansi:** Taruhan tradisional rawan manipulasi dan human error. Blockchain memastikan dana terkunci (_locked_) dan hanya didistribusikan berdasarkan data yang valid.
- **Kendala Verifikasi Hasil (Oracle Problem):** Hasil pertandingan adu kerbau tidak ada di API olahraga resmi. Datanya tersebar di grup Facebook lokal. Chainlink CRE + LLM memecahkan masalah ekstraksi data tidak terstruktur ini.
- **Sybil Attacks & Bot:** Penggunaan World ID memastikan 1 manusia = 1 akun, mencegah paus (_whales_) memanipulasi pool dengan ribuan bot.
- **Preservasi Budaya:** Mengenalkan budaya Toraja ke audiens Web3 global sekaligus menyisihkan _fee_ platform untuk dana pelestarian budaya.

---

## 3. Arsitektur Teknis & Kebutuhan Frontend (UI/UX)

Frontend akan dibangun menggunakan Next.js, Tailwind CSS, dan Wagmi/Viem untuk interaksi mulus dengan blockchain World Chain.

### Halaman & Komponen Utama:

- **Landing Page & Edukasi Budaya:** Penjelasan singkat Tedong Silaga dengan visual motif ukiran Toraja (Pa' Tedong) dan Carousel daftar pertandingan yang sedang buka taruhan.
- **Dashboard Market (Event Detail):**
  - **Informasi Kerbau:** Foto kerbau, nama pemilik, dan rekam jejak.
  - **Staking Interface:** Tombol "Pilih Kerbau A" atau "Pilih Kerbau B", input jumlah token WLD/USDC.
  - **Status Indikator:** Open (Buka), Locked (Sedang Bertanding), Resolved (Selesai).
- **World ID Verification Component:** Tombol "Verify with World App" (wajib untuk Sybil resistance & gasless transaction via Paymaster).
- **Admin / Creator Dashboard:** Form untuk membuat market baru (Input Nama Event, Waktu, Nama Kerbau, dan URL Grup/Postingan Facebook).
- **My Profile / History:** Riwayat prediksi dan tombol "Claim Reward".

---

## 4. Arsitektur Smart Contract (Solidity)

Arsitektur Smart Contract dirancang pasif. Contract tidak perlu melakukan request data secara aktif ke oracle, melainkan bertindak sebagai receiver dari hasil eksekusi Chainlink CRE Workflow.

### A. MarketFactory.sol

**Fungsi:** Pabrik pembuat "ruangan" pertandingan. Setiap pertandingan memiliki contract tersendiri.

- `createMarket(string namaEvent, string idKerbauA, string idKerbauB, string dataSourceUrl)`: Dipanggil oleh Admin. Parameter `dataSourceUrl` akan dicatat di event log dan di-listen oleh CRE Workflow.
- `getDeployedMarkets()`: Mengembalikan daftar pertandingan aktif untuk Frontend.

### B. TedongMarket.sol

**Fungsi:** Mengatur uang masuk (stake) dan uang keluar (payout).

- `stake(uint8 pilihan, uint256 jumlahToken)`: User bertaruh (1 untuk A, 2 untuk B). Token di-lock.
- `lockMarket()`: Mengunci market saat waktu pertandingan dimulai. Memancarkan event `MarketLocked(marketAddress, dataSourceUrl)` yang akan ditangkap oleh CRE Workflow.
- `resolveMarket(uint8 hasilPemenang)`: **HANYA** boleh dipanggil oleh Wallet Address milik Chainlink CRE. Mengubah status market menjadi Resolved dan menetapkan pemenang.
- `claimWinnings()`: User dengan tebakan benar menarik modal dan keuntungannya.

---

## 5. Orkestrasi Chainlink CRE Workflow & LLM (CORE HACKATHON REQUIREMENT)

Ini adalah fitur utama untuk hackathon. Kita menggunakan Chainlink CRE (Chainlink Runtime Environment) sebagai orchestration layer yang menghubungkan Blockchain, Web2 API, dan AI (LLM).

### ⚙️ Cara Kerja Workflow (Technical Use Case):

1. **Trigger (Event Listener):** CRE Workflow terus memantau Smart Contract di World Chain. Saat waktu pertandingan tiba, admin memicu fungsi `lockMarket()`, contract memancarkan event `MarketLocked`. CRE menangkap event ini beserta URL Facebook yang terlampir.
2. **API Integration (Data Fetch):** CRE Workflow mengeksekusi langkah pemanggilan API eksternal (misal: menggunakan Apify Actor atau Custom Node.js endpoint) untuk melakukan scraping teks dari 5 postingan/komentar terbaru di URL Facebook Group tersebut.
3. **AI Agent / LLM Integration (Reasoning):** CRE Workflow mengirimkan hasil teks mentah tersebut ke Google Gemini API (atau OpenAI) dengan prompt khusus:
   > _"Berikut adalah laporan pandangan mata dari grup komunitas Facebook untuk acara Rambu Solo. Siapa yang memenangkan adu kerbau antara Salu dan Bonga? Balas HANYA dengan angka: '1' jika Salu menang, '2' jika Bonga menang, '3' jika seri/batal/informasi tidak jelas."_
4. **Consensus & Execution:** LLM memproses sentimen postingan dan merespon dengan angka (misal: "1"). CRE Workflow mengambil output ini dan mengeksekusi transaksi on-chain dengan memanggil fungsi `resolveMarket(1)` pada `TedongMarket.sol`.
5. **Settlement:** Hasil tercatat di blockchain, dan pemenang bisa melakukan claim.

_(Catatan: Sesuai aturan Hackathon, workflow ini wajib disimulasikan keberhasilannya via CRE CLI atau live deployment di CRE network)._

---

## 6. Tokenomics & Model Bisnis

**Token Transaksi:** Menggunakan WLD (Worldcoin) atau USDC (berjalan di World Chain).

### Alokasi Biaya (Fee) - 2% dari Total Winning Pool:

- **1% Platform Fee:** Digunakan untuk biaya operasional platform dan membayar fee eksekusi jaringan Chainlink CRE.
- **1% Cultural Preservation Fund:** Didonasikan secara transparan ke wallet multisig milik dewan adat Toraja untuk pelestarian budaya (misalnya: subsidi perawatan kerbau untuk keluarga kurang mampu).

---

## 7. Hackathon Deliverables Checklist (WAJIB)

Berdasarkan regulasi kompetisi Chainlink, pastikan elemen berikut disiapkan sebelum pengumpulan (submission):

- [ ] **CRE Workflow YAML/Code:** File konfigurasi workflow (misal: `tedong-workflow.yaml`) yang mendefinisikan trigger, integrasi Web2 API, LLM reasoning step, dan on-chain transaction.
- [ ] **Simulasi CRE CLI / Live Log:** Rekaman layar atau log yang membuktikan perintah `cre simulate <nama_workflow.yaml>` berhasil berjalan di terminal (membuktikan koneksi Blockchain -> API -> LLM -> Blockchain sukses).
- [ ] **Video Demo (3-5 Menit):**
  - **Menit 1:** Penjelasan masalah (Tradisi adu kerbau & Oracle problem) & UI platform.
  - **Menit 2-3:** Demo staking (UI) dan eksekusi CRE Workflow via CLI/Terminal.
  - **Menit 4:** Hasil di-resolve otomatis, uang berhasil diklaim di smart contract.
    _(Video di-upload ke YouTube/Vimeo secara public)._
- [ ] **GitHub Repository (Public):** Source code lengkap mencakup:
  - Folder `/frontend` (Next.js)
  - Folder `/contracts` (Foundry / Hardhat Solidity)
  - Folder `/cre-workflow` (Konfigurasi dan script Chainlink CRE)
- [ ] **README.md Khusus:** Menyertakan deskripsi proyek, arsitektur, dan link spesifik ke baris kode (hyperlink) di mana Chainlink CRE Workflow didefinisikan dan digunakan.
