import {fileURLToPath} from 'url'
import path from 'path'
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import { catchError } from 'vanta-api'
import authRouter from './Modules/Auth/auth.js'
import { protect } from './Middlewares/protect.js'
import userRouter from './Modules/User/user.js'
import propertyRouter from './Modules/Property/property.js'
import reportRouter from './Modules/Report/report.js'
import inquiryRouter from './Modules/Inquiry/inquiry.js'
import wishlistRouter from './Modules/Wishlist/wishlist.js'
import contactRouter from './Modules/Contact/contact.js'
import { authorize } from './Middlewares/authorize.js'
import chatRouter from './Modules/Chat/chat.js'
import messageRouter from './Modules/Message/message.js'
import uploadRouter from './Modules/Upload/Upload.js'

const __filename=fileURLToPath(import.meta.url)
export const __dirname=path.dirname(__filename)
const app=express()

export const allowedOrigins=['http://localhost:5173'].filter(Boolean)
app.use(cors({
    origin:function(origin,callback){
        if(!origin||allowedOrigins.includes(origin)){
            callback(null,true)
        }else{
            callback(new Error("New Error By CORS"))
        }
    },
    credentials:true
}))

app.use(morgan('dev'))
app.use(express.json())
app.use('/upload',express.static(`${__dirname}/Public`))
app.use('/api/uploads',uploadRouter)
app.use('/api/auth',authRouter)
app.use("/api/users", protect, userRouter);
app.use("/api/properties",propertyRouter)
app.use("/api/reports",reportRouter)
app.use("/api/inquiry",inquiryRouter)
app.use('/api/wishlists', protect,authorize('buyer') ,wishlistRouter);
app.use('/api/contacts',contactRouter)
app.use('/api/chats', protect, chatRouter);
app.use('/api/chats/:chatId/messages', protect, messageRouter);
app.use((req,res,next)=>{
    return res.status(404).json({
        success:false,
        message:'Route Not Found'
    })
})
app.use(catchError)

export default app