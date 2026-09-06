import { useEffect, useState } from "react";
import API from "../api";
import Navbar from "./Navbar";
import "./Profile.css";
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Building2,
  CalendarDays,
  Edit3,
  X,
} from "lucide-react";

function Profile({ onNavigate }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    department: "",
    year: "",
    division: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await API.get("accounts/profile/");

        setProfile(response.data);

        setFormData({
          first_name: response.data.first_name || "",
          last_name: response.data.last_name || "",
          phone_number: response.data.phone_number || "",
          department: response.data.department || "",
          year: response.data.year || "",
          division: response.data.division || "",
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setFormData({
      first_name: profile?.first_name || "",
      last_name: profile?.last_name || "",
      phone_number: profile?.phone_number || "",
      department: profile?.department || "",
      year: profile?.year || "",
      division: profile?.division || "",
    });

    setEditing(false);
  };


  const handleSave = async () => {
  try {
    const response = await API.patch(
      "accounts/profile/",
      formData
    );

    setProfile(response.data);
    setEditing(false);

    alert("Profile updated successfully!");
  } catch (error) {
    console.error("Profile update error:", error);
    console.log("Backend response:", error.response?.data);

    alert("Failed to update profile.");
  }
};

  if (loading) {
    return (
      <div className="profile-page">
        <Navbar onNavigate={onNavigate} />

        <div className="profile-loading">
          <div className="loader"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  const fullName =
    `${profile?.first_name || ""} ${profile?.last_name || ""}`.trim() ||
    profile?.username ||
    "Student";

  const avatarLetter =
    profile?.first_name?.charAt(0) ||
    profile?.username?.charAt(0) ||
    "U";

  return (
    <div className="profile-page">
      <Navbar onNavigate={onNavigate} />

      <main className="profile-content">

        {/* Profile Header */}

        <div className="profile-header">
          <div className="profile-avatar">
            {profile?.profile_picture ? (
              <img
                src={profile.profile_picture}
                alt="Profile"
              />
            ) : (
              avatarLetter.toUpperCase()
            )}
          </div>

          <div className="profile-header-info">
            <h1>{fullName}</h1>
            <p>@{profile?.username}</p>
          </div>

          {!editing && (
            <button
              className="edit-profile-btn"
              onClick={handleEdit}
            >
              <Edit3 size={17} />
              Edit Profile
            </button>
          )}
        </div>

        {/* Personal Information */}

        <section className="profile-card">
          <div className="profile-card-header">
            <div>
              <h2>Personal Information</h2>
              <p>Your basic contact information</p>
            </div>
          </div>

          <div className="profile-grid">

            <div className="profile-field">
              <div className="field-icon">
                <User size={18} />
              </div>

              <div className="field-content">
                <span>First Name</span>

                {editing ? (
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                  />
                ) : (
                  <strong>
                    {profile?.first_name || "Not provided"}
                  </strong>
                )}
              </div>
            </div>

            <div className="profile-field">
              <div className="field-icon">
                <User size={18} />
              </div>

              <div className="field-content">
                <span>Last Name</span>

                {editing ? (
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                  />
                ) : (
                  <strong>
                    {profile?.last_name || "Not provided"}
                  </strong>
                )}
              </div>
            </div>

            <div className="profile-field">
              <div className="field-icon">
                <Mail size={18} />
              </div>

              <div className="field-content">
                <span>Email</span>
                <strong>{profile?.email}</strong>
              </div>
            </div>

            <div className="profile-field">
              <div className="field-icon">
                <Phone size={18} />
              </div>

              <div className="field-content">
                <span>Phone Number</span>

                {editing ? (
                  <input
                    type="text"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                  />
                ) : (
                  <strong>
                    {profile?.phone_number || "Not provided"}
                  </strong>
                )}
              </div>
            </div>

          </div>
        </section>

        {/* Academic Information */}

        <section className="profile-card">
          <div className="profile-card-header">
            <div>
              <h2>Academic Information</h2>
              <p>Your college and academic details</p>
            </div>
          </div>

          <div className="profile-grid">

            <div className="profile-field">
              <div className="field-icon">
                <Building2 size={18} />
              </div>

              <div className="field-content">
                <span>Department</span>

                {editing ? (
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                  />
                ) : (
                  <strong>
                    {profile?.department || "Not provided"}
                  </strong>
                )}
              </div>
            </div>

            <div className="profile-field">
              <div className="field-icon">
                <GraduationCap size={18} />
              </div>

              <div className="field-content">
                <span>Year</span>

                {editing ? (
                  <input
                    type="text"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                  />
                ) : (
                  <strong>
                    {profile?.year || "Not provided"}
                  </strong>
                )}
              </div>
            </div>

            <div className="profile-field">
              <div className="field-icon">
                <CalendarDays size={18} />
              </div>

              <div className="field-content">
                <span>Division</span>

                {editing ? (
                  <input
                    type="text"
                    name="division"
                    value={formData.division}
                    onChange={handleChange}
                  />
                ) : (
                  <strong>
                    {profile?.division || "Not provided"}
                  </strong>
                )}
              </div>
            </div>

          </div>
        </section>

        {/* Edit Actions */}

        {editing && (
          <div className="profile-actions">
            <button
              className="cancel-profile-btn"
              onClick={handleCancel}
            >
              <X size={17} />
              Cancel
            </button>

            <button
  className="save-profile-btn"
  onClick={handleSave}
>
  Save Changes
</button>
          </div>
        )}

      </main>
    </div>
  );
}

export default Profile;