import Nav from './Nav'
import ToolbarTop from './ToolbarTop'
import EditorSidebar from './EditorSidebar'
import { useEdit } from './EditContext'
export default function Layout({ children }){
  const { showSidebar } = useEdit()
  return (
    <div className={'app-wrapper' + (showSidebar? ' with-sidebar':'')}>
      <Nav />
      <main className='canvas-area'>
        <div className={'canvas-inner'}>
          <div className='canvas-toolbar'><ToolbarTop /></div>
          {children}
        </div>
      </main>
      <EditorSidebar />
    </div>
  )
}
