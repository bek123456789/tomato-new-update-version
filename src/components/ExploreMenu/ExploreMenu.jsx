import "./ExploreMenu.css";

export const menu_list = [
  {
    menu_name: "Salad",
    menu_image: "./public/assets/menu_1.png",
  },
  {
    menu_name: "Rolls",
    menu_image: "./public/assets/menu_2.png",
  },
  {
    menu_name: "Deserts",
    menu_image: "./public/assets/menu_3.png",
  },
  {
    menu_name: "Sandwich",
    menu_image: "./public/assets/menu_4.png",
  },
  {
    menu_name: "Cake",
    menu_image: "./public/assets/menu_5.png",
  },
  {
    menu_name: "Pure Veg",
    menu_image: "./public/assets/menu_6.png",
  },
  {
    menu_name: "Pasta",
    menu_image: "./public/assets/menu_7.png",
  },
  {
    menu_name: "Noodles",
    menu_image: "./public/assets/menu_8.png",
  },
];

const ExploreMenu = ({ category, setCategory }) => {
  return (
    <div className="explore-menu" id="explore-menu">
      <h1>Explore our menu</h1>
      <p className="explore-menu-text">
        Choose from a diverse menu featuring a delectable array of dishes. Our
        mission is to satisfy your cravings and elevate your experience, one
        delicious meal at a time.
      </p>
      <div className="explore-menu-list">
        {menu_list.map((item, index) => {
          return (
            <div
              onClick={() =>
                setCategory((prev) =>
                  prev === item.menu_name ? "All" : item.menu_name
                )
              }
              key={index}
              className="explore-menu-list-item"
            >
              <img
                className={category === item.menu_name ? "active" : ""}
                src={item.menu_image}
                alt={item.menu_name}
              />
              <p>{item.menu_name}</p>
            </div>
          );
        })}
      </div>
      <hr />
    </div>
  );
};

export default ExploreMenu;
