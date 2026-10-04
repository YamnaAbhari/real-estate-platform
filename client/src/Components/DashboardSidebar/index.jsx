import { useEffect, useState } from "react"
import { handleResize } from "../../Utils/handleResize"
import MobileSidebar from "./MobileSidebar"
import DesktopSidebar from "./DesktopSidebar"



export default function DashboardSidebar() {
  const [isMobile,setIsMobile]=useState(window.innerWidth<1024)

  useEffect(()=>{
    handleResize(setIsMobile,1024)
  },[])
  return (
    <>{
      isMobile?<MobileSidebar/>:<DesktopSidebar/>
    }</>
  )
}

