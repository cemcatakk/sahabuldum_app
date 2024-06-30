import React from 'react';
import './Contact.css';

const Contact = () => {
  return (
    <div className="contact">
      <div className="contact-info">
        <h1>İletişim</h1>
        <p>Halı sahanızı listelemek için bizi arayabilirsiniz. <br/>Alim ERGÜN <br/> İletişim: <a href="tel:+905077341376">(+90) 507 734 1376</a></p>
        <address>
        </address>
        <div className="social-media">
          <a href="#"><i className="fab fa-facebook-f"></i></a>
          <a href="#"><i className="fab fa-twitter"></i></a>
          <a href="#"><i className="fab fa-instagram"></i></a>
          <a href="#"><i className="fab fa-google-plus-g"></i></a>
        </div>
      </div>
      <form className="contact-form">
        <div className="form-group">
          <input type="text" id="name" name="name" placeholder="Adınız" required />
        </div>
        <div className="form-group">
          <input type="email" id="email" name="email" placeholder="Email" required />
        </div>
        <div className="form-group">
          <textarea id="message" name="message" rows="5" placeholder="Mesajınız" required></textarea>
        </div>
        <button type="submit">Gönder</button>
      </form>
    </div>
  );
};

export default Contact;
