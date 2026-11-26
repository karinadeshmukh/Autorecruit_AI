import { requireRole } from "@/lib/session";
import { dbConnect } from "@/lib/mongodb";
import { User } from "@/models/User";
import { ProfileForm } from "./form";

export default async function ProfilePage() {
  const sessionUser = await requireRole(["CANDIDATE"]);
  await dbConnect();
  const user = (await User.findById(sessionUser.id).lean()) as any;
  return (
    <div className="max-w-lg">
      <h1 className="text-3xl font-extrabold">Profile</h1>
      <ProfileForm
        defaults={{
          headline: user?.headline || "",
          location: user?.location || "",
          bio: user?.bio || "",
          skills: (user?.skills || []).join(", "),
        }}
      />
    </div>
  );
}
