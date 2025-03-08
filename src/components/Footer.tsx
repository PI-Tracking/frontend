import './Footer.css';
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
            <div className="footer-copyright">
              ©2025 Tracking
            </div>
            
            <div className="footer-brand">
              Tracking
            </div>
            
            <div className="footer-link-button">
              <button className="link-btn">Link</button>
            </div>
          </div>
          
          <hr className="footer-divider" />
          
          <div className="footer-row footer-nav">
            <div className="footer-nav-links">
              <a href="/" className="footer-nav-link">Home</a>
              <a href="/about" className="footer-nav-link">About</a>
              <a href="/contact" className="footer-nav-link">Contact</a>
            </div>
            
            <div className="footer-social">
              <a href="#" className="social-icon">
                <FaFacebookF />
              </a>
              <a href="#" className="social-icon">
                <AiFillLinkedin />
              </a>
              <a href="#" className="social-icon">
                <BsTwitterX />
              </a>
              <a href="#" className="social-icon">
                <FaGithub />
              </a>
              <a href="#" className="social-icon">
              <SiInstagram />
              </a>
            </div>
          </div>
        </div>
      </footer>
    );
  }


export default Footer;