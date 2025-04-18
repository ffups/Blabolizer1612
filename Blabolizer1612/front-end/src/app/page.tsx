import NamePage from "../pages/name";
import UsernameDisplay from "../components/usernameDisplay";
import CityInput from "@/components/cityInput";

export default function Home() {
  return (
    <div>
            <UsernameDisplay />
            <NamePage />
            <CityInput />
    </div>
  );
}
