// Mock creator data - this would come from API based on username

import { getCreator } from "@/lib/data/creator";
import UserProfileContent from "./ProfilePage";

export default async function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id
  const userData = await getCreator(id)
  return <UserProfileContent userData={userData.data} />;
}
