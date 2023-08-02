import { useState } from "react";
import { ProductApi } from "../services/api";

const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState();
  const [product, setProduct] = useState();

  const fetchProducts = async () => {
    try {
      const productsData = await ProductApi.getProducts();
      setProducts(productsData.data);
      setTotal(productsData.total);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProduct = async (id) => {
    try {
      const productData = await ProductApi.getProductDetail(id);
      setProduct(productData);
    } catch (err) {
      console.error(err);
    }
  };
  
  return {
    products,
    total,
    fetchProducts,
    product,
    fetchProduct,
  };
};

export default useProducts;
