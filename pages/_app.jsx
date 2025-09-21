import '../styles/globals.css'
import { AuthProvider } from '../lib/useAuth'
import { EditorProvider } from '../components/EditorContext'

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <EditorProvider>
        <Component {...pageProps} />
      </EditorProvider>
    </AuthProvider>
  )
}
