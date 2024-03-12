import { Toaster } from 'sonner';
import './App.css'
import Router from './routes'


function App() {
  return (
    <div className='w-screen h-screen'>
      <Toaster position="top-right" richColors />
      <Router />
    </div>
  )
}
export default App
