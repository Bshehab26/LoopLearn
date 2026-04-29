import { useRef, useState } from "react";
import { HiCamera } from "react-icons/hi";

const ProfileHeader = ({ user, onAvatarChange }) => {
  const fileRef = useRef(null);
  const [preview, setPreview] = useState(null);

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : "?";

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    if (onAvatarChange) onAvatarChange(file);
  };

  return (
    <div
      className="relative rounded-2xl overflow-hidden p-8 flex flex-col sm:flex-row items-center gap-6"
      style={{ background: "linear-gradient(135deg, #EEEDFE 0%, #f8f8ff 100%)", border: "0.5px solid rgba(83,74,183,0.15)" }}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-semibold overflow-hidden"
          style={{ background: "#CECBF6", color: "#534AB7", border: "3px solid white" }}
        >
          {preview || user?.avatar ? (
            <img
              src={preview || user.avatar}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            initials
          )}
        </div>

        {/* Camera button */}
        <button
          onClick={() => fileRef.current.click()}
          className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center transition hover:opacity-90"
          style={{ background: "#534AB7", color: "white" }}
        >
          <HiCamera size={14} />
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
        />
      </div>

      {/* Info */}
      <div className="text-center sm:text-left">
        <h2 className="text-2xl font-semibold text-gray-800">
          {user?.fName && user?.lName
            ? `${user.fName} ${user.lName}`
            : user?.username || "Student"}
        </h2>
        <p className="text-sm mt-1" style={{ color: "#888780" }}>
          @{user?.username}
        </p>
        <span
          className="inline-block mt-2 text-xs px-3 py-1 rounded-full font-medium capitalize"
          style={{ background: "#EEEDFE", color: "#534AB7", border: "0.5px solid #AFA9EC" }}
        >
          {user?.role || "Student"}
        </span>
      </div>

      {/* Join date */}
      {user?.joinDate && (
        <p className="sm:ml-auto text-xs" style={{ color: "#B4B2A9" }}>
          Joined {new Date(user.joinDate).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </p>
      )}
    </div>
  );
};

export default ProfileHeader;
