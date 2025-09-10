import '../styles/globals.css'
import Layout from '../components/Layout'
import { EditProvider } from '../components/EditContext'
export default function MyApp({ Component, pageProps }){ return (<EditProvider><Layout><Component {...pageProps} /></Layout></EditProvider>) }
