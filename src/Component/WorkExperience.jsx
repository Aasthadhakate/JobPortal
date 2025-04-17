"use client"

import { FaBriefcase, FaCalendar, FaPencilAlt } from "react-icons/fa"

export default function WorkExperience({ experiences, onEdit }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">Work Experience</h2>
        <button
          onClick={onEdit}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          aria-label="Edit work experience">
          <FaPencilAlt className="w-4 h-4" />
        </button>     
      </div>

      {experiences?.map((experience) => (
        <div key={experience.id} className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start pb-3">
            <div>
              <h3 className="text-lg font-bold">{experience.title}</h3>
              <div className="flex items-center mt-1 text-gray-500">
                <FaBriefcase className="mr-1 w-4 h-4" />
                {experience.company}
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <FaCalendar className="mr-1 w-4 h-4" />
              {experience.period}
            </div>
          </div>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            {experience?.responsibilities?.map((responsibility, index) => (
              <li key={index}>{responsibility}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

