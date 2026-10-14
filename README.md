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
- `src/config/pricing.json`: sumber tarif, diskon bersyarat, dan nomor WhatsApp Admin 1.
- `src/config/contact.json`: nomor WhatsApp Admin 2, Instagram, email, dan tautan Google Maps.
- `src/config/room-presets.example.json`: estimasi luas ruang bawaan DIRWANA dan persentase tambahan koridor/ruang sisa per lantai.
- `content/projects.json` dan `content/image-manifest.json`: data 15 proyek dan indeks 61 foto portofolio dari PDF klien.
- `public/images/portfolio/`: foto proyek asli. `content/portfolio-contact-sheet.jpg` adalah lembar tinjau internal untuk memilih foto sebelum publikasi.
- `public/branding/`: logo dan favicon konsep sementara, belum disetujui klien.
- `docs/`: asal data, catatan persetujuan sebelum live, dan gambar referensi internal yang tidak ditampilkan di website.

Kalkulator menjumlahkan luas ruang dalam preset dan ruang tambahan dengan luas yang diisi pengunjung per lantai. Pengunjung dapat memakai estimasi luas DIRWANA atau mengganti total luas pilihan ruang yang sudah ada; jika jumlahnya dua, input custom adalah total keduanya. Tambahan otomatis untuk koridor/ruang sisa adalah **5% di setiap lantai** dari jumlah luas ruang dalam. Balkon, kolam renang, Area Tangga, dan Teras ditambahkan ke luas bangunan terhitung setelah koridor. Luas terhitung seluruh lantai dikalikan **satu tarif** sesuai jenis bangunan dan jumlah lantai total. Luas tersebut adalah estimasi awal, belum luas bangunan final atau pemeriksaan perizinan; biaya rinci balkon dan kolam perlu ditinjau kembali. Taman tetap dicatat terpisah walaupun luasnya diisi sendiri. Diskon desain 50% hanya berlaku jika konstruksi dikerjakan DIRWANA. Pengunjung memilih Admin 1 atau Admin 2; pesan WhatsApp memuat kebutuhan proyek tanpa nominal biaya dan baru terkirim setelah pengunjung menekan Kirim di WhatsApp.

## Sebelum publikasi

- Minta persetujuan logo, pemilihan proyek, hak penggunaan foto, dan foto resolusi tinggi. Sumber foto adalah PDF portofolio klien; sebagian gambar berupa rendering atau progres, dan satu foto Berawa Villa memiliki watermark.
- Validasi ukuran ruang, cakupan tarif konstruksi, tanggal berlaku tarif, area layanan, serta estimasi rinci balkon dan kolam. Taman tetap dicatat terpisah. Jangan menganggap kalkulator sebagai RAB atau pemeriksaan KDB/KLB.
- Tinjau terjemahan English, nama dan status proyek, serta data kontak sebelum tayang.
- Saat memakai domain sendiri, isi `NEXT_PUBLIC_SITE_URL` (lihat `.env.example`) agar canonical URL dan sitemap memakai domain tersebut. Tanpa nilai ini, website memakai `https://dirwana-architect.vercel.app`.

Konten perusahaan mengikuti PDF portofolio dan keterangan klien. PDF memakai nama lama DIRWANA RANCANG-BANGUN; website memakai branding yang diminta klien, DIRWANA ARCHITECT — DESIGN & BUILD. Situs versi ini tidak menyimpan data lead; kalkulator hanya menyimpan pilihan proyek di perangkat pengunjung, tanpa nama, nomor WhatsApp, atau lokasi proyek.
