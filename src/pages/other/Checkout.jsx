import cogoToast from "cogo-toast";
import emailjs from "@emailjs/browser";
import { React, Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";

import SEO from "../../components/seo";
import { OrderApi } from "../../services/api";
import Loading from "../../components/Loading";
import LayoutOne from "../../layouts/LayoutOne";
import { getDiscountPrice } from "../../helpers/product";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { addDpp, deleteAllFromCart } from "../../store/slices/cart-slice";

const Checkout = () => {
    let cartTotalPrice = 0;

    const dispatch = useDispatch();
    const navigate = useNavigate();
    let { pathname } = useLocation();
    const currency = useSelector((state) => state.currency);
    const { cartItems } = useSelector((state) => state.cart)
        ;
    const [isMinting, setMinting] = useState(false);
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");

    const hasNftList = cartItems.filter((item) =>
        item.hasOwnProperty("insuranceFee")
    );

    const createInsurance = async (cartItem) => {
        try {
            const dpp = String(Date.now());
            const order = {
                productInfo: cartItem,
                consumerInfo: {
                    email: email,
                    phone: phone,
                    firstName: firstName,
                    lastName: lastName,
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
        if (email.trim() === "") {
            cogoToast.error(
                "Please fill in Email.",
                { position: "bottom-center" }
            );
            return;
        }

        if (phone.trim() === "") {
            cogoToast.error(
                "Please fill in Phone Number.",
                { position: "bottom-center" }
            );
            return;
        }

        if (firstName.trim() === "") {
            cogoToast.error(
                "Please fill in First Name.",
                { position: "bottom-center" }
            );
            return;
        }

        if (lastName.trim() === "") {
            cogoToast.error(
                "Please fill in Last Name.",
                { position: "bottom-center" }
            );
            return;
        }

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

        const emailText = `
            Dear Customer,

            Thank you for your order. Here are the details of your purchase:

            ${strItemList.join("\n")}

            If you have any questions or need further assistance, please contact us.

            Best regards,
            Vaultik
        `;
        if (strItemList.length > 0) {
            sendEmail(emailText);
        } else {
            cogoToast.error(
                "No product was purchased. :(",
                { position: "bottom-center" }
            );
        }
        setMinting(false);
    }

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    }

    const handleFirstNameChange = (e) => {
        setFirstName(e.target.value);
    }

    const handleLastNameChange = (e) => {
        setLastName(e.target.value);
    }

    const handlePhoneChange = (e) => {
        setPhone(e.target.value);
    }

    const sendEmail = (emailText) => {
        const templateParams = {
            to_email: email,
            to_name: email,
            from_name: "Vaultik",
            message: emailText,
        };

        emailjs.send(
            "service_zj2blbg",
            "template_9y4oc44",
            templateParams,
            "L5aFmmea8_pQLs-mf"
        ).then(() => {
            const alertText = "Digital Product Passport is stored as an NFT.";
            cogoToast.success(alertText, { position: "bottom-left" });
            navigate('/success');
            dispatch(deleteAllFromCart());
        }, (err) => {
            cogoToast.error(err.toString() + "FAILED...", { position: "bottom-left", });
        });
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
                            <div className="row">
                                <div className="col-lg-7">
                                    <div className="billing-info-wrap">
                                        <h3>Billing Details</h3>
                                        <div className="row">
                                            <div className="col-lg-6 col-md-6">
                                                <div className="billing-info mb-20">
                                                    <label>First Name</label>
                                                    <input
                                                        value={firstName}
                                                        type="text"
                                                        name="email"
                                                        onChange={handleFirstNameChange}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-6 col-md-6">
                                                <div className="billing-info mb-20">
                                                    <label>Last Name</label>
                                                    <input
                                                        value={lastName}
                                                        type="text"
                                                        name="lastName"
                                                        onChange={handleLastNameChange}
                                                    />
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
                                                    <input
                                                        value={phone}
                                                        type="text"
                                                        name="phone"
                                                        onChange={handlePhoneChange}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-6 col-md-6">
                                                <div className="billing-info mb-20">
                                                    <label>Email Address</label>
                                                    <input
                                                        value={email}
                                                        type="text"
                                                        name="email"
                                                        onChange={handleEmailChange}
                                                    />
                                                </div>
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
                                                            const discountedPrice = cartItem.price;
                                                            const insuranceFee = cartItem.hasInsurance ? cartItem.insuranceFee : 0;
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
                                            <button className="btn-hover" onClick={handlePlaceOrder} disabled={isMinting}>
                                                {isMinting ? <Loading /> : "Place Order"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
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
