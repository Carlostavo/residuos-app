export default function PageWrapper({ title, children }){
  return (
    <div style={{ padding: 24 }}>
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <div className="card p-6">{children}</div>
    </div>
  )
}
