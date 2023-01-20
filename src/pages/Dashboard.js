import React, { useEffect } from "react";
import Home from "../components/Home";
import Header from "../components/Header";
import MobileHeader from "../components/MobileHeader";
import Footer from "../components/Footer";
import Sidebar from "../components/sidebar/Sidebar";
import "./Dashboard.css";

export default function Dashboard() {
  useEffect(() => {
    document.title = "Catgram";
  }, []);
  return (
    <div className="bg-gray-background ">
      <div class="bg-circles">
    <div class="circle-1"></div>
    <div class="circle-2"></div>
    <div class="circle-3"></div>
    <div class="circle-4"></div>
</div>
<section class="about-section sec-padding"></section>
<div class="main"></div>
      <Header />
      <MobileHeader />
      <div className="grid sm:grid-cols-2 2xl:grid-cols-3 gap-4 justify between mx-auto max-w-screen-md">
        <Home />
        <Sidebar />
      </div>
      <Footer />
    </div>
  );
}
