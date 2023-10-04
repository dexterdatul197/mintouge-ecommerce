import PropTypes from "prop-types";
import React, { Fragment, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductCartQuantity } from "../../helpers/product";
import Rating from "./sub-components/ProductRating";
import { addToCart } from "../../store/slices/cart-slice";
import { addToWishlist } from "../../store/slices/wishlist-slice";
import { addToCompare } from "../../store/slices/compare-slice";
import { useEffect } from "react";

const ProductDescriptionInfo = ({
  product,
  discountedPrice,
  currency,
  finalDiscountedPrice,
  finalProductPrice,
  cartItems,
  wishlistItem,
  compareItem,
}) => {
  const dispatch = useDispatch();
  const colors = ["white", "black", "brown"];
  const size = ["x", "m", "xl", "xxl"];
  const tags = ["fashion", "women", "bag"];
  const { categories } = useSelector((state) => state.category);
  const [selectedProductColor, setSelectedProductColor] = useState(
    product?.variation ? product?.variation[0]?.color : ""
  );
  const navigate = useNavigate();
  const [selectedProductSize, setSelectedProductSize] = useState("x");
  const [productStock, setProductStock] = useState(10);
  const [quantityCount, setQuantityCount] = useState(1);
  const category = categories.find(
    (category) => category.id === product?.categoryId
  );

  const productCartQty = getProductCartQuantity(
    cartItems,
    product,
    selectedProductColor,
    selectedProductSize
  );

  useEffect(() => {
    setQuantityCount(1);
  }, [product]);

  return (
    <div className="product-details-content ml-70">
      <h2>{product?.name}</h2>
      <div className="product-details-price">
        {discountedPrice !== null ? (
          <Fragment>
            <span>{currency.currencySymbol + finalDiscountedPrice.toLocaleString("en-US")}</span>{" "}
            <span className="old">
              {currency.currencySymbol + finalProductPrice.toLocaleString("en-US")}
            </span>
          </Fragment>
        ) : (
          <span>{currency.currencySymbol + finalProductPrice.toLocaleString("en-US")} </span>
        )}
      </div>
      {product?.rating && product?.rating > 0 ? (
        <div className="pro-details-rating-wrap">
          <div className="pro-details-rating">
            <Rating ratingValue={product?.rating} />
          </div>
        </div>
      ) : (
        ""
      )}
      <div className="pro-details-list">
        <p>{product?.fullDescription}</p>
      </div>

      {/* {product?.variation ? ( */}
      <div className="pro-details-size-color">
        <div className="pro-details-color-wrap">
          <span>Color</span>
          <div className="pro-details-color-content">
            {colors.map((single, key) => {
              return (
                <label
                  className={`pro-details-color-content--single ${single}`}
                  key={key}
                >
                  <input
                    type="radio"
                    value={single}
                    name="product-color"
                    checked={single === selectedProductColor ? "checked" : ""}
                    onChange={() => {
                      setSelectedProductColor(single);
                      setSelectedProductSize("x");
                      setProductStock(10);
                      setQuantityCount(1);
                    }}
                  />
                  <span className="checkmark"></span>
                </label>
              );
            })}
          </div>
        </div>
        <div className="pro-details-size">
          <span>Size</span>
          <div className="pro-details-size-content">
            {/* {product?.variation &&
              product?.variation.map((single) => {
                return single.color === selectedProductColor ? */}
            {size.map((singleSize, key) => {
              return (
                <label className={`pro-details-size-content--single`} key={key}>
                  <input
                    type="radio"
                    value={singleSize}
                    checked={
                      singleSize === selectedProductSize ? "checked" : ""
                    }
                    onChange={() => {
                      setSelectedProductSize(singleSize);
                      setProductStock(10);
                      setQuantityCount(1);
                    }}
                  />
                  <span className="size-name">{singleSize}</span>
                </label>
              );
            })}
            {/* : "";
              })} */}
          </div>
        </div>
      </div>
      {/* ) : (
        ""
      )} */}

      <div className="pro-details-quality">
        <div className="cart-plus-minus">
          <button
            onClick={() =>
              setQuantityCount(quantityCount > 1 ? quantityCount - 1 : 1)
            }
            className="dec qtybutton"
          >
            -
          </button>
          <input
            className="cart-plus-minus-box"
            type="text"
            value={quantityCount}
            readOnly
          />
          <button
            onClick={() => setQuantityCount(quantityCount + 1)}
            className="inc qtybutton"
          >
            +
          </button>
        </div>
        <div className="pro-details-cart btn-hover">
          <button
            onClick={() => {
              dispatch(
                addToCart({
                  ...product,
                  quantity: quantityCount,
                  // selectedProductColor: selectedProductColor
                  //   ? selectedProductColor
                  //   : product.selectedProductColor
                  //   ? product.selectedProductColor
                  //   : null,
                  // selectedProductSize: selectedProductSize
                  //   ? selectedProductSize
                  //   : product.selectedProductSize
                  //   ? product.selectedProductSize
                  //   : null,
                })
              );
            }}
          >
            {" "}
            Add To Cart{" "}
          </button>
        </div>
        <div className="pro-details-cart btn-hover default">
          <button onClick={() => navigate('/cart')}>
            {" "}
            Proceed To Cart{" "}
          </button>
        </div>
        <div className="pro-details-wishlist">
          <button
            className={wishlistItem !== undefined ? "active" : ""}
            disabled={wishlistItem !== undefined}
            title={
              wishlistItem !== undefined
                ? "Added to wishlist"
                : "Add to wishlist"
            }
            onClick={() => dispatch(addToWishlist(product))}
          >
            <i className="pe-7s-like" />
          </button>
        </div>
      </div>
      {/* {product?.categoryId ? ( */}
      <div className="pro-details-meta">
        <span>Categories :</span>
        <ul>
          <li>
            <Link to={"/shop-grid-standard"}>bag</Link>
          </li>
        </ul>
      </div>
      {/* ) : (
        ""
      )} */}
      {product?.tags ? (
        <div className="pro-details-meta">
          <span>Tags :</span>
          <ul>
            {tags.map((single, key) => {
              return (
                <li key={key}>
                  <Link to={"/shop-grid-standard"}>{single}</Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        ""
      )}

      <div className="pro-details-social">
        <ul>
          <li>
            <a href="//facebook.com">
              <i className="fa fa-facebook" />
            </a>
          </li>
          <li>
            <a href="//dribbble.com">
              <i className="fa fa-dribbble" />
            </a>
          </li>
          <li>
            <a href="//pinterest.com">
              <i className="fa fa-pinterest-p" />
            </a>
          </li>
          <li>
            <a href="//twitter.com">
              <i className="fa fa-twitter" />
            </a>
          </li>
          <li>
            <a href="//linkedin.com">
              <i className="fa fa-linkedin" />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

ProductDescriptionInfo.propTypes = {
  cartItems: PropTypes.array,
  compareItem: PropTypes.shape({}),
  currency: PropTypes.shape({}),
  discountedPrice: PropTypes.number,
  finalDiscountedPrice: PropTypes.number,
  finalProductPrice: PropTypes.number,
  product: PropTypes.shape({}),
  wishlistItem: PropTypes.shape({}),
};

export default ProductDescriptionInfo;
