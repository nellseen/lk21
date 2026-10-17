# 🎬 AuraStream Cinema — Platform Streaming Sinematik Premium

AuraStream Cinema adalah platform streaming film berbasis web yang dirancang dengan perpaduan visual cinematic mewah (*charcoal* & *champagne gold*), didukung penuh oleh **React 19**, **Vite**, **Firebase Authentication (Google Sign-In)**, **Firebase Realtime Database**, pemutar video berkecepatan tinggi **Google Drive**, serta trailer resmi **YouTube**.

Aplikasi ini siap diuji dan dideploy ke **Vercel** dengan arsitektur SPA yang aman, responsif, dan terisolasi berdasarkan hak akses role-based (Admin vs Viewer).

---

## 🏛️ Struktur Arsitektur Proyek

```
├── database.rules.json         # Aturan keamanan Firebase Realtime Database resmi
├── vercel.json                 # Konfigurasi rewrite SPA untuk deployment Vercel
├── .env.example                # Template variabel lingkungan frontend
├── index.html                  # Entry point HTML dengan font Cinzel & Plus Jakarta Sans
├── package.json                # Dependensi proyek
├── src/
│   ├── main.tsx                # Bootstrapping React DOM
│   ├── App.tsx                 # Routing utama (React Router DOM) & providers
│   ├── index.css               # Desain sistem Tailwind CSS & efek Glassmorphism
│   ├── types/
│   │   └── index.ts            # Definisi tipe Movie, AuthUser, Theme, Kategori
│   ├── lib/
│   │   ├── firebase.ts         # Inisialisasi Firebase App, Auth, Database
│   │   ├── youtube.ts          # Parser URL YouTube (Watch, Shorts, youtu.be, embed)
│   │   ├── googleDrive.ts      # Parser Google Drive File ID & Preview Embed
│   │   └── validators.ts       # Validator input form film
│   ├── services/
│   │   ├── authService.ts      # Google Sign-In, Logout, listener, error mapper
│   │   └── movieService.ts     # CRUD Realtime Database (/movies/{movieId})
│   ├── context/
│   │   ├── AuthContext.tsx     # Context sesi autentikasi & validasi admin
│   │   └── ThemeContext.tsx    # Context tema (Dark/Light mode + persistence)
│   ├── hooks/
│   │   ├── useAuth.ts          # Hook autentikasi
│   │   ├── useMovies.ts        # Hook realtime koleksi film & kategori
│   │   └── useTheme.ts         # Hook tema visual
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx      # Navigasi kaca responsif + profil user
│   │   │   ├── Footer.tsx      # Footer sinematik & informasi sistem
│   │   │   ├── ProtectedRoute.tsx # Penjaga rute katalog (wajib login Google)
│   │   │   └── AdminRoute.tsx  # Penjaga rute studio admin (email terverifikasi)
│   │   ├── common/
│   │   │   ├── Badge.tsx       # Lencana kategori & status film
│   │   │   ├── Modal.tsx       # Modal dialog aksesibel
│   │   │   ├── EmptyState.tsx  # Tampilan saat data kosong
│   │   │   ├── LoadingSkeleton.tsx # Kerangka pemuatan visual
│   │   │   └── FirebaseConfigNotice.tsx # Asisten konfigurasi Firebase di UI
│   │   ├── movie/
│   │   │   ├── HeroBanner.tsx  # Hero banner film unggulan
│   │   │   ├── MovieCard.tsx   # Kartu poster vertikal (rasio 2:3)
│   │   │   ├── MovieSlider.tsx # Carousel horizontal geser mulus
│   │   │   └── TrailerModal.tsx # Pemutar trailer YouTube 16:9
│   │   └── admin/
│   │       ├── MovieForm.tsx   # Formulir tambah/edit dengan live preview
│   │       └── DeleteConfirmModal.tsx # Konfirmasi aman hapus film
│   └── pages/
│       ├── LoginPage.tsx       # Halaman login Google mewah
│       ├── HomePage.tsx        # Beranda dengan hero & carousel
│       ├── BrowsePage.tsx      # Katalog lengkap dengan filter & sortir
│       ├── SearchPage.tsx      # Pencarian judul & sinopsis real-time
│       ├── MovieDetailPage.tsx # Informasi mendalam & rekomendasi
│       ├── WatchPage.tsx       # Pemutar video rasio 16:9 Google Drive
│       ├── NotFoundPage.tsx    # Halaman 404
│       └── admin/
│           ├── AdminDashboardPage.tsx # Tabel ringkasan & metrik film
│           ├── AdminUploadPage.tsx    # Halaman unggah film baru
│           └── AdminEditPage.tsx      # Halaman edit film
```

---

## 🔒 Kebijakan Keamanan & Autentikasi

### 1. Akses Pengguna Biasa vs Administrator
- **Seluruh katalog, pencarian, detail, dan pemutar video** WAJIB melakukan login akun Google.
- Pengunjung tanpa sesi akan dialihkan secara otomatis ke `/login`.
- **Email Administrator Resmi:**
  ```
  cristiandwihariantoro@gmail.com
  ```
- Akun penonton selain email admin di atas **tidak dapat membuka rute `/admin`**, `/admin/upload`, atau `/admin/edit/:id`.
- Tampilan 403 khusus akan ditampilkan jika akun non-admin mencoba mengakses panel admin.

### 2. Aturan Firebase Realtime Database (`database.rules.json`)
Aturan keamanan diterapkan di tingkat server Firebase, sehingga penulisan langsung dari console/skrip eksternal oleh akun non-admin **pasti ditolak** oleh Firebase:

```json
{
  "rules": {
    "movies": {
      ".read": "auth != null",
      ".indexOn": ["featured", "createdAt", "category"],
      "$movieId": {
        ".write": "auth != null && auth.token.email === 'cristiandwihariantoro@gmail.com' && auth.token.email_verified == true",
        ".validate": "newData.hasChildren(['title', 'description', 'posterUrl', 'driveUrl', 'category', 'featured', 'createdAt', 'updatedAt'])",
        "title": {
          ".validate": "newData.isString() && newData.val().length > 0 && newData.val().length <= 200"
        },
        "description": {
          ".validate": "newData.isString() && newData.val().length > 0 && newData.val().length <= 5000"
        },
        "posterUrl": {
          ".validate": "newData.isString() && newData.val().length > 0 && (newData.val().beginsWith('http://') || newData.val().beginsWith('https://'))"
        },
        "trailerUrl": {
          ".validate": "newData.isString()"
        },
        "driveUrl": {
          ".validate": "newData.isString() && newData.val().length > 0 && (newData.val().beginsWith('http://') || newData.val().beginsWith('https://'))"
        },
        "category": {
          ".validate": "newData.isString() && newData.val().length > 0 && newData.val().length <= 50"
        },
        "featured": {
          ".validate": "newData.isBoolean()"
        },
        "createdAt": {
          ".validate": "newData.isNumber()"
        },
        "updatedAt": {
          ".validate": "newData.isNumber()"
        },
        "$other": {
          ".validate": false
        }
      }
    },
    "$other": {
      ".read": false,
      ".write": false
    }
  }
}
```

---

## 🚀 Panduan Konfigurasi Firebase Step-by-Step

### Langkah 1: Buat Proyek di Firebase Console
1. Buka [Firebase Console](https://console.firebase.google.com/).
2. Buat proyek baru atau pilih proyek yang sudah ada.
3. Daftarkan **Web App** (ikon `</>`) dan dapatkan objek konfigurasi `firebaseConfig`.

### Langkah 2: Aktifkan Google Sign-In
1. Masuk ke menu **Build** > **Authentication**.
2. Klik tab **Sign-in method**.
3. Pilih **Google**, klik **Enable**, pilih email dukungan proyek, lalu klik **Save**.

### Langkah 3: Daftarkan Authorized Domains
Pada halaman **Authentication** > tab **Settings** > **Authorized domains**:
1. Pastikan domain lokal terdaftar: `localhost`
2. Tambahkan domain produksi Vercel Anda, misalnya:
   - `your-app.vercel.app`
   - `ais-dev-kratdfdqlhx5eajnqftes2-495984930919.asia-southeast1.run.app` (domain preview AI Studio)

### Langkah 4: Aktifkan Firebase Realtime Database
1. Masuk ke menu **Build** > **Realtime Database**.
2. Klik **Create Database**, pilih lokasi server terdekat (misalnya `Singapore` / `asia-southeast1` atau `United States`).
3. Buka tab **Rules**, salin isi file `database.rules.json` dari proyek ini, lalu klik **Publish**.

---

## 💻 Panduan Menjalankan Secara Lokal

1. **Clone atau buka repositori:**
   ```bash
   cd react-example
   ```

2. **Buat file `.env` berdasarkan `.env.example`:**
   ```bash
   cp .env.example .env
   ```
   Isi nilai kredensial dari Firebase Console Anda:
   ```env
   VITE_FIREBASE_API_KEY=AIzaSy...
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
   VITE_FIREBASE_PROJECT_ID=your-project
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
   VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
   VITE_ADMIN_EMAIL=cristiandwihariantoro@gmail.com
   ```

3. **Install Dependensi:**
   ```bash
   npm install
   ```

4. **Jalankan Development Server:**
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan di `http://localhost:3000`.

---

## ☁️ Panduan Deployment ke Vercel

1. **Deploy via GitHub / Vercel CLI:**
   - Hubungkan repositori GitHub Anda ke [Vercel](https://vercel.com).
   - Vercel akan otomatis mengenali proyek berbasis **Vite**.
   - Build Command: `npm run build`
   - Output Directory: `dist`

2. **Pengaturan Environment Variables di Vercel:**
   Masuk ke **Project Settings** > **Environment Variables**, tambahkan:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_DATABASE_URL`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_ADMIN_EMAIL`

3. **Konfigurasi SPA Routing (`vercel.json`):**
   File `vercel.json` sudah disediakan dalam proyek dengan aturan rewrite:
   ```json
   {
     "version": 2,
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```
   Hal ini menjamin rute langsung seperti `/watch/XYZ`, `/browse`, `/admin`, dan refresh halaman tidak menghasilkan error 404 di Vercel.

---

## 📽️ Format Video Google Drive & YouTube

### 1. Google Drive Video Player
- Mendukung format link:
  - `https://drive.google.com/file/d/FILE_ID/view?usp=sharing`
  - `https://drive.google.com/file/d/FILE_ID/preview`
  - `https://drive.google.com/open?id=FILE_ID`
- **Penting:** Pastikan pengaturan berbagi file pada Google Drive diubah menjadi **"Siapa saja yang memiliki tautan dapat melihat" (Anyone with the link can view)** agar penonton tidak mengalami hambatan izin akses.
- Tersedia tombol pintas *"Buka di Google Drive"* sebagai fallback jika pengguna menggunakan browser dengan pemblokiran cookie pihak ketiga (*third-party cookies*).

### 2. YouTube Official Trailer
- Mendukung link `youtube.com/watch?v=...`, `youtu.be/...`, dan `youtube.com/shorts/...`.
- Dikonversi otomatis menjadi embed URL aman (`youtube-nocookie.com/embed/...`).

---

## ✅ Checklist Verifikasi Sebelum Produksi

- [x] **Build & Lint**: `npm run build` dan `npm run lint` selesai tanpa error.
- [x] **Keamanan Database**: `database.rules.json` menolak baca anonim dan tolak tulis non-admin.
- [x] **Rute Terlindungi**: Seluruh rute katalog terproteksi login Google via `ProtectedRoute`.
- [x] **Hak Admin**: Hanya `cristiandwihariantoro@gmail.com` yang dapat mengakses `/admin`, `/admin/upload`, dan `/admin/edit/:id`.
- [x] **Operasi CRUD**: Berfungsi penuh dengan Realtime Database (Create, Read, Update, Delete).
- [x] **Pencegahan Double-Submit**: Form admin memiliki proteksi tombol submit ganda.
- [x] **Filter & Sortir**: Pencarian instan debounced dan filter kategori responsif.
- [x] **Tema Visual**: Dukungan Light Mode & Dark Mode dengan penyimpanan preferensi di localStorage.
- [x] **Vercel SPA Ready**: `vercel.json` dikonfigurasi dengan fallback `/index.html`.
