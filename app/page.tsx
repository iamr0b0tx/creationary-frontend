import { cookies } from "next/headers";
import HomePageComponent from "./HomepageComponent";

export default async function HomePage() {
  const userCookie = (await cookies()).get("user")?.value;
  const user = userCookie ? JSON.parse(userCookie) : null;

  return <HomePageComponent user={user} />;
}
