"use client"

import { useState, useEffect } from "react"
import axios from "axios"

const AdminNotification = () => {
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState("")
  const [notifications, setNotifications] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [newNotification, setNewNotification] = useState(false)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [notificationsPerPage] = useState(5)

  const sendNotification = async () => {
    if (!title || !message) {
      setStatus("❌ Title and message are required.")
      return
    }

    try {
      setIsLoading(true)
      const response = await axios.post(
        "http://localhost:8080/api/notifications/sendToAll",
        { title, message },
        { withCredentials: true },
      )
      setStatus(response.data)
      setTitle("")
      setMessage("")
      setNewNotification(true)
      fetchNotifications() // refresh after sending

      // Reset the animation trigger after 2 seconds
      setTimeout(() => {
        setNewNotification(false)
      }, 2000)
    } catch (error) {
      console.error("Error sending notification:", error)
      setStatus("❌ Failed to send notifications.")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchNotifications = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get("http://localhost:8080/api/notifications", {
        withCredentials: true,
      })
      setNotifications(response.data)
    } catch (error) {
      console.error("Error fetching notifications:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  // Get current notifications for pagination
  const indexOfLastNotification = currentPage * notificationsPerPage
  const indexOfFirstNotification = indexOfLastNotification - notificationsPerPage
  const currentNotifications = notifications.slice(indexOfFirstNotification, indexOfLastNotification)

  // Calculate total pages
  const totalPages = Math.ceil(notifications.length / notificationsPerPage)

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  // Go to next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  // Go to previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  return (
    <div className="admin-notification-container">
      <div className="notification-layout">
        {/* Left side - Send notification form */}
        <div className="notification-form">
          <h2>Send Notification to All Users</h2>
          <input
            type="text"
            placeholder="Notification Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={status.includes("❌") ? "input-error" : ""}
          />
          <textarea
            placeholder="Notification Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={status.includes("❌") ? "input-error" : ""}
          />
          <button onClick={sendNotification} className={isLoading ? "loading" : ""} disabled={isLoading}>
            {isLoading ? "Sending..." : "Send"}
          </button>
          {status && <p className={`status-message ${status.includes("❌") ? "error" : "success"}`}>{status}</p>}
        </div>

        {/* Right side - Recent notifications */}
        <div className="notification-list">
          <h3>Recent Notifications</h3>
          {isLoading && currentNotifications.length === 0 ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
            </div>
          ) : currentNotifications.length > 0 ? (
            <>
              <ul>
                {currentNotifications.map((n, index) => (
                  <li
                    key={n.id}
                    className={`notification-item ${newNotification && index === 0 ? "new-notification" : ""}`}
                  >
                    <div className="notification-icon">{n.read ? "✅" : "📩"}</div>
                    <div className="notification-content">
                      <strong>{n.title}</strong> — {n.message} <br />
                      <em>📧 {n.userEmail}</em> <br />🕒 {new Date(n.timestamp).toLocaleString()} <br />
                      <span className={n.read ? "status-read" : "status-unread"}>{n.read ? "Read" : "Unread"}</span>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Pagination */}
              <div className="pagination">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className={`pagination-button ${currentPage === 1 ? "disabled" : ""}`}
                >
                  &laquo; Previous
                </button>

                <div className="pagination-numbers">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => paginate(i + 1)}
                      className={`pagination-number ${currentPage === i + 1 ? "active" : ""}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className={`pagination-button ${currentPage === totalPages ? "disabled" : ""}`}
                >
                  Next &raquo;
                </button>
              </div>

              <div className="pagination-info">
                Page {currentPage} of {totalPages} ({notifications.length} notifications)
              </div>
            </>
          ) : (
            <div className="no-notifications">
              <div className="empty-icon">📭</div>
              <p>No notifications found</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .admin-notification-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }
        
        .notification-layout {
          display: flex;
          flex-wrap: wrap;
          gap: 30px;
        }
        
        .notification-form {
          flex: 1;
          min-width: 300px;
        }
        
        .notification-list {
          flex: 1.5;
          min-width: 300px;
        }

        h2 {
          color: #2c3e50;
          font-size: 24px;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 2px solid #3498db;
        }

        h3 {
          color: #2c3e50;
          font-size: 20px;
          margin-top: 0;
          margin-bottom: 15px;
          padding-bottom: 8px;
          border-bottom: 1px solid #e0e0e0;
        }

        input, textarea {
          width: 100%;
          padding: 12px;
          margin-bottom: 15px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
          transition: border-color 0.3s, box-shadow 0.3s;
        }

        input:focus, textarea:focus {
          outline: none;
          border-color: #3498db;
          box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
        }

        .input-error {
          border-color: #e74c3c;
          background-color: #fdedec;
        }

        textarea {
          min-height: 120px;
          resize: vertical;
        }

        button {
          background-color: #3498db;
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 500;
          transition: background-color 0.3s, transform 0.2s;
        }

        button:hover {
          background-color: #2980b9;
        }

        button:active {
          transform: translateY(1px);
        }

        button.loading {
          background-color: #7f8c8d;
          cursor: not-allowed;
          position: relative;
          overflow: hidden;
        }

        button.loading::after {
          content: "";
          position: absolute;
          left: -100%;
          top: 0;
          height: 100%;
          width: 50%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          animation: loading 1.5s infinite;
        }

        @keyframes loading {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        .status-message {
          margin-top: 15px;
          padding: 10px 15px;
          border-radius: 4px;
          background-color: #f8f9fa;
          border-left: 4px solid;
          font-size: 14px;
          animation: fadeIn 0.3s ease-in;
        }

        .status-message.error {
          border-left-color: #e74c3c;
          background-color: #fdedec;
        }

        .status-message.success {
          border-left-color: #2ecc71;
          background-color: #eafaf1;
        }

        ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .notification-item {
          display: flex;
          background-color: #f8f9fa;
          border-radius: 6px;
          padding: 15px;
          margin-bottom: 15px;
          transition: transform 0.2s, box-shadow 0.2s;
          border-left: 3px solid #3498db;
        }

        .notification-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .notification-icon {
          font-size: 20px;
          margin-right: 15px;
          display: flex;
          align-items: center;
        }

        .notification-content {
          flex: 1;
        }

        .new-notification {
          animation: highlightNew 2s ease;
        }

        @keyframes highlightNew {
          0% { background-color: #d6eaf8; }
          50% { background-color: #d6eaf8; }
          100% { background-color: #f8f9fa; }
        }

        .notification-item strong {
          color: #2c3e50;
          font-size: 16px;
          display: block;
          margin-bottom: 5px;
        }

        .notification-item em {
          color: #7f8c8d;
          font-style: normal;
          display: inline-block;
          margin-top: 8px;
        }

        .status-read {
          display: inline-block;
          margin-top: 8px;
          color: #27ae60;
          font-weight: 500;
        }

        .status-unread {
          display: inline-block;
          margin-top: 8px;
          color: #3498db;
          font-weight: 500;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.7; }
          100% { opacity: 1; }
        }

        hr {
          border: none;
          border-top: 1px solid #ecf0f1;
          margin: 10px 0 5px;
        }
        
        .pagination {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 20px;
        }
        
        .pagination-numbers {
          display: flex;
          gap: 5px;
        }
        
        .pagination-number {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f8f9fa;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .pagination-number.active {
          background-color: #3498db;
          color: white;
          border-color: #3498db;
          transform: scale(1.1);
        }
        
        .pagination-button {
          background-color: #f8f9fa;
          border: 1px solid #ddd;
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .pagination-button:hover, .pagination-number:hover {
          background-color: #e9ecef;
          transform: translateY(-1px);
        }
        
        .pagination-button.disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }
        
        .pagination-info {
          text-align: center;
          margin-top: 10px;
          font-size: 14px;
          color: #7f8c8d;
        }
        
        .no-notifications {
          text-align: center;
          padding: 30px;
          color: #7f8c8d;
          background-color: #f8f9fa;
          border-radius: 6px;
        }

        .empty-icon {
          font-size: 40px;
          margin-bottom: 10px;
          animation: bounce 2s infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 200px;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @media (max-width: 768px) {
          .notification-layout {
            flex-direction: column;
          }
          
          .admin-notification-container {
            padding: 15px;
          }
          
          h2 {
            font-size: 20px;
          }
          
          h3 {
            font-size: 18px;
          }
          
          .pagination {
            flex-direction: column;
            gap: 10px;
          }
          
          .pagination-numbers {
            order: -1;
          }
        }
      `}</style>
    </div>
  )
}

export default AdminNotification
