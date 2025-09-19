export default function Card({ title = '', desc = '', icon = 'fa-star', color = 'bg-gray-200', href = '#' }) {
  return (
    <a href={href} className="block p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 flex items-center justify-center rounded-full text-white ${color}`}>
          <i className={`fa-solid ${icon}`}></i>
        </div>
        <div>
          <h3 className="font-semibold text-lg text-gray-800">{title}</h3>
          <p className="text-sm text-gray-600 mt-1">{desc}</p>
        </div>
      </div>
    </a>
  )
}
