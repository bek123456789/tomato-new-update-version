import "./Footer.css";

const Footer = () => {
  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
          <img src="./assets/logo.png" alt="logo" />
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta
            volupb tate, ut dolorum libero, cumque asperiores beatae, numquam sunt
            quisquam ipsam saepe porro possimus id at dolorem ad odit! Cumque,
            cupiditate.
          </p>
          <div className="footer-social-icons">
            <img src="./assets/facebook_icon.png" alt="facebook icon" />
            <img src="./assets/twitter_icon.png" alt="twitter icon" />
            <img src="./assets/linkedin_icon.png" alt="linkedin icon" />
          </div>
        </div>
        <div className="footer-content-center">
          <h2>COMPANY</h2>
          <ul>
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Private policy</li>
          </ul>
        </div>
        <div className="footer-content-right">
          <h2>GET IN TOUCH</h2>
          <ul>
            <li>+998-95-80-91</li>
            <li>bekzodboxodirovc@gmail.com</li>
          </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">
        Copyright 2024 © Tomato.com - All Right Reserved
      </p>
    </div>
  );
};

export default Footer;
