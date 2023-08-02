import PropTypes from "prop-types";

const ProductImageFixed = ({ product }) => {
  return (
    <div className="product-large-image-wrapper">
      {product?.discount ? (
        <div className="product-img-badges">
          {product?.discount ? (
            <span className="pink">-{product?.discount}%</span>
          ) : (
            ""
          )}
        </div>
      ) : (
        ""
      )}

      <div className="product-fixed-image">
        {product.images? (
          <img
            src={product.images[0]}
            alt=""
            className="img-fluid"
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

ProductImageFixed.propTypes = {
  product: PropTypes.shape({})
};

export default ProductImageFixed;
