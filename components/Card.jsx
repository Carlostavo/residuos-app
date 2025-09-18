'use client'
import Link from 'next/link'

export default function Card({ title, desc, icon='fa-file', color='bg-gray-400', href }) {
  const Inner = (
    <div className="card p-6 rounded-2xl bg-white shadow hover:shadow-lg transition">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${color} mb-4`}>
        <i className={`fa-solid ${icon}`}></i>
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-gray-600 mt-2">{desc}</p>
    </div>
  )
  return href ? <Link href={href}>{Inner}</Link> : Inner
}
