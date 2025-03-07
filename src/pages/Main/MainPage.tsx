import Navbar from "@components/Navbar.tsx";
import "./MainPage.css";
import Footer from "@components/Footer.tsx";

function MainPage() {
  return (
    <div className="page-container">
      <div className="content-wrap">
        <Navbar />
        
        <div className="bg-svg"></div>
        <div className="bg2-svg"></div>
        
        <header className="relative bg-white">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gray-900"></div>
          <div className="relative z-10 max-w-6xl mx-auto py-20 px-6 text-white">
            <h1 className="text-4xl font-bold text-gray-900">Product Introduction</h1>
            <p className="mt-4 max-w-2xl text-lg text-gray-700">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget dolor.
            </p>
          </div>
        </header>
        
        <section className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg -mt-10 relative z-10 mb-20">
          <p className="text-gray-700 text-lg">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget dolor.
            Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
          </p>
        </section>

        {/* Add more sections here if needed */}
        
      </div>
      
      <Footer />
    </div>
  );
}

export default MainPage;