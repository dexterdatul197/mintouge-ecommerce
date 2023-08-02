import { useEffect, useState } from "react";
import { CategoryApi } from "../services/api"

const useCategories = () => {
  const [categories, setCategories] = useState([]);

  const fetchCategories = (page, size) => {
    CategoryApi.getcategories(page, size)
      .then((res) => {
        setCategories(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchCategories()
  }, [])

  return {
    categories,
    fetchCategories
  }
};

export default useCategories;
