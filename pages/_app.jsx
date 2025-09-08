import '../styles/globals.css'
import Nav from '../components/Nav'
import { EditProvider } from '../components/EditContext'
export default function MyApp({ Component, pageProps }){
  return (
    <EditProvider>
      <Nav />
      <main className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <Component {...pageProps} />
        </div>
      </main>
    </EditProvider>
  )
}
