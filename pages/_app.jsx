import '../styles/globals.css'
import Nav from '../components/Nav'
import { EditProvider } from '../components/EditContext'

export default function MyApp({ Component, pageProps }){
  return (
    <EditProvider>
      <Nav />
      <main>
        <Component {...pageProps} />
      </main>
    </EditProvider>
  )
}
