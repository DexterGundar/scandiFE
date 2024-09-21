import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import AddProduct from "./components/AddProduct";
import Footer from "./components/Footer";
import { useEffect, useState } from "react";

function App() {
  const [allData, setAllData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getProduct = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(process.env.REACT_APP_URL_LINK, {
        "Content-Type": "application/json",
        method: "GET",
      });
      const data = await res.json();
      setAllData(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProduct();
  }, []);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={<Home data={allData} fetchProducts={getProduct} />}
        />
        <Route
          path="/add-product"
          element={<AddProduct data={allData} fetchProducts={getProduct} />}
        />
      </Routes>
      <Footer />
    </>
  );
}
export default App;
