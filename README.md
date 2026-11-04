<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# Sistem Reservasi Lapangan Olahraga
 
REST API untuk reservasi lapangan olahraga (futsal, badminton, basket, tenis, voli) yang dibangun dengan [NestJS](https://nestjs.com). Pengguna dapat melihat daftar lapangan, mengecek ketersediaan jadwal, memesan slot waktu, melihat riwayat reservasi, dan membatalkan booking.
 
Proyek ini dikerjakan untuk **Kuis Proyek Individu Sesi 5, Praktek Pemrograman Web 3**. Data disimpan sementara di memori (array), tanpa database, sehingga semua perubahan hilang saat server dihentikan.
 
## Teknologi
 
- NestJS 12 (Express), TypeScript, ES Modules
- `class-validator` dan `class-transformer` untuk validasi request
- Vitest dan Supertest untuk pengujian
- Oxlint dan Prettier untuk lint dan format
- Builder SWC

## Fitur
 
- CRUD lapangan (`fields`) dan customer (`customers`)
- Pembuatan booking dengan perhitungan `totalPrice` otomatis (harga per jam x durasi)
- Deteksi jadwal bentrok pada lapangan dan tanggal yang sama
- Pembatalan booking, dan slot yang dibatalkan otomatis tersedia kembali
- Pengecekan slot kosong dan slot terpakai per lapangan per tanggal
- Riwayat booking per customer
- Timestamp `createdAt` dan `updatedAt` pada semua data

## Menjalankan Proyek
 
```bash
# instal dependensi
npm install
 
# development (watch mode)
npm run start:dev
 
# production
npm run build
npm run start:prod
```
 
Server berjalan di `http://localhost:3000`. Port dapat diubah lewat variabel lingkungan `PORT`.

### Perintah lain
 
```bash
npm run test        # unit test
npm run test:e2e    # e2e test
npm run test:cov    # coverage
npm run lint        # oxlint
npm run format      # prettier
```

## Daftar Endpoint
 
### Lapangan (`/fields`)
 
| Method | Endpoint | Fungsi |
|---|---|---|
| GET | `/fields` | Daftar semua lapangan |
| GET | `/fields/:id` | Detail satu lapangan |
| GET | `/fields/:fieldId/availability?date=YYYY-MM-DD` | Slot terpakai dan slot kosong pada tanggal tertentu |
| POST | `/fields` | Tambah lapangan |
| PATCH | `/fields/:id` | Ubah sebagian data lapangan |
| PUT | `/fields/:id` | Ganti seluruh data lapangan |
| DELETE | `/fields/:id` | Hapus lapangan |

### Reservasi (`/bookings`)
 
| Method | Endpoint | Fungsi |
|---|---|---|
| GET | `/bookings` | Daftar semua booking |
| GET | `/bookings/:id` | Detail satu booking |
| POST | `/bookings` | Buat booking baru |
| PATCH | `/bookings/:id/cancel` | Batalkan booking |
| GET | `/customers/:customerId/bookings` | Riwayat booking milik satu customer |

### Customer (`/customers`)
 
| Method | Endpoint | Fungsi |
|---|---|---|
| GET | `/customers` | Daftar semua customer |
| GET | `/customers/:id` | Detail satu customer |
| POST | `/customers` | Tambah customer |
| PATCH | `/customers/:id` | Ubah sebagian data customer |
| PUT | `/customers/:id` | Ganti seluruh data customer |
| DELETE | `/customers/:id` | Hapus customer |
 
Semua `:id` harus berupa UUID. UUID yang tidak valid ditolak dengan `400 Bad Request`.

## Aturan Bisnis
 
- Jam operasional **08:00 sampai 24:00**.
- `endTime` harus lebih besar dari `startTime`.
- Waktu booking harus di masa depan, dihitung menurut zona waktu `Asia/Jakarta`.
- Booking hanya bisa dibuat pada lapangan berstatus `available`.
- Slot yang sudah berstatus `booked` tidak bisa dipesan lagi. Booking `cancelled` dan `completed` tidak dianggap sebagai slot terpakai.
- Booking yang berurutan tidak dianggap bentrok, misalnya 18:00-19:00 dan 19:00-21:00.
- `totalPrice` = `pricePerHour` x durasi (jam).
- Hanya booking berstatus `booked` yang bisa dibatalkan.
- Client tidak boleh mengirim field di luar yang didefinisikan DTO (`whitelist` dan `forbidNonWhitelisted` aktif).


### Status data
 
| Entitas | Nilai status |
|---|---|
| Lapangan | `available`, `unavailable`, `maintenance` |
| Booking | `booked`, `cancelled`, `completed` |
 
Jenis olahraga: `futsal`, `badminton`, `basketball`, `tennis`, `volleyball`.

## Contoh Request dan Response
 
### Membuat booking
 
`POST /bookings`
 
```json
{
  "fieldId": "c4a6b7cb-b40a-41b4-a154-21c5847869e8",
  "customerId": "8b737a45-9b0b-485d-9189-e54f4547b138",
  "date": "2030-01-15",
  "startTime": "21:00",
  "endTime": "22:00"
}
```
 
Response `201 Created`:
 
```json
{
  "id": "2b0f8c52-6e7e-4b7a-9a43-1f3f6f8f0a11",
  "fieldId": "c4a6b7cb-b40a-41b4-a154-21c5847869e8",
  "customerId": "8b737a45-9b0b-485d-9189-e54f4547b138",
  "date": "2030-01-15",
  "startTime": "21:00",
  "endTime": "22:00",
  "status": "booked",
  "totalPrice": 150000,
  "createdAt": "2026-11-03T16:00:00.000Z",
  "updatedAt": "2026-11-03T16:00:00.000Z",
  "customerName": "Andi Pratama",
  "fieldName": "FTL-001"
}
```
 
### Jadwal bentrok
 
`POST /bookings` dengan `startTime: "18:00"` dan `endTime: "19:00"` pada lapangan dan tanggal yang sama dengan contoh seed.
 
Response `409 Conflict`:
 
```json
{
  "message": "the selected time slot is already booked",
  "error": "Conflict",
  "statusCode": 409
}
```
 
### Cek ketersediaan
 
`GET /fields/c4a6b7cb-b40a-41b4-a154-21c5847869e8/availability?date=2030-01-15`
 
Response `200 OK`:
 
```json
{
  "fieldId": "c4a6b7cb-b40a-41b4-a154-21c5847869e8",
  "fieldName": "FTL-001",
  "status": "available",
  "date": "2030-01-15",
  "bookedSlots": [
    { "startTime": "18:00", "endTime": "19:00" },
    { "startTime": "19:00", "endTime": "21:00" }
  ],
  "availableSlots": [
    { "startTime": "08:00", "endTime": "18:00" },
    { "startTime": "21:00", "endTime": "24:00" }
  ]
}
```
 
### Membatalkan booking
 
`PATCH /bookings/9f992dcf-4fc0-4145-a645-889dfb958359/cancel`
 
Response `200 OK`: booking dengan `"status": "cancelled"` dan `updatedAt` yang diperbarui. Setelah itu slot 18:00-19:00 muncul kembali di `availableSlots`.

## Status Code
 
| Kondisi | Status |
|---|---|
| Data berhasil diambil atau diubah | `200 OK` |
| Booking, lapangan, atau customer berhasil dibuat | `201 Created` |
| Data berhasil dihapus | `204 No Content` |
| Body tidak valid, UUID salah, `date` salah, jam di luar operasional, waktu sudah lewat, atau booking yang dibatalkan tidak berstatus `booked` | `400 Bad Request` |
| Booking, lapangan, atau customer tidak ditemukan | `404 Not Found` |
| Jadwal bentrok, lapangan tidak tersedia, atau data duplikat (nama lapangan atau nomor telepon) | `409 Conflict` |
 
## Data Awal (Seed)
 
Saat server dijalankan, tersedia data contoh di memori:
 
- 5 lapangan: `FTL-001`, `FTL-002`, `BDM-001`, `BDM-002` (maintenance), `BSK-001`
- 5 customer
- 5 booking, mencakup status `booked`, `cancelled`, dan `completed`
Daftar lengkap data contoh ada di folder `src/dev-data`.

## Struktur Proyek
 
```
src/
├── main.ts                      # entry point, ValidationPipe global
├── app.module.ts
├── fields/                      # modul lapangan
├── customers/                   # modul customer
├── bookings/                    # modul reservasi
│   ├── bookings.controller.ts
│   ├── customer-bookings.controller.ts
│   ├── field-availability.controller.ts
│   ├── bookings.service.ts
│   ├── dto/
│   └── interfaces/
└── dev-data/                    # contoh data JSON
test/                            # e2e test
postman_collection.json          # koleksi pengujian Postman
```
 
Route `/customers/:customerId/bookings` dan `/fields/:fieldId/availability` ditempatkan di `BookingsModule` karena datanya dimiliki `BookingsService`. Dengan begitu `FieldsModule` dan `CustomersModule` tidak perlu bergantung balik ke `BookingsModule`.

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Observability

In production applications, observability is essential for understanding how your system behaves, detecting issues early, and maintaining reliable performance.

[NestJS Observe](https://observe.nestjs.com) automatically instruments your NestJS application, giving you deep visibility into your system with minimal setup:

- **Distributed tracing:** Follow requests across services and understand how they flow through your system.
- **Waterfall analysis:** Visualize request execution and identify slow operations, bottlenecks, and unexpected delays.
- **Performance analysis:** Analyze application performance in real time and quickly pinpoint areas that need optimization.
- **Metrics:** Track key application and infrastructure metrics to understand system health and performance trends.
- **Logging:** Centralize and correlate logs with traces and other telemetry to make debugging easier.
- **Error tracking:** Detect errors quickly and investigate their root causes with the surrounding context.
- **SLA monitoring:** Track service-level objectives and identify when your application is approaching or exceeding defined thresholds.
- **Alarms and alerts:** Set up alerts for critical errors, performance degradation, SLA violations, and other anomalies so your team can react quickly.

To add it to this project:

```bash
$ npm install @nestjs/observe
```

Then follow the [setup guide](https://docs.nestjs.com/observability/overview) - it takes a single import and an app key.

The free plan needs no payment details and covers 300,000 events a month. You can also browse the [live demo](https://www.observe-demo.nestjs.com/dashboard) first - the whole dashboard over a busy service's data, with nothing to install.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Auto-instrument your application with [NestJS Observe](https://observe.nestjs.com). Distributed tracing, metrics, and logging made easy. Error tracking and performance monitoring for your NestJS applications.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
