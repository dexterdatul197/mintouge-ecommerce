import { Fragment } from "react";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import TabProduct from "../../wrappers/product/TabProduct";

const HomeFashion = (props) => {
  const { products } = props;

  return (
    <Fragment>
      <SEO
        titleTemplate="Fashion Home"
        description="Fashion home of vaultik react minimalist eCommerce template."
      />
      <LayoutOne
        headerContainerClass="container-fluid"
        headerPaddingClass="header-padding-1"
      >
        {/* tab product */}
        <TabProduct
          spaceBottomClass="pb-60"
          category="men"
          products={products}
        />
      </LayoutOne>
    </Fragment>
  );
};

export default HomeFashion;
