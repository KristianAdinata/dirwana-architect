# Provenance dan asumsi

## Dari PDF `PORTO DWA UPDATE MEI.pdf`
- DIRWANA RANCANG-BANGUN berdiri sejak 2018; bergerak di perencanaan, pembangunan, renovasi, dan pengawasan.
- Alamat: Jl. Patih Jelantik No. 7, Dauh Puri Klod, Denpasar Barat, Denpasar - Bali.
- Email: dirwanabuilding@gmail.com.
- 15 proyek pada halaman 5-19, status sesuai PDF (termasuk proyek 'On Progress').
- Foto 61 file JPEG diekstrak dari elemen gambar di halaman 5-19; beberapa hasil adalah rendering, bukan foto konstruksi selesai.
- PDF lama menyebut nama DIRWANA RANCANG-BANGUN; branding baru di website mengikuti permintaan klien **DIRWANA ARCHITECT** / **DESIGN & BUILD**.

## Dari jawaban klien dalam chat
- Kalkulator berfokus pada rumah, villa, kos/ruko; jenis lainnya konsultasi.
- Lantai 1-3; ukuran ruangan standar otomatis; tidak perlu denah, pilihan budget, atau level kelas harga.
- Harga bangun menurut jenis dan total jumlah lantai (lihat `src/config/pricing.json`).
- Harga desain Rp100.000/m²; diskon 50% jika pembangunan dikerjakan DIRWANA.
- Output biaya desain dan bangun di situs, tapi WhatsApp hanya ringkasan kebutuhan ruang TANPA harga.
- Nama, WA, lokasi proyek wajib diisi sebelum buka WA ke nomor 081237489756.
- Dua bahasa, desain khas DIRWANA (referensi Emporio), logo baru; dashboard dan data leads untuk fase mendatang.
- Nilai luas standar ruangan pada `src/config/room-presets.example.json` awalnya dibuat untuk prototipe; klien kemudian menyetujui nilainya sebagai **estimasi luas DIRWANA**, bukan ukuran final bangunan.

## Asumsi buatan untuk prototipe, BUKAN data klien
- Palet visual charcoal/ivory/bronze dan contoh logo SVG.
- Rekomendasi Next.js + React + TypeScript + Tailwind.
- Cara teknis memodelkan luasan area khusus, validasi, tes, dan struktur aplikasi.

## Klarifikasi interpretasi penting
Awalnya harga sempat dicontohkan dijumlah per lantai, kemudian **klien menegaskan tarif satuan didasarkan pada jumlah lantai total**. Angka yang benar untuk rumah 2 lantai 80+60 m² adalah **Rp980 juta**, bukan Rp860 juta.
