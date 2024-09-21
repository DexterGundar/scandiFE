import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useGetData from "../hooks/useGetData";

export default function AllProducts({ data, fetchProducts }) {
  // contains object {type, sku}
  const [checked, setChecked] = useState([]);
  const navigate = useNavigate();

  const url = process.env.REACT_APP_URL_LINK;

  const onCheck = (sku, type) => {
    setChecked((prev) => {
      const index = prev.findIndex((el) => el.sku === sku && el.type === type);
      if (index === -1) {
        return [...prev, { sku, type }];
      } else {
        return prev.filter((el) => el.sku !== sku && el.type !== type);
      }
    });
  };
  // useEffect(() => {
  //   fetchProducts();
  // }, []);

  let deleteSelected = () => {
    const sBody = { dvd: [], book: [], furniture: [] };

    // document.querySelectorAll("input[type=checkbox]:checked").forEach((e) => {
    //   let [type, sku] = e.value.split("-");
    //   sBody[type].push(sku);
    // });

    checked.forEach(({ sku, type }) => {
      sBody[type].push(sku);
    });
    axios
      .post(`${url}/mass-delete`, sBody, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        fetchProducts();
      });
  };
  return (
    <>
      <header>
        <h1>Product List</h1>
        <div className="actions">
          <button
            name="add"
            id="add-btn"
            onClick={() => navigate("/add-product")}
          >
            ADD
          </button>
          <button
            id="delete-product-btn"
            name="mass-delete"
            onClick={deleteSelected}
          >
            MASS DELETE
          </button>
        </div>
      </header>

      <ul className="product-grid">
        {data.map(
          ({ sku, name, price, type, height, width, length, weight, size }) => {
            return (
              <li key={sku} className="product-card">
                <section>
                  <input
                    type="checkbox"
                    className="delete-checkbox"
                    onChange={() => onCheck(sku, type)}
                    checked={checked.some(
                      (el) => el.sku === sku && el.type === type
                    )}
                  />
                  <h3>{sku}</h3>
                  <h3>{name}</h3>
                  <h2>{price} $</h2>

                  {type === "book" && <h3>weight: {weight} KG</h3>}
                  {type === "dvd" && <h3>size: {size} MB</h3>}
                  {type === "furniture" && (
                    <h3>
                      Dimensions: {height}x{width}x{length}{" "}
                    </h3>
                  )}
                </section>
              </li>
            );
          }
        )}
      </ul>
    </>
  );
}
