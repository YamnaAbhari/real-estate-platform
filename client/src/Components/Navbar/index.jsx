import { useEffect, useState } from "react"
import { handleResize } from "../../Utils/handleResize"
import MobileNav from "./MobileNav"
import DesktopNav from "./DesktopNav"



export default function Navbar() {
  const [isMobile,setIsMobile]=useState(window.innerWidth<1024)

  useEffect(()=>{
    handleResize(setIsMobile,1024)
  },[])
  return (
    <>{
      isMobile?<MobileNav/>:<DesktopNav/>
    }</>
  )
}
