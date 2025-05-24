import Footer from "@components/Footer";
import Navbar from "@components/Navbar";
import "./MainPage.css";

function MainPage() {
  return (
    <>
      <Navbar />
      <main className="page-container">
        <section className="product-introduction">
          <div className="bg-svg"></div>
          <div className="bg2-svg"></div>
          <div className="intro-content">
            <h1>Product Introduction</h1>
            <p className="intro-description">
              Tracking is a sophisticated proof-of-concept solution designed to
              enhance law enforcement capabilities. Our platform empowers police
              officers with advanced tools for:
            </p>
            <ul className="feature-list">
              <li>Real-time weapon detection and threat assessment</li>
              <li>Suspect tracking and movement analysis</li>
              <li>Interactive mapping of suspect pathways</li>
              <li>Comprehensive surveillance management</li>
            </ul>
            <p className="access-note">
              This application is exclusively available to authorized law
              enforcement personnel through verified organizational accounts.
            </p>
          </div>
        </section>
        <section className="detect-weapons-section">
          <div className="weapons-content">
            <h1>Weapon Detection</h1>
            <p className="weapons-description">
              Our advanced weapon detection system streamlines police work by
              automatically analyzing video footage for potential threats. While
              false positives may occur, our primary goal is to eliminate the
              need for manual review of hours of surveillance footage.
            </p>
            <div className="weapons-features">
              <div className="feature-item">
                <h3>Easy Upload</h3>
                <p>Simply upload video footage with a single click</p>
              </div>
              <div className="feature-item">
                <h3>Comprehensive Detection</h3>
                <p>Identifies various weapons including knives and firearms</p>
              </div>
              <div className="feature-item">
                <h3>Real-time Alerts</h3>
                <p>Instant notifications when weapons are detected</p>
              </div>
              <div className="feature-item">
                <h3>Automatic Tracking</h3>
                <p>Seamlessly tracks suspects carrying detected weapons</p>
              </div>
              <div className="feature-item">
                <h3>Secure Storage</h3>
                <p>
                  All detections are automatically saved to our secure database
                </p>
              </div>
            </div>
          </div>
          <div className="detect-weapons"></div>
        </section>
        <section className="track-subject">
          <div className="track-content">
            <h1>Track Subject</h1>
            <p className="track-description">
              Our advanced tracking system allows officers to monitor any
              subject of interest in live footage, beyond weapon-carrying
              individuals. The system maintains a comprehensive database of
              previously detected subjects, enabling quick recognition of
              reappearing individuals.
            </p>
            <div className="track-features">
              <div className="feature-item">
                <h3>Live Tracking</h3>
                <p>
                  Select and track any subject in real-time surveillance footage
                </p>
              </div>
              <div className="feature-item">
                <h3>Reappearance Detection</h3>
                <p>
                  Automatically identify previously tracked subjects in new
                  footage
                </p>
              </div>
              <div className="feature-item">
                <h3>Biometric Analysis</h3>
                <p>
                  Extract and store unique physical characteristics for
                  identification
                </p>
              </div>
              <div className="feature-item">
                <h3>Visual Recognition</h3>
                <p>Track subjects based on clothing colors and patterns</p>
              </div>
            </div>
          </div>
          <div className="track-subject-image"></div>
        </section>
        <section className="draw-path">
          <div className="path-content">
            <h1>Draw Path</h1>
            <p className="path-description">
              Our advanced path tracking system creates an interactive map of
              subject movements across all camera feeds. This comprehensive
              tracking enables officers to predict potential routes and identify
              patterns in suspect behavior.
            </p>
            <div className="path-features">
              <div className="feature-item">
                <h3>Multi-Camera Tracking</h3>
                <p>
                  Seamlessly track subjects across different camera locations
                </p>
              </div>
              <div className="feature-item">
                <h3>Path Prediction</h3>
                <p>Analyze movement patterns to predict potential routes</p>
              </div>
              <div className="feature-item">
                <h3>Interactive Mapping</h3>
                <p>
                  Visualize subject movements on an interactive map interface
                </p>
              </div>
              <div className="feature-item">
                <h3>Pattern Analysis</h3>
                <p>
                  Identify recurring patterns to optimize intervention
                  strategies
                </p>
              </div>
            </div>
          </div>
          <div className="draw-path-image"></div>
        </section>
        <section className="symbol-asthetics"></section>
      </main>
      <Footer />
    </>
  );
}

export default MainPage;
