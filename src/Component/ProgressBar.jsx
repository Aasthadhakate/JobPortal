export default function ProgressBar({ percentage }) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
      <div className="bg-blue-800 h-full rounded-full" style={{ width: `${percentage}%` }}></div>
    </div>
  )
}

