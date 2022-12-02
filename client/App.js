import React from "react";

import Navbar from "./components/Navbar";
import Routes from "./Routes";
import Footer from "./components/footer/Footer";

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes />
      <Footer />
    </div>
  );
};

export default App;
