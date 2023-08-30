import { React, Fragment, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import cogoToast from "cogo-toast";
import emailjs from "@emailjs/browser";
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { getDiscountPrice } from "../../helpers/product";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { OrderApi } from "../../services/api";
import { addDpp } from "../../store/slices/cart-slice";

const Checkout = () => {
  let cartTotalPrice = 0;

  let { pathname } = useLocation();
  const currency = useSelector((state) => state.currency);
  const { cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isMinting, setMinting] = useState(false);
  const { register, handleSubmit } = useForm();  
  const hasNftList = cartItems.filter((item) =>
    item.hasOwnProperty("insuranceFee")
  );

  const createInsurance = async (cartItem) => {
    try {
      const dpp = String(Date.now());
      const order = {
        productInfo: cartItem,
        consumerInfo: {
          email: user?.email,
          phone: "+0 000-000-0000",
          firstName: "Test",
          lastName: "User",
        },
        amount: Math.round(cartItem.insuranceFee * 100 || 0),
        chain: "goerli",
        dpp: dpp,
        redeemCode: dpp,
      };

      await OrderApi.addOrder(order);
      const _cartItem = {
        ...cartItem,
        dpp: order.dpp,
        redeemCode: order.redeemCode,
      };
      dispatch(addDpp(_cartItem));
      return _cartItem;
    } catch (error) {
      cogoToast.error(error.toString() + " error", { position: "bottom-left" });
      return undefined;
    }
  };

  const handlePlaceOrder = async () => {
    const strItemList = [];
    let index = 0;
    setMinting(true);
    for (const cartItem of cartItems) {
      if (cartItem.hasInsurance) {
        const item = await createInsurance(cartItem);

        if (!item) continue;

        const discountedPrice = getDiscountPrice(item.price, item.discount);
        const insuranceFee = item.insuranceFee ? (item.hasInsurance ? item.insuranceFee : 0) : 0;
        const finalProductPrice = (
          item.price * currency.currencyRate +
          insuranceFee
        ).toFixed(2);
        const finalDiscountedPrice = (
          discountedPrice * currency.currencyRate +
          insuranceFee
        ).toFixed(2);

        const dppText = item?.dpp ? `DPP: ${item?.dpp},` : "";
        const redeemCodeText = item?.redeemCode
          ? `RedeemCode: ${item?.redeemCode}`
          : "";

        const finalProductTotalPrice = discountedPrice != null
          ? finalDiscountedPrice * item.quantity
          : finalProductPrice * item.quantity;

        strItemList.push(`${index + 1}. ${item.name} - Quantity: ${item.quantity}, Price: $${currency.currencySymbol + finalProductTotalPrice.toFixed(2)
          }, ${dppText} ${redeemCodeText}`);
      }

      index++;
    }
    // cogoToast.success("Order was successfully placed", { position: "bottom-left" });

    const emailText = `
      Dear Customer,

      Thank you for your order. Here are the details of your purchase:

      ${strItemList.join("\n")}

      If you have any questions or need further assistance, please contact us.

      Best regards,
      Vaultik
    `;
    setMinting(false);
    if (strItemList.length > 0) {
      sendEmail(emailText);
    } else {
      cogoToast.error(
        "No product was purchased. :(",
        {
          position: "bottom-left",
        }
      );
    }
  }

  const sendEmail = (emailText) => {


    if (user?.email) {
      const templateParams = {
        to_email: user?.email,
        to_name: user?.email,
        from_name: "Vaultik",
        message: emailText,
      };

      emailjs
        .send(
          "service_zj2blbg",
          "template_9y4oc44",
          templateParams,
          "L5aFmmea8_pQLs-mf"
        )
        .then(
          (response) => {
            const alertText =
              hasNftList.length > 0
                ? "Digital Product Passport is stored as an NFT."
                : "Success";
            cogoToast.success(alertText, {
              position: "bottom-left",
            });
            Navigate('/success');
          },
          (err) => {
            cogoToast.error(err.toString() + "FAILED...", {
              position: "bottom-left",
            });
          }
        );
    } else {
      cogoToast.error(
        "Please login to your account first and then proceed with the payment.",
        {
          position: "bottom-left",
        }
      );
    }
  };

  return (
    <Fragment>
      <SEO
        titleTemplate="Checkout"
        description="Checkout page of vaultik react minimalist eCommerce template."
      />
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb
          pages={[
            { label: "Home", path: "/" },
            { label: "Checkout", path: pathname },
          ]}
        />
        <div className="checkout-area pt-95 pb-100">
          <div className="container">
            {cartItems && cartItems.length >= 1 ? (
                <form onSubmit={handleSubmit(async data => {
                  await handlePlaceOrder();
                })}>
                  <div className="row">
                    <div className="col-lg-7">
                      <div className="billing-info-wrap">
                        <h3>Billing Details</h3>
                        <div className="row">
                          <div className="col-lg-6 col-md-6">
                            <div className="billing-info mb-20">
                              <label>First Name</label>
                              <input type="text" name="f_name"/>
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6">
                            <div className="billing-info mb-20">
                              <label>Last Name</label>
                              <input type="text" name="l_name"/>
                            </div>
                          </div>
                          <div className="col-lg-12">
                            <div className="billing-info mb-20">
                              <label>Street Address</label>
                              <input
                                className="billing-address"
                                placeholder="House number and street name"
                                type="text"
                                name="county"
                              />
                              <input
                                placeholder="Apartment, suite, unit etc."
                                type="text"
                                name="street"
                              />
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6">
                            <div className="billing-info mb-20">
                              <label>Phone</label>
                              <input type="text" name="phone"/>
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6">
                            <div className="billing-info mb-20">
                              <label>Email Address</label>
                              <input {...register("email", { required: true })} type="text" name="email"/>
                            </div>
                          </div>
                        </div>
                      <div className="additional-info-wrap">
                        <h4>Additional information</h4>
                        <div className="additional-info">
                          <label>Order notes</label>
                          <textarea
                            placeholder="Notes about your order, e.g. special notes for delivery. "
                            name="message"
                            defaultValue={""}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-5">
                    <div className="your-order-area">
                      <h3>Your order</h3>
                      <div className="your-order-wrap gray-bg-4">
                        <div className="your-order-product-info">
                          <div className="your-order-top">
                            <ul>
                              <li>Product</li>
                              <li>Total</li>
                            </ul>
                          </div>
                          <div className="your-order-middle">
                            <ul>
                              {cartItems.map((cartItem, key) => {
                                const discountedPrice = getDiscountPrice(
                                  cartItem.price,
                                  cartItem.discount
                                );
                                const insuranceFee = cartItem.insuranceFee
                                  ? cartItem.hasInsurance
                                    ? cartItem.insuranceFee
                                    : 0
                                  : 0;
                                const finalProductPrice = (
                                  cartItem.price * currency.currencyRate +
                                  insuranceFee
                                ).toFixed(2);
                                const finalDiscountedPrice = (
                                  discountedPrice * currency.currencyRate +
                                  insuranceFee
                                ).toFixed(2);

                                discountedPrice != null
                                  ? (cartTotalPrice +=
                                    finalDiscountedPrice * cartItem.quantity)
                                  : (cartTotalPrice +=
                                    finalProductPrice * cartItem.quantity);
                                return (
                                  <li key={key}>
                                    <span className="order-middle-left">
                                      {cartItem.name} X {cartItem.quantity}
                                    </span>{" "}
                                    <span className="order-price">
                                      {discountedPrice !== null
                                        ? currency.currencySymbol +
                                        (
                                          finalDiscountedPrice *
                                          cartItem.quantity
                                        ).toFixed(2)
                                        : currency.currencySymbol +
                                        (
                                          finalProductPrice * cartItem.quantity
                                        ).toFixed(2)}
                                    </span>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                          <div className="your-order-bottom">
                            <ul>
                              <li className="your-order-shipping">Shipping</li>
                              <li>Free shipping</li>
                            </ul>
                          </div>
                          <div className="your-order-total">
                            <ul>
                              <li className="order-total">Total</li>
                              <li>
                                {currency.currencySymbol +
                                  cartTotalPrice.toFixed(2)}
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="payment-method"></div>
                      </div>
                      <div className="place-order mt-25">
                        <button className="btn-hover" type="submit" disabled={isMinting}>
                          Place Order
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <div className="row">
                <div className="col-lg-12">
                  <div className="item-empty-area text-center">
                    <div className="item-empty-area__icon mb-30">
                      <i className="pe-7s-cash"></i>
                    </div>
                    <div className="item-empty-area__text">
                      No items found in cart to checkout <br />{" "}
                      <Link to={"/shop-grid-standard"}>Shop Now</Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default Checkout;
