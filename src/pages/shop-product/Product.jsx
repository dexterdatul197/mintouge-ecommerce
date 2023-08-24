import React, { Fragment, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import RelatedProductSlider from "../../wrappers/product/RelatedProductSlider";
import ProductDescriptionTab from "../../wrappers/product/ProductDescriptionTab";
import ProductImageDescription from "../../wrappers/product/ProductImageDescription";
import useProducts from "../../hooks/use-products";

const Product = (props) => {
  const { products } = props;
  let { pathname } = useLocation();
  let { id } = useParams();
  const { product, fetchProduct } = useProducts();
  const { categories } = useSelector((state) => state.category);
  const category = categories.find(
    (category) => category.id === product?.categoryId
  );

  useEffect(() => {
    fetchProduct(id);
  }, [id]);

  return (
    <Fragment>
      <SEO
        titleTemplate="Product Page"
        description="Product Page of vaultik react minimalist eCommerce template."
      />

      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb
          pages={[
            { label: "Home", path: "/" },
            { label: "Shop Product", path: pathname },
          ]}
        />

        {/* product description with image */}
        <ProductImageDescription
          spaceTopClass="pt-100"
          spaceBottomClass="pb-100"
          product={product}
        />

        {/* product description tab */}
        <ProductDescriptionTab
          spaceBottomClass="pb-90"
          productFullDesc={product?.fullDescription}
        />

        {/* related product slider */}
        <RelatedProductSlider
          spaceBottomClass="pb-95"
          category={category?.name}
          products={products}
        />
      </LayoutOne>
    </Fragment>
  );
};

export default Product;
