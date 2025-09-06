export default function EditableElement({ el, editing }) {
  if (el.type === 'text') return <div dangerouslySetInnerHTML={{__html: el.content}} />;
  if (el.type === 'image') return <img src={el.src} alt={el.alt||''} style={{maxWidth:300}} />;
  if (el.type === 'video') return <iframe width="400" height="225" src={el.src} title="video" frameBorder="0" allowFullScreen />;
  return null;
}
