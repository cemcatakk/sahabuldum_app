import React from 'react';
import './About.css';
import { Helmet } from 'react-helmet';

const About = () => {
  return (
    <div className="about">
    <Helmet>
      <title>Hakkımızda | Sahabuldum</title>
      <meta name="description" content="Sahabuldum hakkında bilgi edinin. Misyonumuz, vizyonumuz ve halı saha kiralama süreçlerimiz hakkında detaylar." />
    </Helmet>
      <h1>Hakkımızda</h1>
      <section className="mission-vision">
        <h2>Misyonumuz</h2>
        <p>Halı saha kiralama ve kiralanma olayındaki süreci hızlandırmayı hedeflemekteyiz.</p>
        <p>Boş halı saha bulabilmek adına harcayacağınız eforu en aza indirerek saniyeler içerisinde saha kiralama fırsatı sunuuyoruz.</p>
        <h2>Vizyonumuz</h2>
        <p>Vizyonumuz, halı saha sektöründe lider bir platform olarak tanınmak ve kullanıcılarımızın spor deneyimlerini en üst seviyeye taşımaktır. Amacımız, sporun herkes için erişilebilir olmasını sağlamaktır.</p>
      </section>
    </div>
  );
};

export default About;
