const isLogin=(req,res,next)=>{
    if(!req?.userId){
             return res.status(401).json({
            success:false,
            message:"شما اجازه دسترسی به این صفحه را ندارید"
        })
    }
    next()
}
export default isLogin


