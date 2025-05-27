import "./footer.css";
import { SiInstagram } from "react-icons/si";
import { BsTwitterX } from "react-icons/bs";
import { AiFillLinkedin } from "react-icons/ai";
import { FaGithub } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa6";
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-row">
          <div className="footer-copyright">©2025 Tracking</div>

          <div className="footer-brand">Tracking</div>

          <div className="footer-link-button"></div>
        </div>

        <hr className="footer-divider" />

        <div className="footer-row footer-nav">
          <div className="footer-nav-links">
            <a href="/" className="footer-nav-link">
              Home
            </a>
            <a
              href="https://pi-tracking.github.io/microsite/"
              className="footer-nav-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              About
            </a>
            <a
              href="https://github.com/PI-Tracking"
              className="footer-nav-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Contact
            </a>
          </div>

          <div className="footer-social">
            <a>
            <p className="footer-social-text">
              Follow us on:
            </p>
            </a>
            <a
              href="https://github.com/PI-Tracking"
              className="social-icon"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
