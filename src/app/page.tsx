import Navbar from "@/components/common/Navbar";
import Hero from "@/components/common/Hero";
import Footer from "@/components/common/Footer";

// Main Home Page Component
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
      </main>
      <Footer />
    </div>
  );
}
