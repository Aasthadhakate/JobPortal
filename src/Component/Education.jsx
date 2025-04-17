"use client"

import { FaGraduationCap, FaCalendar, FaPencilAlt } from "react-icons/fa"

export default function Education({ educationItems, onEdit }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">Education</h2>
        <button
          onClick={onEdit}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          aria-label="Edit education"
        >
          <FaPencilAlt className="w-4 h-4" />
        </button>
      </div>

      {educationItems?.map((item) => (
        <div key={item.id} className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start pb-3">
            <div>
              <h3 className="text-lg font-bold">{item.degree}</h3>
              <div className="flex items-center mt-1 text-gray-500">
                <FaGraduationCap className="mr-1 w-4 h-4" />
                {item.institution}
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <FaCalendar className="mr-1 w-4 h-4" />
              {item.period}
            </div>
          </div>
          <p className="text-sm">{item.description}</p>
        </div>
      ))}
    </div>
  )
}

