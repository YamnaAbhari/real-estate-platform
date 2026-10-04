import Category from "./Category";
import HeroBanner from "./HerroBanner";
import Properties from "./Properties";
import ServicesSection from "./ServicesSection";
import WhyUs from "./WhyUs";


export default function Home() {
  return (
  
     <div>
        <HeroBanner/>
        <Category/>
        <WhyUs/>
        <Properties/>
        <ServicesSection/>
    </div>
    
  )
}
