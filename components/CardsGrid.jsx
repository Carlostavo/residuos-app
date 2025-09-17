import React from 'react'
export default function CardsGrid(){
  const cards = [
    {title:'Recolección', text:'Resumen de rutas'},
    {title:'Puntos', text:'Puntos limpios'},
    {title:'Estadísticas', text:'Gráficos de tendencia'}
  ]
  return (
    <section className="cards-grid">
      {cards.map((c,i)=>(
        <article className="card" key={i}>
          <h3>{c.title}</h3>
          <p>{c.text}</p>
        </article>
      ))}
    </section>
  )
}
