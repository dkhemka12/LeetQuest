import React from "react";
import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MainLayout = () => {
    return (
        <div className="flex min-h-screen flex-col bg-dark text-text-main">
            <Navbar />
            <main className="mx-auto w-full flex-1 max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
