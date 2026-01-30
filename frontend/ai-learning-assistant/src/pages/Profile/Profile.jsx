import React, { useState, useEffect } from "react";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import authService from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { User, Mail, Lock } from "lucide-react";
import PageTransition from "../../components/common/PageTransition";

const Profile = () => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  /* ---------------- Fetch Profile ---------------- */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await authService.getProfile();
        console.log(response.data.user.username);
        
        setUsername(response.data.user.username);
        setEmail(response.data.user.email);
      } catch (error) {
        toast.error("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  /* ---------------- Change Password ---------------- */
  const handlePasswordChange = async () => {
    if (!newPassword || !confirmNewPassword) {
      return toast.error("Please fill in both password fields.");
    }

    if (newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters long.");
    }

    if (newPassword !== confirmNewPassword) {
      return toast.error("Passwords do not match.");
    }

    setPasswordLoading(true);
    try {
      await authService.changePassword({newPassword});

      toast.success("Password updated successfully!");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      toast.error(error.message || "Failed to update password.");
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner />
      </div>
    );
  }

  return (
    <PageTransition>


   
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-8">
      <PageHeader title="Profile Settings" />

      {/* Account Info (Read-only) */}
      <div className="bg-white border rounded-2xl p-6 space-y-4">
        <h3 className="font-semibold text-lg">Account Information</h3>
        <p className="text-sm text-gray-500">
          Your account details are managed by the system and cannot be edited.
        </p>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <User className="text-gray-400" />
            <input
              type="text"
              value={username}
              disabled
              className="w-full bg-gray-100 border rounded-lg px-3 py-2 text-sm text-gray-700 cursor-not-allowed"
            />
          </div>

          <div className="flex items-center gap-3">
            <Mail className="text-gray-400" />
            <input
              type="email"
              value={email}
              disabled
              className="w-full bg-gray-100 border rounded-lg px-3 py-2 text-sm text-gray-700 cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white border rounded-2xl p-6 space-y-4">
        <h3 className="font-semibold text-lg">Change Password</h3>
        <p className="text-sm text-gray-500">
          Enter a new password for your account.
        </p>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Lock className="text-gray-400" />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400"
              placeholder="New password"
            />
          </div>

          <div className="flex items-center gap-3">
            <Lock className="text-gray-400" />
            <input
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400"
              placeholder="Confirm new password"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button onClick={handlePasswordChange} disabled={passwordLoading}>
            {passwordLoading ? <Spinner /> : "Update Password"}
          </Button>
        </div>
      </div>
    </div>

     </PageTransition>
  );
};

export default Profile;
