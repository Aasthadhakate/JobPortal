"use client";

import { FaPencilAlt } from "react-icons/fa";  
import SkillBadge from "./SkillBadge";

export default function Preferences({ preferences, onEdit }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 relative">
      <button
        onClick={onEdit}
        className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        aria-label="Edit preferences"
      >
        <FaPencilAlt className="w-4 h-4" />
      </button>

      <h2 className="text-xl font-bold mb-6">Job Preferences</h2>
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
        <PreferenceSection title="Desired Role" items={preferences?.desiredRoles || []} />
        <PreferenceSection title="Job Type" items={preferences?.jobTypes || []} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <PreferenceSection title="Industry Preference" items={preferences?.industries || []} />
          <div>
            <h3 className="text-sm font-medium mb-2">Expected Salary</h3>
            <p className="text-sm">{preferences?.salary || []}</p>
          </div>
        </div>

        <PreferenceSection title="Preferred Locations" items={preferences?.locations || []} />

        <div>
          <h3 className="text-sm font-medium mb-2">Notice Period</h3>
          <p className="text-sm">{preferences?.noticePeriod || []}</p>
        </div>
      </div>
    </div>
  )
}

function PreferenceSection({ title, items = [] }) {  // 👈 Provide a default empty array
  return (
    <div>
      <h3 className="text-sm font-medium mb-2">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <SkillBadge key={index} skill={item} />
        ))}
      </div>
    </div>
  );
}
