import "./App.css";
import Hero from "./components/Hero";
import DocumentUpload from "./components/DocumentUpload";
import BackgroundDots from "./components/ui/backgroundDotsLanding";

function App() {
  return (
    <div
      className="min-h-screen text-white relative overflow-hidden"
      style={{
        background:
          "radial-gradient(100% 45% at bottom, #35518d 4%, #111827 100%, #111827 100%)",
      }}
    >
      <BackgroundDots />
      <Hero />
      <DocumentUpload />
    </div>
  );
}

export default App;
