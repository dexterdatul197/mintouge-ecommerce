import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const MobileNavMenu = () => {
  const { t } = useTranslation();

  return (
    <nav className="offcanvas-navigation" id="offcanvas-navigation">
      <ul>
        <li>
          <Link to={"/"}>Home</Link>
        </li>

        <li>
          <Link to={"/shop-grid-standard"}>
            Shop
          </Link>
        </li>
        <li>
          <Link to={"/blog-no-sidebar"}>
            Blog
          </Link>
        </li>
        <li>
          <Link to={"/about-us"}>
            About Us
          </Link>
        </li>
        <li>
          <Link to={"/contact"}>
            Contact Us
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default MobileNavMenu;
