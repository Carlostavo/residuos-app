import Link from 'next/link'
export default function Card({ title, description, link }) {
  return (
    <div className="p-4 bg-white rounded shadow-sm hover:shadow-md transition">
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
      {link && <Link href={link}><a className="mt-3 inline-block text-sm text-green-600">Ir a {title}</a></Link>}
    </div>
  )
}
