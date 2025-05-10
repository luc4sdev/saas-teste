import { Header } from "@/components/landing-page/Header";
import { Hero } from "@/components/landing-page/Hero";

export default function Home() {
  return (
    <div className="w-full custom-bg">
      <div className="max-w-7xl mx-auto">
        <Header />
        <Hero />
      </div>
    </div>
  );
}
