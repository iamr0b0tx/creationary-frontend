import { cookies } from "next/headers";
import HomePageComponent from "./HomepageComponent";

export default async function HomePage() {
  const user = (await cookies()).get("user")?.value
    ? JSON.parse((await cookies()).get("user")!.value)
    : null;
  
  return <HomePageComponent user={user} />;
}
