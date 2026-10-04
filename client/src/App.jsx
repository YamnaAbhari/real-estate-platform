
import { RouterProvider } from 'react-router-dom'
import router from './Router'
import { Toaster } from 'react-hot-toast'
import { Suspense } from 'react'
import MainLoading from './Components/Loading/MainLoading'


export default function App() {
  return (
    <Suspense fallback={<MainLoading/>}>
      <RouterProvider router={router} />
      <Toaster/>
    </Suspense>
  )
}
