// Mock creator data - this would come from API based on username

import UserProfileContent from "./ProfilePage";

export default async function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const id = parseInt((await params).id, 10);
  return <UserProfileContent id={id} />;
}
