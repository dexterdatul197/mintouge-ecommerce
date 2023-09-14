import { Fragment } from "react";
import { Link, useLocation } from "react-router-dom";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";

const Success = () => {
  let { pathname } = useLocation();

  return (
    <Fragment>
      <SEO
        titleTemplate="Success"
        description="Success of vaultik react minimalist eCommerce template."
      />
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb
          pages={[
            { label: "Home", path: "/" },
            { label: "Success", path: pathname }
          ]}
        />
        <div className="success-area pt-40 pb-100">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-xl-7 col-lg-8 text-center">
                <div className="success">
                  <h3>Congratulations!</h3>
                  <p>
                    Your order is confirmed. <br />
                    Check the email we've just sent to you to unlock the Digital Identity of your new luxury product!
                  </p>
                  <Link to={"/"} className="error-btn">
                    Back to home page
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default Success;
