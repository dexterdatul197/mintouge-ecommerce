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
          <Link to={"/login-register"}>
            login-register
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default MobileNavMenu;
