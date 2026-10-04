export const registerChatSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected", socket.id);

    socket.on("joinChat", (chatId) => {
      socket.join(chatId);
    });

    //   socket.on('sendMessage',(data)=>{
    //     io.to(data.chatId).emit("receiveMessage",data)
    //   })

    socket.on("deleteMessage", (data) => {
      io.to(data.chatId).emit("messageDeleted", data);
    });
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
