import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Header.css";

const Header = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false,
  };

  return (
    <div className="header">
      <Slider {...settings} className="header-carousel">
        <div>
          <img src="./assets/first_slider.png" alt="Dish 1" className="carousel-image" />
        </div>
        <div>
          <img src="./assets/second_slider.png" alt="Dish 2" className="carousel-image" />
        </div>
        <div>
          <img src="./assets/third_slider.png" alt="Dish 3" className="carousel-image" />
        </div>
      </Slider>
    </div>
  );
};

export default Header;
