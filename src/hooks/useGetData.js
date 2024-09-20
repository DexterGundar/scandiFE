import { useState } from "react";

export default function useGetData() {
  const [allData, setAllData] = useState([]);
  const url = process.env.REACT_APP_URL_LINK;
  console.log(url);
  let getProduct = () => {
    fetch(url, {
      "Content-Type": "application/json",
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setAllData(data);
      });
  };

  return { allData, getProduct };
}
