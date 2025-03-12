import Footer from "@components/Footer";
import Navbar from "@components/Navbar";
import "./MainPage.css";
import logo from "@assets/logo.png";

function MainPage() {
  return (
    <>
      <Navbar />
      <main className="page-container">
        <section className="product-introduction">
          <div className="bg-svg"></div>
          <div className="bg2-svg"></div>

          <h1>Product Introduction</h1>
        </section>
        <section className="detect-weapons-section">
          <h1>Weapon Detection</h1>
          <div className="detect-weapons"></div>
        </section>
        <section className="track-subject">
          <h1>Track Subject</h1>
          <div className="track-subject-image"></div>
        </section>
        <section className="draw-path">
          <h1>Draw Path</h1>
          <div className="draw-path-image"></div>
        </section>
        <section className="open-pose">
          <h1>Open Pose</h1>
          {/* No image for open pose yet */}
        </section>
        <section className="symbol-asthetics"></section>
      </main>
      <div className="break">
        <div className="logo">
          <img src={logo} className="logo-image" />
          <h1 style={{ color: "white" }}>Tracking</h1>
          <button className="link-button">Link</button>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default MainPage;
