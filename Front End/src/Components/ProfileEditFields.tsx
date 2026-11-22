
import { useState } from "react";
import {
  UserRound,
  AtSign,
  Mail,
  LockKeyhole,
  Pencil,
  X,
} from "lucide-react";



type ProfileData = {
  displayName: string;
  username: string;
  email: string;
};

type EditableField = "displayName" | "username" | "email" | "password";

export type UpdatePayload =
  | {
      field: "displayName" | "username" | "email";
      value: string;
    }
  | {
      field: "password";
      currentPassword: string;
      newPassword: string;
    };

type Props = {
  data: ProfileData;
  onSave: (payload: UpdatePayload) => void | Promise<void>;
};

const ProfileEditFields = ({ data, onSave }: Props) => {
  const [selectedField, setSelectedField] =
    useState<EditableField | null>(null);

  const [value, setValue] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const fields = [
    {
      name: "displayName" as const,
      label: "Display Name",
      value: data.displayName,
      icon: UserRound,
    },
    {
      name: "username" as const,
      label: "Username",
      value: data.username,
      icon: AtSign,
    },
    {
      name: "email" as const,
      label: "Email Address",
      value: data.email,
      icon: Mail,
    },
    {
      name: "password" as const,
      label: "Password",
      value: "••••••••••••",
      icon: LockKeyhole,
    },
  ];

  const openEditor = (field: EditableField) => {
    setSelectedField(field);
    setError("");

    setValue(field === "password" ? "" : data[field]);

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const closeEditor = () => {
    if (isSaving) return;

    setSelectedField(null);
    setError("");
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedField) return;

    setError("");

    if (selectedField === "password") {
      if (!currentPassword || !newPassword || !confirmPassword) {
        setError("All password fields are required.");
        return;
      }

      if (newPassword !== confirmPassword) {
        setError("New passwords do not match.");
        return;
      }

      if (newPassword.length < 8) {
        setError("Password must contain at least 8 characters.");
        return;
      }
    } else {
      if (!value.trim()) {
        setError("This field cannot be empty.");
        return;
      }

      if (value.trim() === data[selectedField]) {
        setError("No changes detected.");
        return;
      }
    }

    try {
      setIsSaving(true);

      if (selectedField === "password") {
        await onSave({
          field: "password",
          currentPassword,
          newPassword,
        });
      } else {
        await onSave({
          field: selectedField,
          value: value.trim(),
        });
      }

      setSelectedField(null);
    } catch {
      setError("Unable to update. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const selectedLabel = fields.find(
    (field) => field.name === selectedField
  )?.label;

  return (
    <>
      {/* Profile fields */}
      <div className="rounded-2xl border border-gray-400/50 divide-y divide-gray-200">

        {fields.map((field) => {
          const Icon = field.icon;

          return (
            <div
              key={field.name}
              className="flex items-center gap-4 p-4"
            >
              <Icon
                size={22}
                className="text-gray-500 shrink-0"
              />

              <div className="flex-1 min-w-0">
                <label className="block text-sm text-gray-500 mb-1">
                  {field.label}
                </label>

                <p className="font-medium wrap-break">
                  {field.value}
                </p>
              </div>

              <button
                type="button"
                onClick={() => openEditor(field.name)}
                className="flex items-center gap-1.5 text-sm font-semibold text-indigo-500 hover:text-indigo-700 transition"
              >
                <Pencil size={15} />
                {field.name === "password" ? "Change" : "Edit"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Edit modal */}
      {selectedField && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeEditor();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-modal-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2
                id="profile-modal-title"
                className="text-xl font-bold text-gray-900"
              >
                {selectedField === "password"
                  ? "Change Password"
                  : `Edit ${selectedLabel}`}
              </h2>

              <button
                type="button"
                onClick={closeEditor}
                disabled={isSaving}
                className="text-gray-500 hover:text-gray-900"
                aria-label="Close modal"
              >
                <X size={21} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">

              {selectedField === "password" ? (
                <>
                  <input
                    type="password"
                    autoComplete="current-password"
                    placeholder="Current password"
                    value={currentPassword}
                    onChange={(e) =>
                      setCurrentPassword(e.target.value)
                    }
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500"
                  />

                  <input
                    type="password"
                    autoComplete="new-password"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) =>
                      setNewPassword(e.target.value)
                    }
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500"
                  />

                  <input
                    type="password"
                    autoComplete="new-password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(e.target.value)
                    }
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500"
                  />
                </>
              ) : (
                <input
                  type={
                    selectedField === "email" ? "email" : "text"
                  }
                  autoComplete="off"
                  autoFocus
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder={`Enter new ${selectedLabel}`}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500"
                />
              )}

              {error && (
                <p className="text-sm text-red-500" role="alert">
                  {error}
                </p>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeEditor}
                  disabled={isSaving}
                  className="rounded-xl border border-gray-300 px-4 py-2.5 hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-xl bg-indigo-600 px-5 py-2.5 text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileEditFields;
