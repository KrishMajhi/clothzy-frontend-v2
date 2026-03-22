import React, { useContext } from "react";
import { ShopContext } from "../Context/ShopContext";
import Items from "../components/items/Items";
import "./css/ShopCategory.css";
import FooterShop from "../components/footershop/FooterShop";

function ShopCategory({ category, banner }) {
  const { all_products } = useContext(ShopContext);

  const filteredItems = all_products.filter(
    (item) => item.category === category
  );

  const categoryLabel =
    category === "kid"
      ? "Kids"
      : category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <div>
      <div className="category-container">
        <div className="category-inner">

          <img src={banner} className="banner" alt={`${categoryLabel} banner`} />

          <h1 className="category-title">{categoryLabel}'s Collection</h1>

          <div className="category-items-horizontal">
            {filteredItems.map((item, id) => (
              <Items
                key={id}
                Pname={item.name}
                Pimg={item.image}
                Nprice={item.new_price}
                Oprice={item.old_price}
                id={item.id}
                desc={item.description}
                product={"all_product"}
              />
            ))}
          </div>

        </div>
      </div>
      <FooterShop />
    </div>
  );
}

export default ShopCategory;