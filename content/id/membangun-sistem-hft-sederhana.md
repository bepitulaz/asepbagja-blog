---
title: "Membangun Sistem High Frequency Trading Sederhana"
date: 2019-09-19
images:
- "/blog-img/candlestick.jpg"
categories:
- Pemrograman
aliases:
- /artikel/membangun-sistem-hft-sederhana
- /artikel/membangun-sistem-hft-sederhana/
- /posts/membangun-sistem-hft-sederhana
- /id/artikel/membangun-sistem-hft-sederhana
- /programming/membangun-sistem-hft-sederhana
- /programming/membangun-sistem-hft-sederhana/
summary: "High-Frequency Trading (HFT) adalah strategi perdagangan aset di mana trader tidak menyimpan aset lama-lama."
---

Dua minggu terakhir ini saya sibuk mengerjakan sebuah proyek sampingan pribadi yang berhubungan dengan pasar finansial, yaitu melakukan otomatisasi terhadap kegiatan perdagangan di bursa cryptocurrency. Saya yakin untuk yang sudah terbiasa melakukan kegiatan *trading* pasti sering mendengar istilah *robot trading*. Di mana perdagangan dilakukan secara otomatis oleh komputer.

!["Candlestick chart"](/blog-img/candlestick.jpg)

Saya memutuskan untuk membangun sistem sendiri dari nol dengan tujuan supaya benar-benar paham bagaimana sistem yang saya bangun bekerja sambil terus mengasah ilmu di bidang *[algorithmic trading](https://www.investopedia.com/articles/active-trading/101014/basics-algorithmic-trading-concepts-and-examples.asp)*.

Perlu diingat bahwa artikel yang saya tulis ini sifatnya hanya catatan belajar saya, jadi jangan ditelan mentah-mentah.

### Perkenalan Tentang High-Frequency Trading

High-Frequency Trading (HFT) adalah strategi perdagangan aset di mana *trader* tidak menyimpan aset lama-lama, biasanya tidak akan lebih dari satu hari dengan keuntungan dari setiap *trade* sangat tipis tetapi dilakukan dengan jumlah yang banyak. Strategi dieksekusi secara cepat oleh komputer. HFT biasanya digunakan oleh *investment banks*, hedge fund, atau investor institusional untuk bertransaksi dalam volume yang besar dan kecepatan tinggi (bisa sampai hitungan milidetik) di bursa efek.

Di Indonesia, HFT tidak bisa digunakan di Bursa Efek Indonesia karena tidak diperbolehkan dan mungkin memang sistem di bursanya sendiri belum siap.

Oleh karena itu, untuk proses belajar, saya beralih ke bursa cryptocurrency karena bursa-bursa cryptocurrency pada umumnya memiliki API (Application Programming Interface) untuk mengakses data perdagangan secara *real-time* dan API untuk membuka posisi jual/beli.

### Arsitektur Sistem

Sistem yang saya buat menggunakan arsitektur *microservices* untuk memastikan bahwa sistem ini bisa diperbesar lagi dengan mudah *(scalable)*. Ada empat *services*: Raw Data Service, Trading Service, Trading Strategy Development Service, dan Data Warehouse.

!["Arsitektur Sistem"](/blog-img/my-hft-system.jpg)
*Arsitektur sistem trading yang saya rancang.*

#### Raw Data Service

*Service* ini digunakan untuk mengambil *ticker* secara berkala dari bursa. *Ticker* adalah data harga jual dan beli pada suatu aset. Untuk saat ini saya ambil per 30 detik sekali untuk setiap aset karena saya rasa untuk saat ini belum perlu dilakukan lebih cepat lagi.

Data mentah yang didapat dari bursa langsung dimasukkan ke data warehouse agar nantinya bisa dianalisa dan digunakan untuk membuat strategi perdagangan. Selain dimasukkan ke Data Warehouse, data mentah ini juga dikirimkan secara *real-time* ke Trading Service menggunakan format MsgPack melewati MQTT Broker.

Raw Data Service saya bangun dengan menggunakan *framework* Ruby on Rails. Mungkin terlihat *overkill* ya menggunakan Rails untuk *service* sesederhana ini. Alasan saya menggunakannya karena selain saya sudah terbiasa, Rails juga sangat cepat untuk melakukan pembuatan purwarupa aplikasi yang banyak menggunakan CRUD, dan ada fitur Active Jobs sehingga saya tidak perlu pusing-pusing melakukan konfigurasi *cron jobs*.

#### Trading Service

Untuk *service* ini saya menggunakan Python tanpa *framework*. Mengapa Python? Karena ekosistem pustaka-pustaka pengolahan data dan analisa data sangat berlimpah dibandingkan Ruby.

Di dalam Trading Service ini lah algoritma *trading* diimplementasikan. Sistem akan bereaksi terhadap *ticker* yang didapat dari MQTT Broker, apakah sebaiknya melakukan posisi beli atau jual. Ketika sinyal beli atau jual sudah keluar, *service* ini akan mengontak Trading API di bursa.

#### Trading Strategy Development Service

*Service* ini tidak berhubungan dengan bursa sama sekali. Di bagian ini lah saya melakukan [analisa teknikal](https://en.wikipedia.org/wiki/Technical_analysis) dengan menggunakan berbagai macam indikator, membangun algoritma yang akan digunakan sebagai strategi, dan juga melakukan *backtesting*. *Backtesting* adalah tahapan menguji algoritma dengan menggunakan data historis apakah algoritma tersebut menguntungkan atau tidak. Data historis ini saya ambil dari Data Warehouse.

!["Backtesting"](/blog-img/backtest.png)
*Contoh hasil backtesting menggunakan data satu hari ke belakang dengan timeframe satu menit*

#### Data Warehouse

Di sini saya menggunakan PostgreSQL untuk melakukan penyimpanan data time series. Sejauh ini masih memadai.

### Kesimpulan

Sistem yang saya bangun ini belum lah sempurna (boleh dibilang HFT abal-abal haha) dan masih jauh dari sistem HFT di luar sana yang dengan kecepatan tinggi dapat melakukan *trading* dalam hitungan milidetik. Bahkan hingga membuat *[flash crash](https://en.wikipedia.org/wiki/2010_Flash_Crash)* pada pasar.

Mari jika mau berdiskusi atau memberi saran bisa tinggalkan pesan di kolom komentar atau lewat email saya yang tercantum di menu sebelah kiri.

<u>**Daftar API dan pustaka pemrograman yang digunakan**</u>

- [Indodax](https://indodax.com). Bursa cryptocurrency Indonesia yang saya gunakan. Dokumentasi API-nya dapat dilihat [di sini](https://indodax.com/downloads/INDODAXCOM-API-DOCUMENTATION.pdf).
- [TA-Lib](http://ta-lib.org/). Pustaka pemrograman pada bahasa C untuk melakukan analisa teknikal. Dapat digunakan untuk Python melalui *[wrapper](https://github.com/mrjbq7/ta-lib)*.
- [Pandas](https://pandas.pydata.org/). Pustaka Python untuk melakukan analisa data.
- [Numpy](https://numpy.org/). Pustaka Python untuk array dan matriks multi-dimensi yang besar.
- [Backtrader](https://www.backtrader.com/). Framework untuk melakukan *backtesting* dengan menggunakan Python.
- [Mosquitto MQTT Broker](http://mosquitto.org/). Pub/sub messaging untuk protokol MQTT. Ada MQTT kliennya untuk Ruby dan Python.
- [MessagePack](https://msgpack.org/index.html). Serialisasi data dengan menggunakan format biner. Lebih kecil ukurannya dibanding JSON.
- [Ruby on Rails](https://rubyonrails.org). Ruby web framework.
- [Dokku](https://github.com/dokku/dokku). Platform-as-a-Service berbasis Docker. Anggap saja Heroku tapi di-*host* di server sendiri.
