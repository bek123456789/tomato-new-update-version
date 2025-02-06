import "./Footer.css";

const Footer = () => {
  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
          <img src="https://marketing.uz/uploads/articles/5437/article-original.png" width="200px" alt="logo" />
          <p>
            Evos bilan hayotingizni osonlashtiring! Sifatli va mazali taomlarni tez yetkazib beramiz.
          </p>
          <div className="footer-social-icons">
            <img src="./assets/facebook_icon.png" alt="Facebook ikonkasi" />
            <img src="./assets/twitter_icon.png" alt="Twitter ikonkasi" />
            <img src="./assets/linkedin_icon.png" alt="LinkedIn ikonkasi" />
          </div>
        </div>
        <div className="footer-content-center">
          <h2>KOMPANIYA</h2>
          <ul>
            <li>Bosh sahifa</li>
            <li>Biz haqimizda</li>
            <li>Yetkazib berish</li>
            <li>Maxfiylik siyosati</li>
          </ul>
        </div>
        <div className="footer-content-right">
          <h2>ALOQA</h2>
          <ul>
            <li>+998-95-80-91</li>
            <li>bekzodboxodirovc@gmail.com</li>
          </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">
        Copyright 2024 © Evos.uz - Barcha huquqlar himoyalangan
      </p>
    </div>
  );
};

export default Footer;
