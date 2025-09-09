import PageEditor from './_pageEditor'
import { useEdit } from '../components/EditContext'
export default function Page(){ 
  const { editMode } = useEdit(); 
  if(editMode) return <PageEditor slug='indicadores' title='Indicadores' /> 
  return (<div className='app-shell' style={paddingTop:24}><h1 className='text-3xl font-bold mb-4'>Indicadores</h1><div className='card p-6'><p>Contenido público de la página indicadores</p></div></div>)
}