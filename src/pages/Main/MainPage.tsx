
import Footer from "@components/Footer";
import Navbar from "@components/Navbar.tsx";
import "./MainPage.css";

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
        </section>
        <section className="track-subject">
          <h1>Track Subject</h1>
        </section>
        <section className="draw-path">
          <h1>Draw Path</h1>
        </section>
        <section className="open-pose">
          <h1>Open Pose</h1>
        </section>
        <section className="symbol-asthetics">
        </section>
      </main>
      <Footer />
    </>
  );
}

export default MainPage;