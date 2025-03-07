import './Footer.css';

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
            
            <div className="footer-pagination">
              <div className="pagination-item">1</div>
              <div className="pagination-item">2</div>
            </div>
            
            <div className="footer-social">
              <a href="#" className="social-icon">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-youtube"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
        </div>
      </footer>
    );
  }


export default Footer;