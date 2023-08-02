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
            <div className="mintouge-preloader-wrapper">
              <div className="mintouge-preloader">
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
            <Route path={"/"} element={<AuthGuard><HomeFashion products={products} /></AuthGuard>} />
            <Route
              path={"/home-fashion"}
              element={<AuthGuard><HomeFashion products={products} /></AuthGuard>}
            />
            <Route
              path={"/shop-grid-standard"}
              element={<AuthGuard><ShopGridStandard products={products} total={total} /></AuthGuard>}
            />
            <Route
              path={"/product/:id"}
              element={<AuthGuard><Product products={products} /></AuthGuard>}
            />

            <Route path={"/blog-no-sidebar"} element={<AuthGuard><BlogNoSidebar /></AuthGuard>} />
            <Route
              path={"/blog-details-standard"}
              element={<AuthGuard><BlogDetailsStandard /></AuthGuard>}
            />
            <Route path={"/about-us"} element={<AuthGuard><About /></AuthGuard>} />
            <Route path={"/contact"} element={<AuthGuard><Contact /></AuthGuard>} />
            <Route path={"/login-register"} element={<AuthGuard><LoginRegister /></AuthGuard>} />
            <Route path={"/cart"} element={<AuthGuard><Cart /></AuthGuard>} />
            <Route path={"/wishlist"} element={<AuthGuard><Wishlist /></AuthGuard>} />
            <Route path={"/checkout"} element={<AuthGuard><Checkout /></AuthGuard>} />
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
