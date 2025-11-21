import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "./Topbar.css";
import logoText from "../images/logo_text_img.png";

function Topbar({ title, back = true }) {
  return (
    <div className="topbar">
      <div className="topbar-inner">
        {back && (
          <Link to="/choose" className="topbar-back">
            <FaArrowLeft />
          </Link>
        )}

        {/* ✔ 로고 클릭하면 /choose 로 이동 */}
        <Link to="/choose">
          <img src={logoText} alt="logo" className="topbar-logo" />
        </Link>

        <h2 className="topbar-title">{title}</h2>
      </div>
    </div>
  );
}

export default Topbar;
