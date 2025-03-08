// import Navbar from "@components/Navbar.tsx";
// import "./MainPage.css";
// import Footer from "@components/Footer.tsx";


// function MainPage() {
//   return (
//     <div className="page-container">
//       <div className="content-wrap">
//         <Navbar />

//         <section className="product-introduction">
//           <div className="bg-svg"></div>
//           <div className="bg2-svg"></div>
//           <div className="intro-overlay"></div>
//           <div className="intro-content">
//             <h1 className="text-4xl font-bold text-gray-900">Product Introduction</h1>
//             <p className="mt-4 max-w-2xl text-lg text-gray-700">
//               Our advanced product offers state-of-the-art solutions for real-time detection and security enhancements.
//             </p>
//           </div>
//         </section>

//         <section className="detect-weapons-section">
//           <div className="detect-weapons-svg"></div>
//           <div className="detect-weapons-content">
//             <h2 className="text-3xl font-semibold">Weapon Detection</h2>
//             <p className="mt-2 text-lg">Real-time detection of weapons in the scene.</p>
//           </div>
//         </section>

//         <section className="security-enhancements-section">
//           <div className="security-enhancements-svg"></div>
//           <div className="security-enhancements-content">
//             <h2 className="text-3xl font-semibold">Security Enhancements</h2>
//             <p className="mt-2 text-lg">Enhanced security measures to protect against threats.</p>
//           </div>
//         </section>
//       </div>

//       {/* <Footer /> */}
//     </div>
//   );
// }

// export default MainPage;

import Footer from "@components/Footer";
import Navbar from "@components/Navbar.tsx";

function MainPage() {
  return (
    <>
      <Navbar />
      <main className="page-container">
        <section className="product-introduction">
          <div className="bg-svg"></div>
          <h1>Product Introduction</h1>
          <div className="t" style={{width: "100%", height: "700px"}}></div>

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
      {/* <Footer /> */}
    </>
  );
}

export default MainPage;