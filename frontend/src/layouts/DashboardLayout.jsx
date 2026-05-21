import Sidebar from "../components/dashboard/Sidebar";

const DashboardLayout = ({
  children,
  activeSection,
  setActiveSection,
}) => {

  return (

    <div className="flex bg-slate-950 min-h-screen">

      <Sidebar
        activeSection={
          activeSection
        }

        setActiveSection={
          setActiveSection
        }
      />

      <main className="flex-1 p-6 lg:p-10 lg:ml-0 mt-20 lg:mt-0 overflow-x-hidden">

        {children}

      </main>

    </div>
  );
};

export default DashboardLayout;