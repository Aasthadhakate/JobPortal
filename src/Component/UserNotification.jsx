"use client"

import { useEffect, useState } from "react"
import { Bell } from "lucide-react"

function UserNotification({ userEmail }) {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`http://localhost:8080/api/notifications?email=${userEmail}`)
      .then((res) => res.json())
      .then((data) => {
        setNotifications(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching notifications:", err)
        setLoading(false)
      })
  }, [userEmail])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Notifications</h2>
          <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-sm font-medium">
            {notifications.length} {notifications.length === 1 ? "notification" : "notifications"}
          </span>
        </div>

        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="animate-bounce mb-4">
              <Bell size={48} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-medium mb-2 text-gray-800">Notification empty</h3>
            <p className="text-gray-500 mb-6">Explore jobs till then</p>
            <a
              href="/jobs"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
            >
              Explore Jobs
            </a>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className="flex items-start p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <div className="mr-3 mt-1">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Bell size={18} className="text-blue-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-gray-900">{notif.title}</h4>
                    <span className="text-xs text-gray-500">
                      {new Date(notif.timestamp).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-1">{notif.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default UserNotification
