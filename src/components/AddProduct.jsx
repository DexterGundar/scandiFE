import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useGetData from "../hooks/useGetData";

export default function AddProduct() {
  const [selectedType, setSelectedType] = useState();
  const [skuError, setSkuError] = useState(false);
  const [valErrors, setValErrors] = useState({});
  const [newProduct, setNewProduct] = useState({
    sku: "",
    name: "",
    price: null,
    type: "",
  });
  const { allData, getProduct } = useGetData();
  const url = process.env.URL_LINK;

  const navigate = useNavigate();

  useEffect(getProduct, []);

  function updateNewProduct(key, value) {
    setValErrors((current) => {
      return { ...current, [key]: "" };
    });
    setNewProduct((currentProduct) => {
      console.log(newProduct);
      return { ...currentProduct, [key]: value };
    });
  }

  function update(e) {
    setSelectedType(e.target.value);
    setNewProduct((currentProduct) => {
      return { ...currentProduct, type: e.target.value };
    });
  }
  function onSubmit() {
    let skuExist = allData.some(({ sku }) => sku === newProduct.sku);

    skuExist ? setSkuError(true) : setSkuError(false);

    let newErrors = {};
    if (!newProduct.sku) newErrors.sku = "Please, submit required data";
    if (!newProduct.name) {
      newErrors.name = "Please, submit required data";
    }
    if (!newProduct.price) newErrors.price = "Please, submit required data";
    if (!newProduct.type) newErrors.type = "Please choose a type";
    setValErrors(newErrors);

    const newBody = {
      ...newProduct,
    };
    let isAllFieldsFilled = Object.values(newProduct).some((v) => !v);
    console.log(isAllFieldsFilled);
    console.log(skuExist);
    if (skuExist) return;
    if (
      (Object.values(newProduct).length === 7 &&
        !isAllFieldsFilled &&
        selectedType === "furniture") ||
      (Object.values(newProduct).length === 5 &&
        !isAllFieldsFilled &&
        selectedType !== "furniture")
    ) {
      const formData = new FormData();
      Object.entries(newBody).map(([key, value]) =>
        formData.append(key, value)
      );
      axios
        .post(`${url}/add-product`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then(() => {
          navigate("/");
        })
        .catch((error) => console.error(error));
    }
  }

  return (
    <>
      <header>
        <h1>Product Add</h1>
        <div className="form-actions">
          <button
            type="submit"
            onClick={onSubmit}
            name="save"
            className="save-btn"
          >
            Save
          </button>
          <button
            name="cancel"
            className="cancel-btn"
            onClick={() => navigate("/")}
          >
            Cancel
          </button>
        </div>
      </header>

      <form onSubmit={onSubmit} id="product_form" method="get">
        <div className="form-group">
          <div className="label-input">
            <label id="sku-label" htmlFor="sku">
              SKU:
            </label>
            <div className="input-notification">
              <input
                type="text"
                id="sku"
                name="sku"
                value={newProduct.sku}
                required
                placeholder="Enter product SKU"
                onChange={(e) => {
                  updateNewProduct("sku", e.target.value?.toLowerCase());
                }}
              />
              <div
                className="notification   notification-sku"
                id="error-sku"
                aria-hidden="true"
              >
                {valErrors.sku ? valErrors.sku : ""}
                {skuError ? `sku value taken, choose a different one` : ""}
              </div>
            </div>
          </div>
          <div className="label-input">
            <label htmlFor="name">Name:</label>
            <div className="input-notification">
              <input
                type="text"
                id="name"
                name="name"
                required
                minLength={2}
                placeholder="Enter product name"
                onChange={(e) => {
                  updateNewProduct("name", e.target.value);
                }}
              />
              <div className="notification" id="error-name">
                {valErrors.name ? valErrors.name : ""}
              </div>
            </div>
          </div>
          <div className="label-input">
            <label htmlFor="price">Price ($):</label>
            <div className="input-notification">
              <input
                type="number"
                id="price"
                name="price"
                required
                placeholder="Enter product price"
                onChange={(e) => {
                  updateNewProduct("price", Number(e.target.value));
                }}
              />
              <div className="notification" id="error-price">
                {valErrors.price ? valErrors.price : ""}
              </div>
            </div>
          </div>
          <div id="productType">
            <label htmlFor="type">Type Switcher:</label>
            <div className="input-notification">
              <select
                onChange={update}
                id="productType"
                name="type"
                defaultValue={""}
              >
                <option value="" disabled>
                  Please choose a type
                </option>
                <option value="dvd">DVD</option>
                <option value="book">Book</option>
                <option value="furniture">Furniture</option>
              </select>
              <div className="notification" id="error-type">
                {valErrors.type ? valErrors.type : ""}
              </div>
            </div>
          </div>
          <div className="label-input">
            <div id="dynamic-fields">
              {selectedType === "book" && (
                <div id="Book">
                  <div className="label-input">
                    <label className="weight" htmlFor="weight">
                      Weight (KG):
                    </label>
                    <div className="input-notification">
                      <input
                        type="number"
                        id="weight"
                        name="weight"
                        onChange={(e) => {
                          updateNewProduct("weight", Number(e.target.value));
                        }}
                      />
                      <p>Please, provide weight in Kg.</p>
                    </div>
                  </div>
                </div>
              )}
              {selectedType === "dvd" && (
                <div id="DVD">
                  <div className="label-input">
                    <label className="size" htmlFor="size">
                      Size (MB):
                    </label>
                    <div className="input-notification">
                      <input
                        type="number"
                        id="size"
                        name="size"
                        onChange={(e) => {
                          updateNewProduct("size", Number(e.target.value));
                        }}
                      />
                      <p>Please, provide size in MB.</p>
                    </div>
                  </div>
                </div>
              )}
              {selectedType === "furniture" && (
                <div id="Furniture">
                  <div className="label-input">
                    <label className="height" htmlFor="height">
                      Height (CM):
                    </label>
                    <div className="input-notification">
                      <input
                        type="number"
                        id="height"
                        name="height"
                        onChange={(e) => {
                          updateNewProduct("height", Number(e.target.value));
                        }}
                      />
                    </div>
                  </div>
                  <div className="label-input">
                    <label className="width" htmlFor="width">
                      Width (CM):
                    </label>
                    <div className="input-notification">
                      <input
                        type="number"
                        id="width"
                        name="width"
                        onChange={(e) => {
                          updateNewProduct("width", Number(e.target.value));
                        }}
                      />
                    </div>
                  </div>
                  <div className="label-input">
                    <label className="length" htmlFor="length">
                      Length (CM):
                    </label>
                    <div className="input-notification">
                      <input
                        type="number"
                        id="length"
                        name="length"
                        onChange={(e) => {
                          updateNewProduct("length", Number(e.target.value));
                        }}
                      />
                      <p>Please, provide dimensions in cm.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
