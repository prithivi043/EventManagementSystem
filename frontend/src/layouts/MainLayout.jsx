import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

const MainLayout = ({ children }) => {

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <Navbar />

      <main className="pt-20">
        {children}
      </main>

      <Footer />

    </div>
  );
};

export default MainLayout;