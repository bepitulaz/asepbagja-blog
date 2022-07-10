---
title: "Jangan Deploy Di Hari Jumat?"
date: 2022-06-02
images:
- "/blog-img/inside-the-mill.jpg"
categories:
- Pemrograman
summary: "Hal yang saya pelajari setelah satu tahun bekerja di perusahaan di Estonia."
lang: "Bahasa Indonesia"
featured: false
---

Sebagai pemrogram yang bekerja di suatu perusahaan, pasti pernah mendengar atau bahkan akrab dengan kalimat ini, "Jangan *deploy* ke *production* di hari Jumat, apalagi Jumat sore." Alasannya akibat takut jika setelah melakukan *deployment* kode baru kemudian terjadi *error* maka itu berarti akan menjadi Jumat malam yang panjang. Lembur mencari apa yang salah dan harus diperbaiki.

Saya juga dulu menganut hal yang sama. Menghindari melakukan *deployment* fitur baru di hari Jumat. Mentalitas itu masih terbawa hingga awal-awal bekerja di Estonia, dan saya ditugaskan ke dalam misi pertama saya untuk membangun fitur baru. Proses pengembangan dan pengetesan sudah selesai, saatnya *deployment*.

Ketika itu sudah Jumat sore, sekitar jam 4. Saya bertanya ke manajer, "Apa tidak sebaiknya kita *deploy* hari Senin pagi saja?" Manajer saya paham dengan ketakutan saya. Dia berkata, "Fiturnya sudah dites? Sudah dapat lampu hijau dari QA kan? Kamu tidak percaya diri dengan kode yang kamu tulis?" Lalu dia lanjut dengan, "Di sini, *deployment* itu bisa kapan saja dan tidak perlu ada ritual khusus dan rasa takut."

Akhirnya dia lanjut memberi tahu bagaimana pola kerja yang ada di kantor dapat berpengaruh untuk membangun rasa percaya diri setiap pemrogram. Agar tidak perlu ada ketakutan melakukan *deployment* kapan saja.

### Tidak ada staging server di kantor

Di kantor saya saat ini, hanya ada dua *environment* yaitu *development* dan *production*. Dulu katanya pernah ada *staging*, tapi ternyata dengan adanya *staging* malah menyebabkan adanya ritual jadwal khusus untuk melakukan *deployment* karena semua fitur ditumpuk di sana.

Dengan hanya ada dua *environment*, akhirnya ini mengubah cara kerja para pemrogram. Setiap Pull-Request akan langsung menghasilkan *branch* URL yang bisa dites, misal `fitur-a.testdomain.com`. Lalu saat PR tersebut di-*merge* ke *master*, maka otomatis akan langsung ter-*deploy* ke *production*.

### Pull-Request sekecil dan sespesifik mungkin

Akibat hanya ada dua *environment*, para pemrogram dituntut memecah fitur atau tugas menjadi PR sekecil mungkin. Hal ini memudahkan kolega lain yang melakukan *review* kode, dan juga memudahkan untuk mengawasi *production*. Apakah setelah PR dimasukkan ke *master* mengakibatkan masalah di *production* atau tidak.

Contoh saat membuat *API endpoint* baru, maka PR-nya bisa dipecah dimulai dari sekadar mendeklarasikan skema GraphQL-nya dulu (kantor saya menggunakan GraphQL.) Lalu setelah itu baru *field resolver* dan logika bisnisnya. Kuncinya sebisa mungkin PR tersebut kecil dan bisa dites.

### Menggunakan feature toggle sebagai pengganti staging

Untuk menggantikan fungsi *staging server*, di kantor menggunakan [*feature toggle*](https://en.wikipedia.org/wiki/Feature_toggle). Jadi di *production* dibuatkan akun-akun pengguna khusus untuk pengetesan, dan fitur yang sedang dibangun hanya akan tersedia khusus di akun tersebut.

*Feature toggle* memudahkan pengetes dan pemrogram sendiri, karena tes keseluruhan fitur dilakukan langsung dengan *environment* yang sama persis dengan *production*. Lalu ketika sudah oke semua, hanya dengan satu tombol maka otomatis seluruh pengguna di *production* akan mendapat fitur tersebut. Kalau pun ada *edge cases* sehingga membuat *production* menjadi *down* atau tidak bisa digunakan, maka tinggal aktifkan lagi *feature toggle*-nya dan lakukan perbaikan untuk *cover* masalah tersebut.

Baru setelah fitur tersebut dinyatakan stabil, biasanya satu minggu setelah *deployment*, maka *feature toggle* tersebut dibuang permanen termasuk kode-kode lama yang dibungkus oleh *feature toggle* tersebut. *Monitoring tools* memegang peranan penting di fase ini.

### Berbagi pengetahuan dengan kolega lain

Saat melakukan pengembangan fitur, akan selalu ada kolega yang menjadi *reviewer* PR, sekalipun kolega tersebut tidak *coding* di tugas yang sama. PR tidak akan bisa di-*merge* tanpa ada persetujuan. Hal ini membuat setiap pemrogram jadi mengetahui kolega lain sedang membangun apa. Jadi saat terjadi masalah di *production* dan pemrogram utamanya tidak ada karena cuti, sakit, atau meninggal, maka anggota tim lain bisa mengambil alih. Mungkin proses *debugging*-nya tidak akan secepat saat pemrogram utama yang melakukan, tapi setidaknya setiap orang bisa kapan saja mengambil alih tugas tersebut.

<figure class="figure">
<img src="https://www.asepbagja.com/blog-img/inside-the-mill.jpg" class="figure-img img-fluid" alt="Bagian dalam dari wind mill di Saaremaa." />
<figcaption class="figure-caption text-center">Ilustrasi sebuah sistem yang saling berkaitan.</figcaption>
</figure>

Dengan pola kerja yang seperti ini, maka tidak ada lagi rasa takut saat melakukan *deployment*. Bahkan saya beberapa kali melakukan *deployment*, di sore hari tepat sebelum besoknya saya mengambil cuti selama 2 minggu penuh. Kalau pun tiba-tiba ada masalah, pemrogram yang sedang liburan tetap tidak akan diganggu kecuali betul-betul anggota tim lain tidak ada petunjuk. Itu pun biasanya cuma meminta beberapa petunjuk lewat Slack apa yang harus dicek. Tidak akan ketika sedang liburan tiba-tiba disuruh buka laptop dan membereskan masalah. 


