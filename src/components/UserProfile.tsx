import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { X, Camera, Save, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { fetcher, postRequest } from "@/utils/APIHelper";
import type { IResponse } from "@/utils/axiosInstance";
import type { User } from "../types/User";
import { useUserStore } from "../store/userStore";

interface UserProfileProps {
  user: { id: string; name: string; email: string; role: "user" | "admin" };
  onClose: () => void;
}

export function UserProfile({ user, onClose }: UserProfileProps) {
  const setUser = useUserStore((state) => state.setUser);
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const profileData = await fetcher<IResponse<User>>("/api/v1/profile");
        setName(profileData.data.name || user.name || "");
        setEmail(profileData.data.email || user.email || "");
        setBio(profileData.data.bio || "");
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load profile");
        // Fallback to user store data
        setName(user.name || "");
        setEmail(user.email || "");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      const updatedProfile = await postRequest<
        { name: string },
        IResponse<User>
      >("/profile", {
        name,
      });

      // Update user store with new data
      setUser({
        id: user.id,
        name: updatedProfile.data.name || name,
        email: updatedProfile.data.email || email,
        role: user.role,
      });

      alert("Profile updated successfully!");
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md shadow-xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2>Profile Settings</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              {/* Avatar */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src="https://images.unsplash.com/photo-1704726135027-9c6f034cfa41?w=150" />
                    <AvatarFallback>
                      {name[0]?.toUpperCase() ||
                        user.name[0]?.toUpperCase() ||
                        "U"}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-500">Click to change avatar</p>
              </div>

              {/* Form */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="profile-name">Full Name</Label>
                  <Input
                    id="profile-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profile-email">Email</Label>
                  <Input
                    id="profile-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profile-bio">Bio</Label>
                  <textarea
                    id="profile-bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex gap-2 justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={saving || loading}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving || loading}>
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
