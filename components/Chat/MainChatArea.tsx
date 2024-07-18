// "use client";

// import React, { useState, useEffect } from "react";
// import { io } from "socket.io-client";
// import { useUser, useSession } from "@clerk/nextjs";
// import { Send, Smile } from "lucide-react";

// // Connect to the Socket.io server
// const socket = io();

// const MainChatArea = () => {
//   const { user } = useUser();
//   const [messages, setMessages] = useState([
//     {
//       id: 1,
//       text: "I want to make an appointment tomorrow from 2:00 to 5:00pm?",
//       sender: "Andri Thomas",
//       time: "1:55pm",
//     },
//     {
//       id: 2,
//       text: "Hello, Thomas! I will check the schedule and inform you.",
//       sender: "You",
//       time: "1:58pm",
//     },
//   ]);
//   const [newMessage, setNewMessage] = useState("");

//   useEffect(() => {
//     socket.on("receiveMessage", (message) => {
//       setMessages((prevMessages) => [...prevMessages, message]);
//     });

//     return () => {
//       socket.off("receiveMessage");
//     };
//   }, []);

//   const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (newMessage.trim()) {
//       const message = {
//         id: Date.now(),
//         text: newMessage,
//         sender: user?.firstName || "Unknown",
//         time: new Date().toLocaleTimeString(),
//       };
//       socket.emit("sendMessage", message);
//       setMessages([...messages, message]);
//       setNewMessage("");
//     }
//   };

//   return (
//     <div className="flex h-full flex-col border-l border-stroke dark:border-dark-3 xl:w-3/4">
//       <div className="sticky flex items-center justify-between border-b border-stroke py-4.5 pl-7.5 pr-6 dark:border-dark-3">
//         <div className="flex items-center">
//           <div className="mr-4.5 h-13 w-full max-w-13 overflow-hidden rounded-full">
//             <img
//               alt="avatar"
//               loading="lazy"
//               width="52"
//               height="52"
//               decoding="async"
//               data-nimg="1"
//               className="h-full w-full object-cover object-center"
//               src="/images/user/user-11.png"
//               style={{ color: "transparent" }}
//             />
//           </div>
//           <div>
//             <h5 className="font-medium text-dark dark:text-white">
//               Henry Dholi
//             </h5>
//             <p className="text-body-sm">Reply to message</p>
//           </div>
//         </div>
//         <div>
//           <div className="relative flex">
//             <button className="hover:text-primary">
//               <Send className="stroke-current" width="22" height="22" />
//             </button>
//           </div>
//         </div>
//       </div>
//       <div className="no-scrollbar max-h-full space-y-2 overflow-auto px-7.5 py-7">
//         {messages.map((message) => (
//           <div
//             key={message.id}
//             className={`flex ${message.sender === "You" ? "ml-auto" : ""} max-w-[340px]`}
//           >
//             <div>
//               <p className="mb-2 text-body-sm font-medium">{message.sender}</p>
//               <div
//                 className={`rounded-2xl ${message.sender === "You" ? "rounded-br-none bg-blue-light-5 dark:bg-opacity-10" : "rounded-tl-none bg-[#E8F7FF] dark:bg-opacity-10"} px-5 py-3`}
//               >
//                 <p className="font-medium text-dark dark:text-white">
//                   {message.text}
//                 </p>
//               </div>
//               <p
//                 className={`mt-2.5 text-body-sm ${message.sender === "You" ? "text-right" : ""}`}
//               >
//                 {message.time}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>
//       <div className="sticky bottom-0 border-t border-stroke bg-white px-7.5 py-5 dark:border-dark-3 dark:bg-gray-dark">
//         <form
//           className="flex items-center justify-between space-x-4.5"
//           onSubmit={sendMessage}
//         >
//           <div className="relative w-full">
//             <input
//               placeholder="Type something here..."
//               className="h-13 w-full rounded-[7px] border border-stroke bg-gray-1 py-2 pl-5 pr-22.5 text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
//               type="text"
//               value={newMessage}
//               onChange={(e) => setNewMessage(e.target.value)}
//             />
//             <div className="absolute right-4 top-1/2 inline-flex -translate-y-1/2 items-center justify-end gap-4.5">
//               <button type="button" className="hover:text-primary">
//                 <Send className="stroke-current" width="22" height="22" />
//               </button>
//               <button type="button" className="hover:text-primary">
//                 <Smile className="stroke-current" width="22" height="22" />
//               </button>
//             </div>
//           </div>
//           <button
//             type="submit"
//             className="flex h-13 w-full max-w-13 items-center justify-center rounded-md bg-primary text-white hover:bg-opacity-90"
//           >
//             <Send className="stroke-current" width="24" height="24" />
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default MainChatArea;
