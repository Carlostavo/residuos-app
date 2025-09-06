import React from 'react';

export default function EditableElement({ el, editing }){
  if(el.type === 'text'){
    return <div style={{padding:8, maxWidth:500}} dangerouslySetInnerHTML={{__html: el.content}} />;
  }
  if(el.type === 'image'){
    return <img src={el.src} alt={el.alt||''} style={{maxWidth:400, border: editing ? '2px dashed orange' : 'none'}} />;
  }
  if(el.type === 'video'){
    // Si es link de YouTube/iframe embed, mostrar iframe, si no, mostrar link
    const src = el.src || '';
    const isEmbed = src.includes('youtube') || src.includes('youtu.be') || src.includes('vimeo') || src.includes('embed');
    if(isEmbed){
      let url = src;
      if(src.includes('watch?v=')) url = src.replace('watch?v=', 'embed/');
      return <iframe width="560" height="315" src={url} title={el.alt||'video'} frameBorder="0" allowFullScreen />;
    }
    return <a href={src} target="_blank" rel="noreferrer">Ver video</a>;
  }
  return null;
}
