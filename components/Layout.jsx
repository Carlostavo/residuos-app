import Nav from './Nav'
import ToolbarTop from './ToolbarTop'
import EditorSidebar from './EditorSidebar'
import { useEdit } from './EditContext'
export default function Layout({ children }){
  const { showSidebar } = useEdit()
  return (
    <div>
      <Nav />
      <ToolbarTop />
      <div className={showSidebar? 'canvas-offset':''}>
        <main className='canvas-area'>
          <div className={'canvas-inner'}>
            {children}
          </div>
        </main>
      </div>
      <EditorSidebar />
    </div>
  )
}
