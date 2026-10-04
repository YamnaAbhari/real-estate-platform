export const handleResize=(state,size)=>{
    const checkSize = () => state(window.innerWidth < size);
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
}