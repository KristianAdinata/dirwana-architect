# DIRWANA ARCHITECT — DESIGN & BUILD

Website Next.js App Router, TypeScript, dan Tailwind CSS untuk DIRWANA ARCHITECT. Bahasa utama Indonesia tersedia di `/id`, dengan versi English di `/en`.

## Menjalankan proyek

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`. Jalankan pemeriksaan sebelum rilis:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Struktur penting

- `src/app/`: halaman, layout, sitemap, robots, dan CSS global.
- `src/components/`: navigasi, portofolio, dan kalkulator interaktif.
- `src/i18n/index.ts`: teks antarmuka ID/EN.
- `src/lib/`: logika harga, WhatsApp, proyek, metadata, dan test.
- `src/config/pricing.json`: satu-satunya sumber tarif, diskon bersyarat, dan nomor WhatsApp.
- `src/config/room-presets.example.json`: **ukuran ruang contoh sementara**; perlu validasi arsitek. Sirkulasi dan tangga belum memiliki nilai resmi sehingga tidak dihitung.
- `content/projects.json` dan `content/image-manifest.json`: data 15 proyek dan indeks 61 foto portofolio dari PDF klien.
- `public/images/portfolio/`: foto proyek asli. `content/portfolio-contact-sheet.jpg` adalah lembar tinjau internal untuk memilih foto sebelum publikasi.
- `public/branding/`: logo dan favicon konsep sementara, belum disetujui klien.
- `docs/`: asal data, catatan persetujuan sebelum live, dan gambar referensi internal yang tidak ditampilkan di website.

Kalkulator menggunakan total luas ruang indoor seluruh lantai dikali **satu tarif** sesuai jenis bangunan dan jumlah lantai total. Luas tersebut adalah perkiraan kebutuhan ruang, belum luas bangunan final atau pemeriksaan perizinan. Taman, kolam, dan balkon memerlukan estimasi terpisah. Diskon desain 50% hanya berlaku jika konstruksi dikerjakan DIRWANA. Pesan WhatsApp memuat kebutuhan proyek tanpa nominal biaya dan baru terkirim setelah pengunjung menekan Kirim di WhatsApp.

## Sebelum publikasi

- Minta persetujuan logo, pemilihan proyek, hak penggunaan foto, dan foto resolusi tinggi. Sumber foto adalah PDF portofolio klien; sebagian gambar berupa rendering atau progres, dan satu foto Berawa Villa memiliki watermark.
- Validasi ukuran ruang, cakupan tarif konstruksi, tanggal berlaku tarif, area layanan, serta komponen yang belum dihitung seperti sirkulasi, tangga, taman, kolam, dan balkon. Jangan menganggap kalkulator sebagai RAB atau pemeriksaan KDB/KLB.
- Tinjau terjemahan English, nama dan status proyek, serta data kontak sebelum tayang.
- Tentukan domain/hosting dan isi `NEXT_PUBLIC_SITE_URL` (lihat `.env.example`) agar canonical URL dan sitemap memakai domain produksi. Tanpa nilai tersebut, sitemap kosong.

Konten perusahaan mengikuti PDF portofolio dan keterangan klien. PDF memakai nama lama DIRWANA RANCANG-BANGUN; website memakai branding yang diminta klien, DIRWANA ARCHITECT — DESIGN & BUILD. Situs versi ini tidak menyimpan data lead; kalkulator hanya menyimpan pilihan proyek di perangkat pengunjung, tanpa nama, nomor WhatsApp, atau lokasi proyek.
