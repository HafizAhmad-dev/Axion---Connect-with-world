import { useState } from "react";
import { Pencil, X, LockKeyhole } from "lucide-react";

import useProfileData from "../hooks/profileData.hook";
import ProfileFields from "../Components/profileFields";
import ProfileEditFields, {
  type UpdatePayload,
} from "../Components/ProfileEditFields";

const featuresInDevelopment =
  import.meta.env.VITE_FEATURES_IN_DEVELOPMENT === "true";

const ProfilePage = () => {
  const { profileData } = useProfileData();
  const [showComingSoon, setShowComingSoon] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  if (!profileData) {
    return <div>Loading profile...</div>;
  }

  const handleEdit = () => {
    if (featuresInDevelopment) {
      setShowComingSoon(true);
      return;
    }

    setIsEditing((prev) => !prev);
  };

  const handleProfileUpdate = async (payload: UpdatePayload) => {
    console.log(payload);
  };

  return (
    <main className="bg-highlight-section min-h-screen w-full overflow-auto">
      {/* Cover section */}
      <section className="relative w-full h-48 overflow-visible">
        <img
          src="/default.jpeg"
          alt="Profile cover"
          className="h-full w-full object-cover"
        />

        <button
          type="button"
          onClick={handleEdit}
          className="absolute top-4 right-4 p-2.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition"
          aria-label={isEditing ? "Cancel editing" : "Edit profile"}
        >
          {isEditing ? <X size={19} /> : <Pencil size={19} />}
        </button>

        {/* Avatar */}
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 size-32 rounded-full border-4 border-highlight-section overflow-hidden">
          <img
            src="/default-profile-pic.jpg"
            alt="Profile avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Profile information */}
      <section className="w-full max-w-2xl mx-auto px-4  pt-20 pb-10 ">
        {/* Name and username */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">{profileData.displayName}</h1>

          <p className="text-gray-500 mt-1">@{profileData.username}</p>
        </div>

        {!isEditing ? (
          <ProfileFields data={profileData} />
        ) : (
          <ProfileEditFields
            data={{
              displayName: profileData.displayName,
              username: profileData.username,
              email: profileData.email,
            }}
            onSave={handleProfileUpdate}
          />
        )}
      </section>

      {showComingSoon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl">
            <button
              onClick={() => setShowComingSoon(false)}
              className="absolute right-4 top-4 text-gray-500"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <LockKeyhole size={38} className="mx-auto mb-4 text-indigo-600" />

            <h2 className="text-xl font-bold text-gray-900">
              Feature in Development
            </h2>

            <p className="mt-3 text-sm text-gray-500">
              Profile editing is currently under development. Stay tuned for
              upcoming updates!
            </p>

            <button
              onClick={() => setShowComingSoon(false)}
              className="mt-6 w-full rounded-xl bg-indigo-600 py-2.5 font-semibold text-white"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default ProfilePage;
