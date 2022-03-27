import Head from "next/head";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import BaseLayout from "@/components/BaseLayout";
import { NextPage } from "next";

const TentangPage: NextPage = () => {
  return (
    <BaseLayout>
      <Head>
        <title>Tentang | Asep Bagja</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Blog pribadi tempat saya berbagi pendapat dan topik menarik yang saya sukai."
        />
        <meta property="og:type" content="website" />
        <meta
          name="og:title"
          property="og:title"
          content="Tentang | Asep Bagja"
        />
        <meta
          name="og:description"
          property="og:description"
          content="Blog pribadi tempat saya berbagi pendapat dan topik menarik yang saya sukai."
        />
        <meta property="og:site_name" content="Blog Asep Bagja" />
        <meta
          property="og:url"
          content="https://www.asepbagja.com/id/tentang"
        />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Blog Asep Bagja" />
        <meta
          name="twitter:description"
          content="Blog pribadi tempat saya berbagi pendapat dan topik menarik yang saya sukai."
        />
        <meta name="twitter:site" content="@bepitulaz" />
        <meta name="twitter:creator" content="@bepitulaz" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
        <meta
          property="og:image"
          content="https://www.asepbagja.com/img/tartu.jpeg"
        />
        <meta
          name="twitter:image"
          content="https://www.asepbagja.com/img/tartu.jpeg"
        />
        <link rel="canonical" href="https://www.asepbagja.com/id/tentang" />
      </Head>

      <div
        style={{
          backgroundImage: `url("/img/tartu.jpeg")`,
          backgroundPosition: `bottom center`,
          backgroundSize: "cover",
        }}
      >
        <Container className="py-5">
          <Row>
            <Col xs={12} className="text-center">
              <Image
                src="/img/avatar_spring.jpg"
                roundedCircle
                width={200}
                alt="Asep Bagja Priandana's photograph"
              />
            </Col>
            <Col xs={12} className="pt-3 text-center text-white">
              <h1>Asep Bagja Priandana</h1>
              <p className="lead">
                Saya melakukan pengembangan perangkat lunak dan produksi musik
                <br />
                untuk senang-senang 🎉 dan komersial 💶
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      <main className="mt-5 about-section">
        <Container>
          <Row className="mt-5">
            <Col lg={{ span: 8, offset: 2 }}>
              <h3 className="mb-3">Tentang Asep</h3>
              <p>
                Asep Bagja Priandana adalah seorang pemrogram komputer dan
                musisi dari Indonesia. Dia tinggal di Tallinn, Estonia. Di hari
                biasa, dia bekerja sebagai pengembang perangkat lunak di sebuah
                startup teknologi di Estonia. Tetapi di malam hari, dia bermain
                dengan synthesizer dan komputer untuk menghasilkan suara dan
                musik. Saat membuat musiknya, dia sering menggunakan
                keterampilan pemrograman sebagai alat musik. Dia menyukai
                menulis musik elektronik ambient dan generatif.
              </p>
              <p>
                Sebagai seorang pemrogram, Asep memulai karir profesionalnya
                pada 2010. Dia pernah bekerja untuk beberapa perusahaan di
                Indonesia dan Singapura. Bahkan dia juga mendirikan
                perusahaannya sendiri. Asep belajar pemrograman komputer secara
                otodidak karena pendidikan formalnya adalah akuntansi.
              </p>
              <p>
                Bicara tentang hobinya di musik, Asep memulai perjalanannya
                sebagai pemain keyboard di sebuah band kampus sekitar tahun 2007
                di Indonesia. Di tahun 2007-2009, ia secara aktif menjadi pemain
                keyboard di beberapa band indie dengan berbagai genre. Ia
                memainkan alternative rock, pop, electronic pop, dan jazz.
              </p>
            </Col>
          </Row>
        </Container>
      </main>
    </BaseLayout>
  );
};

export default TentangPage;
