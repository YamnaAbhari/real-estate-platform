
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import ScrollToTop from '../../Components/ScrollToTop'

export default function Protected() {
const {token}=useSelector(state=>state.auth)
if(!token){
  return <Navigate to={'/auth/login'}/>
}
  return (
    <>
    <ScrollToTop />
    <Outlet/>
    </>
  )
}