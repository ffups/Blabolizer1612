import NamePage from "../pages/name";
import UsernameDisplay from "../components/usernameDisplay";
import CityInput from "@/components/cityInput";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div>
            <UsernameDisplay />
            <NamePage />
            <CityInput />
            <Footer />
    </div>
  );
}
