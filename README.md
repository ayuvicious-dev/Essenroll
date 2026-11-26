# Essenroll – Payroll Made Simple

Aplikasi penggajian PWA: Personalia, Surat Sakit, Slip Gaji (impor Excel kehadiran), Riwayat Slip, dan Laporan Periode.
Seluruh kode aplikasi (HTML, CSS, JavaScript, logika Firebase) ada di satu file: `index.html`.
Satu-satunya file lain selain ikon adalah pustaka pihak ketiga `xlsx.full.min.js` (SheetJS) untuk membaca Excel.

## Struktur
```
icons/               ikon PWA & logo
.nojekyll
README.md
index.html           seluruh aplikasi
manifest.json
service-worker.js
xlsx.full.min.js     pustaka SheetJS (impor Excel kehadiran)
```

## Setup Firebase (project: essenroll)
1. Authentication → Sign-in method → aktifkan **Email/Password**.
2. Authentication → Users → **Add user** (buat akun login; aplikasi ini tidak punya tombol daftar).
3. Authentication → Settings → Authorized domains → tambahkan `USERNAME.github.io`.
4. Firestore Database → Rules → ganti dengan aturan berikut lalu **Publish**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /essenroll/{docId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

Semua pengguna yang login berbagi data yang sama di koleksi `essenroll`:
- Data kecil (di bawah ±600 KB) disimpan di satu dokumen `essenroll/sharedData`.
- Data besar (foto surat sakit, riwayat slip, rekap kehadiran yang banyak) otomatis dipecah ke
  beberapa dokumen `essenroll/sharedData_chunk_0`, `_1`, dst., karena satu dokumen Firestore
  dibatasi 1 MiB. Karena itu aturan di atas memakai `{docId}` (bukan hanya `sharedData`).
  Setelah mengganti Rules, klik **Publish**.
- Setelah update ini, buka/refresh aplikasi di semua perangkat agar memakai versi terbaru.

## Deploy GitHub Pages
Upload semua isi folder ke root repository → Settings → Pages → branch `main` / root.
Setiap update `index.html`, naikkan `CACHE_NAME` di `service-worker.js`.
