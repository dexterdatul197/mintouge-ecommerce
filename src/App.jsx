import React, { Suspense, lazy, useEffect } from "react";
import ScrollToTop from "./helpers/scroll-top";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import useProducts from "./hooks/use-products";

// home pages
const HomeFashion = lazy(() => import("./pages/home/HomeFashion"));

// shop pages
const ShopGridStandard = lazy(() => import("./pages/shop/ShopGridStandard"));

// product pages
const Product = lazy(() => import("./pages/shop-product/Product"));

// blog pages
const BlogNoSidebar = lazy(() => import("./pages/blog/BlogNoSidebar"));
const BlogDetailsStandard = lazy(() =>
  import("./pages/blog/BlogDetailsStandard")
);
// other pages
const About = lazy(() => import("./pages/other/About"));
const Contact = lazy(() => import("./pages/other/Contact"));
const LoginRegister = lazy(() => import("./pages/other/LoginRegister"));

const Cart = lazy(() => import("./pages/other/Cart"));
const Wishlist = lazy(() => import("./pages/other/Wishlist"));
const Checkout = lazy(() => import("./pages/other/Checkout"));

const NotFound = lazy(() => import("./pages/other/NotFound"));
const Success = lazy(() => import("./pages/other/Success"));

const AuthGuard = (props) => {
  const navigate = useNavigate();
  const user = localStorage.getItem("demoUser");

  if (!user) {
    navigate("/login-register");
  }
  return <React.Fragment>{props.children}</React.Fragment>;
};


const App = () => {
  const { products, total, fetchProducts } = useProducts();

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <Router>
      <ScrollToTop>
        <Suspense
          fallback={
            <div className="vaultik-preloader-wrapper">
              <div className="vaultik-preloader">
                <span></span>
                <span></span>
              </div>
            </div>
          }
        >
          <Routes>
            <Route
              path={"/login-register"}
              element={<LoginRegister />}
            />
            <Route path={"/"} element={<HomeFashion products={products} />} />
            <Route
              path={"/home-fashion"}
              element={<HomeFashion products={products} />}
            />
            <Route
              path={"/shop-grid-standard"}
              element={<ShopGridStandard products={products} total={total} />}
            />
            <Route
              path={"/product/:id"}
              element={<Product products={products} />}
            />

            <Route path={"/blog-no-sidebar"} element={<BlogNoSidebar />} />
            <Route
              path={"/blog-details-standard"}
              element={<BlogDetailsStandard />}
            />
            <Route path={"/about-us"} element={<About />} />
            <Route path={"/contact"} element={<Contact />} />
            <Route path={"/login-register"} element={<LoginRegister />} />
            <Route path={"/cart"} element={<Cart />} />
            <Route path={"/wishlist"} element={<Wishlist />} />
            <Route path={"/checkout"} element={<Checkout />} />
            <Route path={"/success"} element={<Success />} />
            <Route
              path="*"
              element={<NotFound />}
            />
          </Routes>
        </Suspense>
      </ScrollToTop>
    </Router>
  );
};

export default App;
