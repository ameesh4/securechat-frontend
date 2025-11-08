import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Camera, Save, ArrowLeft, Loader2 } from "lucide-react";
import { useUserStore } from "../store/userStore";
import type { User } from "../types/User";
import type { IResponse } from "@/utils/axiosInstance";
import { fetcher, postRequest, putRequest } from "@/utils/APIHelper";
import { toast } from "sonner";

export function ProfilePage() {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const profileData = await fetcher<IResponse<User>>("/profile");
        setName(profileData.data.name || user?.name || "");
        setEmail(profileData.data.email || user?.email || "");
        setBio(profileData.data.bio || "");
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load profile");
        // Fallback to user store data
        setName(user?.name || "");
        setEmail(user?.email || "");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      const updatedProfile = await putRequest<
        { name: string; bio: string },
        IResponse<User>
      >("/profile", {
        name,
        bio,
      });

      // Update user store with new data
      setUser({
        id: user?.id || "",
        name: updatedProfile.data.name || name,
        email: updatedProfile.data.email || email,
        role: user?.role || "user",
        bio: updatedProfile.data.bio || bio,
      });

      toast.success("Profile updated successfully!");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  //   if (!user) {
  //     return null;
  //   }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Avatar Section */}
          <div className="p-8 border-b border-gray-200">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Avatar className="w-32 h-32">
                  <AvatarImage
                    src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${
                      user?.name || user?.email || ""
                    }`}
                  />
                  <AvatarFallback className="text-2xl">
                    {name[0]?.toUpperCase() ||
                      user?.name[0]?.toUpperCase() ||
                      "U"}
                  </AvatarFallback>
                </Avatar>
                {/* <Button
                  size="icon"
                  className="absolute bottom-0 right-0 rounded-full h-10 w-10 bg-blue-600 hover:bg-blue-700"
                >
                  <Camera className="w-5 h-5" />
                </Button> */}
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">
                  Avatar are generated using your name as seed.
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  (Avatar upload coming soon)
                </p>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-8 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="profile-name" className="text-base font-medium">
                  Full Name
                </Label>
                <Input
                  id="profile-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="text-base"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="profile-email"
                  className="text-base font-medium"
                >
                  Email
                </Label>
                <Input
                  id="profile-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="text-base"
                  disabled
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile-bio" className="text-base font-medium">
                  Bio
                </Label>
                <textarea
                  id="profile-bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                />
                <p className="text-sm text-gray-500">{bio.length} characters</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-8 border-t border-gray-200 flex gap-3 justify-end text-black">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              className="text-black"
              onClick={handleSave}
              disabled={saving}
            >
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

        {/* Additional Info Section */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Account Information
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Role:</span>
              <span className="text-gray-900 capitalize">{user?.role}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
