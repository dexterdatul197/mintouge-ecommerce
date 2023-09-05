import { useState } from "react";
import { ProductApi } from "../services/api";

const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState();
  const [product, setProduct] = useState();

  const fetchProducts = async (setLoading) => {
    setLoading && setLoading(true);
    try {
      const productsData = await ProductApi.getProducts();
      setProducts(productsData.data);
      setTotal(productsData.total);
      setLoading && setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading && setLoading(false);
    }
  };

  const fetchProduct = async (id, setLoading) => {
    setLoading && setLoading(true);
    try {
      const productData = await ProductApi.getProductDetail(id);
      setProduct(productData);
      setLoading && setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading && setLoading(false);
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
