import { useState } from "react";

export default function useGetData() {
  const [allData, setAllData] = useState([]);
  const url = process.env.REACT_APP_URL_LINK;
  let getProduct = async () => {
    try {
      const res = await fetch(url, {
        "Content-Type": "application/json",
        method: "GET",
      });
      const data = await res.json();
      setAllData(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  };
  return { allData, getProduct };
}
