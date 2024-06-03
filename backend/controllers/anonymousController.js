const {query}= require("../dbconfig/dbconfig")

const reset_password_message= async(req, res)=>{
    try{
      const {to_username, from_username, message}= req.body;
      console.log("message is being saved in the database");
      const insertMessageQuery= `
      INSERT INTO messages
      (to_username, from_username, message)
      VALUES(?, ?, ?)
      `;
      console.log("message is about to be saved");
      console.log("to_username:", to_username);
      console.log("from_username:", from_username);
      console.log("message: ", message);
      const newMessage= await query({
          query: insertMessageQuery,
          values: [to_username, from_username, message]
      });
      console.log("new message to the table")
      return res.json({
          messageobj: {to_username, from_username, message}
      });
    } catch(error){
      console.log("Error adding message to the database");
      return res.status(500).json({
          status: 500,
          error: "Internal Server Error"
      })
    }
};

//function to get all the messages of the admin
const get_messages= async(req, res)=>{
   try{
      const {username}= req.body;
      const getMessages= `
      SELECT * FROM messages
      WHERE to_username= ? OR from_username= ?
      ORDER BY created_at DESC
      LIMIT 14 
      `;

      console.log("getting messages from database");
      const messagesObj= await query({
        query: getMessages,
        values: [username, username]
      })

      console.log("Received messages");
      return res.status(200).json({
           messages: messagesObj,
           status: 200
      })
   }catch(error){
     console.log("Error fetching messages from the database");
     return res.status(500).json({
        status: 500,
        error: "Internal Server Error"
     })
   }
}
module.exports= {reset_password_message, get_messages};