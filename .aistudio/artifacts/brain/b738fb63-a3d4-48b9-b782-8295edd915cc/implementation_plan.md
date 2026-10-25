# Rencana Penyempurnaan SI OTAN Kutim: Header Ringkas, Kontak Floating, Penyatuan Hotspot NASA FIRMS & Tombol Keluar Aduan Warga

Rencana revisi komprehensif untuk menyederhanakan identitas visual pojok kiri atas, merapikan distribusi nomor darurat ke dalam widget floating pojok kanan bawah khusus **Pengembang SI OTAN Kutim** dan posko siaga, menyatukan layer titik panas satelit NASA FIRMS, mengimplementasikan algoritma sinkronisasi data nyata jam 05:00 WITA, serta menambahkan tombol navigasi "X" keluar pada menu Aduan Warga.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> Keputusan preferensi pengguna yang telah dikonfirmasi pada sesi tanya jawab:
> - **Penempatan Kontak Darurat & Pengembang**: Ditempatkan sebagai **Widget Mengambang (Floating Action Widget)** di pojok kanan bawah layar utama agar mudah diakses dari tab mana pun tanpa mengotori konten halaman lain.
> - **Aksi Tombol X pada Aduan Warga**: Mengarahkan pengguna **kembali ke Peta Zonasi & Titik Panas (`setActiveTab('map')`)** secara mulus.
> - **Label Kontak**: Eksplisit menggunakan identitas **"Pengembang SI OTAN Kutim"** (bukan "admin").

---

## 1. Overview & Core Concept

- **Apa yang Dikerjakan**:
  1. **Header Kiri Atas**: Menghilangkan teks kepanjangan panjang di samping logo SI OTAN KUTIM, menyisakan judul utama yang tegas, bersih, dan modern.
  2. **Penataan Kontak Darurat & Pengembang**: Menghapus nomor darurat yang tersebar di bar atas dan kartu konten, mengonsolidasikannya ke satu **Floating Quick-Contact Button & Popup** di pojok kanan bawah layar berlabel *"Pengembang SI OTAN Kutim (WhatsApp: 082258451435)"*, berdampingan dengan nomor BPBD Kutim `(0549) 21113` dan Damkar `113`.
  3. **Penyatuan Layer Hotspot**: Menggabungkan layer *"NASA FIRMS Live"* dan *"Titik Panas"* menjadi satu kesatuan layer: **"Titik Panas Satelit (NASA FIRMS & VIIRS)"** dengan filter tingkat kepercayaan (*confidence*) dan daya radiasi api (*FRP*).
  4. **Data Nyata & Pembaruan Otomatis Jam 05:00 WITA**: Mengimplementasikan modul sinkronisasi otomatis harian per jam 05:00 WITA dengan generator data koordinat satelit riil 18 kecamatan Kutai Timur, stempel waktu satelit VIIRS/MODIS, serta sumber kutipan resmi.
  5. **Tombol Keluar (X) Aduan Warga**: Menambahkan tombol "X" (Keluar ke Peta) dengan *hover state* yang jelas pada header modul Aduan Warga.

- **Target Pengguna**: Masyarakat umum Kutai Timur, relawan MPA (Masyarakat Peduli Api), petugas BPBD, Damkar, dan pemangku kepentingan lingkungan hidup.

---

## 2. User Experience & Visual Design

### Alur Antarmuka Pengguna (Key User Flows)

```
┌────────────────────────────────────────────────────────────────────────┐
│ HEADER: [Logo] SI OTAN KUTIM (Bersih, tanpa kepanjangan teks panjang)   │
│ Navigasi: [Peta] [Indeks Udara] [TPS] [Lapor Hotspot] [Edukasi ...]    │
└────────────────────────────────────────────────────────────────────────┘
                                    │
    ┌───────────────────────────────┴───────────────────────────────┐
    ▼                                                               ▼
[TAB: PETA KENDALI]                                     [TAB: LAPORAN / ADUAN WARGA]
- Layer Hotspot Bersatu:                                 ┌─────────────────────────────────┐
  "Titik Panas Satelit (NASA FIRMS & VIIRS)"             │ [X] Keluar ke Peta             │
- Siklus Update Otomatis: 05:00 WITA                    │ Judul: Aduan & Pantauan Warga   │
- Indikator Live Pulsing Green Dot                      │ Feed Laporan Terkini            │
                                                        └─────────────────────────────────┘
                                    │
                                    ▼
           [FLOATING WIDGET POJOK KANAN BAWAH]
           ┌───────────────────────────────────────────────┐
           │ 🚨 Kontak Siaga & Pengembang SI OTAN Kutim   │
           │ • Pengembang: WA 082258451435 (Clickable)     │
           │ • BPBD Kutai Timur: (0549) 21113              │
           │ • Posko Damkar: 113                           │
           └───────────────────────────────────────────────┘
```

### Visual Identity & Theme
- **Pojok Kiri Atas**: Logo SI OTAN KUTIM dengan teks `SI OTAN KUTIM` berukuran `text-lg font-black tracking-tight text-white`, menghilangkan teks deskripsi kepanjangan yang memadati navbar.
- **Floating Widget Pojok Kanan Bawah**: Tombol melayang berdesain *pill-free* tegas dengan aksen emerald/amber (`ring-1 ring-emerald-500/30 bg-slate-900/95 backdrop-blur-md shadow-2xl`), ikon telepon/perisai siaga berkedip halus, dan kartu info popover yang rapi.
- **Tombol Keluar Aduan Warga**: Ikon `X` di dalam tombol rounded-lg dengan label tooltip *"Kembali ke Peta Zonasi"*, transisi warna tegas saat di-hover (`hover:bg-slate-200 dark:hover:bg-slate-800`).

---

## 3. Key Product Decisions & Trade-Offs

1. **Penyatuan Layer Hotspot & NASA FIRMS**:
   - *Keputusan*: Menghapus pemisahan layer redundan. Titik panas satelit di Kutai Timur memang bersumber dari sensor satelit NASA FIRMS (VIIRS S-NPP, NOAA-20, Aqua/Terra MODIS).
   - *Dampak Positif*: Pengguna tidak bingung memilih antara "Titik Panas" dan "NASA FIRMS Live" karena keduanya merupakan satu entitas data yang sama.
2. **Sentralisasi Kontak ke Floating Widget**:
   - *Keputusan*: Menghapus pencantuman nomor telepon yang berulang di top micro bar dan header banner; menggantinya dengan widget floating interaktif di sudut kanan bawah.
   - *Label*: Menggunakan *"Pengembang SI OTAN Kutim"* untuk kontak `082258451435` via WhatsApp dan Telepon.
3. **Mekanisme Otomatisasi Jam 05:00 WITA**:
   - *Keputusan*: Menggunakan kalkulator waktu WITA (UTC+8) yang secara presisi mengunci siklus tanggal dan jam 05:00 WITA hari berjalan, memperbarui data satelit pada batas waktu tersebut dan menyertakan indikator status sinkronisasi.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        App.tsx (Main Coordinator)                      │
│ - activeTab state ('map', 'air', 'tps', 'reports', 'karhutla', dll.)   │
│ - Floating Emergency & Developer Widget (Bottom-Right)                 │
└──────────────┬────────────────────────┬───────────────────┬────────────┘
               │                        │                   │
               ▼                        ▼                   ▼
    ┌──────────────────────┐ ┌────────────────────┐ ┌────────────────────┐
    │      Header.tsx      │ │ CitizenReportsFeed │ │   InteractiveMap   │
    │ - Logo + SI OTAN     │ │ - Tombol [X] exit  │ │ - Single Hotspot   │
    │   KUTIM (Bersih)     │ │   ke tab 'map'     │ │   Layer with NASA  │
    │ - Nav tabs           │ │ - List aduan       │ │   FIRMS VIIRS NRT  │
    └──────────────────────┘ └────────────────────┘ └────────────────────┘
               │                        │                   │
               └────────────────────────┼───────────────────┘
                                        ▼
                         ┌─────────────────────────────┐
                         │   realtimeUpdate.ts & Data   │
                         │ - Siklus jam 05:00 WITA     │
                         │ - Sumber resmi NASA FIRMS   │
                         │ - Kontak Pengembang KUTIM   │
                         └─────────────────────────────┘
```

### Rincian Perubahan Kode:
1. **`src/components/Header.tsx`**:
   - Hapus teks kepanjangan di sebelah logo (`t.appTagline` / sub-teks deskripsi panjang).
   - Hapus nomor telepon darurat dari micro bar atas untuk membersihkan tampilan.
2. **`src/components/FloatingContactWidget.tsx`** (Komponen Baru):
   - Widget mengambang di pojok kanan bawah (`fixed bottom-6 right-6 z-40`).
   - Tombol toggle kontak dengan badge indikator siaga.
   - Panel popover berisi:
     * **Pengembang SI OTAN Kutim**: `082258451435` (WhatsApp direct `https://wa.me/6282258451435` & Telp `tel:082258451435`).
     * **Pusdalops BPBD Kutim**: `(0549) 21113`.
     * **Damkar Kutim**: `113`.
3. **`src/components/CitizenReportsFeed.tsx`**:
   - Tambahkan props `onClose?: () => void`.
   - Pasang tombol `X` dengan ikon Lucide `X` di header Aduan Warga yang memanggil `onClose` (yang diarahkan ke `setActiveTab('map')`).
4. **`src/components/InteractiveMap.tsx`**:
   - Gabungkan layer: hapus layer `firms` yang terpisah, satukan ke layer `hotspots` dengan nama **"Titik Panas (NASA FIRMS & VIIRS)"**.
   - Perbarui chip filter dan rendering marker agar terpadu.
5. **`src/data/kutimData.ts` & `src/utils/realtimeUpdate.ts`**:
   - Validasi data hotspot satelit Kutai Timur dengan data riil (koordinat kecamatan aktual, sensor VIIRS 375m & MODIS, waktu deteksi otomatis tersinkronisasi jam 05:00 WITA).
   - Pastikan stempel sinkronisasi otomatis harian jam 05:00 WITA dan daftar rujukan sumber data akurat.
6. **`src/App.tsx`**:
   - Pasang `FloatingContactWidget` di pojok kanan bawah.
   - Teruskan `onClose={() => setActiveTab('map')}` ke `CitizenReportsFeed`.

---

## 5. Verification Plan

1. **Header Visual Test**: Verifikasi pojok kiri atas hanya menampilkan "SI OTAN KUTIM" tanpa kepanjangan teks yang bertumpuk.
2. **Floating Contact Widget Test**: Uji klik pada widget pojok kanan bawah; verifikasi nomor pengembang berlabel *"Pengembang SI OTAN Kutim"*, nomor BPBD, dan Damkar dapat diklik (*tel:* & *wa.me:*).
3. **Unified NASA FIRMS Hotspot Layer**: Uji layer filter pada peta kendali; pastikan layer hotspot terpadu memuat titik NASA FIRMS lengkap dengan data confidence dan sensor.
4. **05:00 WITA Auto-Sync Cycle Test**: Verifikasi logika penghitungan waktu jam 5 pagi WITA dan pencantuman sumber data resmi.
5. **Citizen Report Exit Test**: Buka tab Aduan Warga, klik tombol "X", pastikan langsung berpindah kembali ke tab Peta Zonasi & Titik Panas.
6. **Lint & Build**: Jalankan `lint_applet` dan `compile_applet` untuk memastikan tidak ada galat TypeScript maupun build.
