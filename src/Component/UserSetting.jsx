"use client"

import { useState } from "react"
import { Bell, Settings, Key, UserX, Save, HelpCircle, AlertCircle, Check } from "lucide-react"

const UserSetting = () => {
  const [activeTab, setActiveTab] = useState("preferences")
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [jobUpdatesEnabled, setJobUpdatesEnabled] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState(null)
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false)

  const handleSave = () => {
    if (newPassword && newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New password and confirmation do not match." })
      return
    }
    setMessage({ type: "success", text: "Settings saved successfully." })
  }

  const handleDeactivate = () => {
    setShowDeactivateDialog(false)
    setMessage({ type: "error", text: "Your account has been deactivated." })
  }

  // Custom Switch component
  const Switch = ({ checked, onChange }) => (
    <div
      style={{
        width: "40px",
        height: "20px",
        backgroundColor: checked ? "#ff8c00" : "#e0e0e0",
        borderRadius: "10px",
        position: "relative",
        cursor: "pointer",
        transition: "background-color 0.3s",
      }}
      onClick={() => onChange(!checked)}
    >
      <div
        style={{
          width: "16px",
          height: "16px",
          backgroundColor: "#ffffff",
          borderRadius: "50%",
          position: "absolute",
          top: "2px",
          left: checked ? "22px" : "2px",
          transition: "left 0.3s",
        }}
      />
    </div>
  )

  // Modal backdrop
  const Backdrop = ({ onClick }) => (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      onClick={onClick}
    />
  )

  // Deactivate confirmation dialog
  const DeactivateDialog = () => (
    <>
      <Backdrop onClick={() => setShowDeactivateDialog(false)} />
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          padding: "24px",
          width: "90%",
          maxWidth: "400px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          zIndex: 1001,
        }}
      >
        <h3 style={{ fontSize: "18px", marginBottom: "12px" }}>Are you absolutely sure?</h3>
        <p style={{ color: "#666", marginBottom: "24px" }}>
          This action cannot be undone. This will permanently delete your account and remove your data from our servers.
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
          <button
            style={{
              padding: "8px 16px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              backgroundColor: "#f5f5f5",
              cursor: "pointer",
            }}
            onClick={() => setShowDeactivateDialog(false)}
          >
            Cancel
          </button>
          <button
            style={{
              padding: "8px 16px",
              border: "none",
              borderRadius: "4px",
              backgroundColor: "#ff3b30",
              color: "#ffffff",
              cursor: "pointer",
            }}
            onClick={handleDeactivate}
          >
            Deactivate
          </button>
        </div>
      </div>
    </>
  )

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <Settings style={{ width: "24px", height: "24px", color: "#1e40af" }} />
        <h1 style={styles.heading}>User Settings</h1>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === "preferences" ? styles.activeTab : {}),
          }}
          onClick={() => setActiveTab("preferences")}
        >
          Preferences
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === "security" ? styles.activeTab : {}),
          }}
          onClick={() => setActiveTab("security")}
        >
          Security
        </button>
      </div>

      {/* Preferences Tab */}
      {activeTab === "preferences" && (
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.cardTitleContainer}>
              <Bell style={{ width: "20px", height: "20px", color: "#1e40af" }} />
              <h2 style={styles.cardTitle}>Notification Preferences</h2>
            </div>
            <p style={styles.cardDescription}>Manage your notification settings</p>
          </div>
          <div style={styles.cardContent}>
            <div style={styles.toggleRow}>
              <label style={styles.label}>Enable Notifications</label>
              <Switch checked={notificationsEnabled} onChange={setNotificationsEnabled} />
            </div>
            <div style={styles.toggleRow}>
              <label style={styles.label}>Enable Job Updates</label>
              <Switch checked={jobUpdatesEnabled} onChange={setJobUpdatesEnabled} />
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <div style={styles.securityContainer}>
          {/* Password Change */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.cardTitleContainer}>
                <Key style={{ width: "20px", height: "20px", color: "#1e40af" }} />
                <h2 style={styles.cardTitle}>Change Password</h2>
              </div>
              <p style={styles.cardDescription}>Update your account password</p>
            </div>
            <div style={styles.cardContent}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  style={styles.input}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={styles.input}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={styles.input}
                />
              </div>
            </div>
          </div>

          {/* Deactivate Account */}
          <div style={styles.dangerCard}>
            <div style={styles.cardHeader}>
              <div style={styles.cardTitleContainer}>
                <UserX style={{ width: "20px", height: "20px", color: "#ff3b30" }} />
                <h2 style={{ ...styles.cardTitle, color: "#ff3b30" }}>Deactivate Account</h2>
              </div>
              <p style={styles.cardDescription}>This action is permanent and cannot be undone</p>
            </div>
            <div style={styles.cardContent}>
              <p style={styles.warningText}>
                Deactivating your account will remove all your data and cannot be reversed. Please make sure you want to
                proceed.
              </p>
              <button style={styles.dangerButton} onClick={() => setShowDeactivateDialog(true)}>
                Deactivate Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Message Alert */}
      {message && (
        <div
          style={{
            ...styles.alert,
            borderColor: message.type === "success" ? "#4caf50" : "#ff3b30",
          }}
        >
          {message.type === "success" ? (
            <Check style={{ width: "20px", height: "20px", color: "#4caf50" }} />
          ) : (
            <AlertCircle style={{ width: "20px", height: "20px", color: "#ff3b30" }} />
          )}
          <div>
            <h4
              style={{
                margin: "0 0 4px 0",
                color: message.type === "success" ? "#4caf50" : "#ff3b30",
              }}
            >
              {message.type === "success" ? "Success" : "Error"}
            </h4>
            <p style={{ margin: 0 }}>{message.text}</p>
          </div>
        </div>
      )}

      {/* Save Button */}
      <div style={styles.buttonContainer}>
        <button style={styles.saveButton} onClick={handleSave}>
          <Save style={{ width: "16px", height: "16px", marginRight: "8px" }} />
          Save Settings
        </button>
      </div>

      {/* Help & Support Section */}
      <div style={styles.helpCard}>
        <div style={styles.cardHeader}>
          <div style={styles.cardTitleContainer}>
            <HelpCircle style={{ width: "20px", height: "20px", color: "#1e40af" }} />
            <h2 style={styles.cardTitle}>Help & Support</h2>
          </div>
        </div>
        <div style={styles.cardContent}>
          <p style={styles.helpText}>
            Need assistance with your account settings? Contact our support team at{" "}
            <a href="mailto:support@example.com" style={styles.link}>
              support@example.com
            </a>{" "}
            or call us at <span style={styles.bold}>1-800-123-4567</span> during business hours.
          </p>
        </div>
      </div>

      {/* Deactivate Dialog */}
      {showDeactivateDialog && <DeactivateDialog />}
    </div>
  )
}

const styles = {
  page: {
    maxWidth: "1000px",
    margin: "30px auto",
    padding: "20px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 0 20px rgba(0, 0, 0, 0.1)",
    fontFamily: "Segoe UI, sans-serif",
    color: "#1a1a1a",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "24px",
  },
  heading: {
    fontSize: "28px",
    margin: 0,
    color: "#1e40af",
  },
  tabs: {
    display: "flex",
    borderBottom: "1px solid #e5e7eb",
    marginBottom: "24px",
  },
  tab: {
    padding: "12px 24px",
    background: "none",
    border: "none",
    borderBottom: "2px solid transparent",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: 500,
    color: "#4b5563",
    transition: "all 0.2s",
  },
  activeTab: {
    color: "#ff8c00",
    borderBottom: "2px solid #ff8c00",
  },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "24px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
  },
  dangerCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "24px",
    border: "1px solid #ffcdd2",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
  },
  helpCard: {
    backgroundColor: "#f5f7ff",
    borderRadius: "8px",
    padding: "20px",
    marginTop: "24px",
    border: "1px solid #e5e7eb",
  },
  cardHeader: {
    marginBottom: "16px",
  },
  cardTitleContainer: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "4px",
  },
  cardTitle: {
    fontSize: "20px",
    margin: 0,
    color: "#1e3a8a",
  },
  cardDescription: {
    fontSize: "14px",
    color: "#6b7280",
    margin: "4px 0 0 0",
  },
  cardContent: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  toggleRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 0",
    borderBottom: "1px solid #e5e7eb",
  },
  securityContainer: {
    display: "grid",
    gap: "24px",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  },
  inputGroup: {
    marginBottom: "16px",
  },
  label: {
    display: "block",
    marginBottom: "6px",
    fontSize: "14px",
    fontWeight: 500,
  },
  input: {
    width: "100%",
    padding: "10px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "14px",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "24px",
  },
  saveButton: {
    display: "flex",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#ff8c00",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: 500,
  },
  dangerButton: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#ff3b30",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: 500,
  },
  alert: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    padding: "16px",
    borderRadius: "6px",
    border: "1px solid",
    marginTop: "24px",
    backgroundColor: "#f9f9f9",
  },
  warningText: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "16px",
  },
  helpText: {
    textAlign: "center",
    color: "#4b5563",
    fontSize: "14px",
  },
  link: {
    color: "#ff8c00",
    textDecoration: "underline",
  },
  bold: {
    fontWeight: 600,
  },
}

export default UserSetting

