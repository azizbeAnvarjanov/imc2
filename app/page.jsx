import GetUserFS from "./components/GetUser";
import checkUserInDatabase from "./components/checkUserInDatabase";
import Navbar from "./components/Navbar";
import AttendesFunstion from "./components/attendesFunstions";

export default async function Home() {
  const user = await GetUserFS();
  checkUserInDatabase(user);
  return (
    <div>
      <Navbar />
      <div>
        <AttendesFunstion />
      </div>
    </div>
  );
}
