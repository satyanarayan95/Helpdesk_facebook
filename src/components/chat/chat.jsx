import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import io from 'socket.io-client';

import ProfileImage from "../../assets/user.png";
import { getDate, getTime } from "../../lib/utils";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import axios from "axios";
import { useSelector } from "react-redux";

const socketURL = import.meta.env.VITE_SOCKET_URL
const socket = io(socketURL);


export const Chat = ({ chat, updateChat }) => {
  const baseURL = import.meta.env.VITE_API_URL;
  const { pageId, pageDetails } = useSelector((state) => state.fb);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const inputRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const authToken = localStorage.getItem('token');

  const chatBoxRef = useRef();

  useEffect(() => {
    socket.on('new message', (newMessage) => {
      // if (newMessage.clientId === chat.clientId) {
      //   updateChat(chat?.clientId, chat?.pageId, chat?.message, chat?.time);
      // }
    });

    return () => {
      socket.disconnect();
    };
  }, [chat,messages]);

  const sendNewMessage = async () => {
    if (message.trim() === "") {
      return;
    }

    try {
      if (!pageDetails?.id) {
        throw new Error(
          "Could not find page details ... please reconnect the facebook page"
        );
      }
      setLoading(true);

      const pageAccessToken = pageDetails?.pageAccessToken;
      const pageId = pageDetails?.id;
      const dataToSend = {
        pageId: pageId,
        clientId: chat?.clientId,
        message: message,
        accessToken: pageAccessToken,
      };

      await axios.post(`${baseURL}/messages/send-message`, dataToSend,{
        headers: {
          Authorization: authToken
        }
      });

      updateChat(chat?.clientId, pageId, message);
      setMessage("");
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } catch (error) {
      setLoading(false);
      // showError(error?.response?.data?.message);
    }
    setLoading(false);
  };



  const getGroupedMessages = () => {
    if (!pageDetails?.id) {
      errorToast("PageId not found, reconnect to facebook")
      return;
    }

    const messages = [];
    const clientName = chat?.client?.name;
    const pageName = pageDetails.name;
    const pageId = pageDetails.id,
      cliendId = chat?.cliendId;

    let currMessageGroup = {
      senderName: clientName,
      senderId: chat?.messages[0]?.senderId,
      time: chat?.messages[0]?.time,
      messages: [chat?.messages[0]?.message],
    };

    chat?.messages?.forEach((item, i) => {
      if (i > 0) {
        if (item.senderId === currMessageGroup.senderId) {
          currMessageGroup.messages.push(item.message);
          currMessageGroup.time = item.time;
        } else {
          messages.push(currMessageGroup);
          currMessageGroup = {
            senderName: item.senderId === pageId ? pageName : clientName,
            senderId: item.senderId,
            time: item.time,
            messages: [item.message],
          };
        }
      }
    });
    messages.push(currMessageGroup);
    setMessages(messages);
  };


  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendNewMessage();
    }

    if (event.key === "Enter" && event.shiftKey) {
      event.preventDefault();
      setMessage((prev) => prev + "\n");
    }
  };
  const handleInputChange = (event) => {
    setMessage(event.target.value);
  };

  useEffect(() => {
    getGroupedMessages();
  }, [chat?.messages]);

  return (
    <div className="flex flex-col h-full relative bg-[#F6F6F6]">
      <div className="overflow-hidden border-b border-black flex items-center justify-between p-2 opacity-65 gap-10 bg-white">
        <div className="flex items-center pb-1 ">
          <h1 className="text-xl font-semibold">{chat?.client?.first_name + ' ' + chat?.client?.last_name || "User"}</h1>
        </div>
      </div>

      {/* Chat goes here */}
      <div
        ref={chatBoxRef}
        className="flex flex-col items-start gap-2 pb-20 relative  p-3 overflow-scroll  h-full"
      >
        {messages?.map((data, i) => {
          if (data?.senderId === pageId) {
            return <RightMessageBubble key={i} chat={data} />;
          } else {
            return <LeftMessageBubble key={i} chat={data} />;
          }
        })}
      </div>

      <div className="p-2 flex justify-between w-full items-center gap-2">

        <AnimatePresence initial={false}>
          <motion.div
            key="input"
            className="w-full relative"
            layout
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1 }}
            transition={{
              opacity: { duration: 0.05 },
              layout: {
                type: "spring",
                bounce: 0.15,
              },
            }}
          >
            <Input
              autoComplete="off"
              ref={inputRef}
              onKeyDown={handleKeyPress}
              value={message}
              onChange={handleInputChange}
              name="message"
              placeholder="Aa"
              className={`${loading ? "animate-fade-right animate-infinite animate-ease-linear" : ''}w-full border rounded-full flex items-center h-auto resize-none overflow-hidden bg-background mb-2`}
            />
          </motion.div>
        </AnimatePresence>
      </div >
    </div>
  );
};


const RightMessageBubble = ({ chat }) => {
  return (
    <div className="text-black text-left ml-auto p-2 flex flex-col items-end w-full">
      <div className="flex gap-4 justify-end">
        <div className="flex flex-col gap-4  items-end max-w-[100%]">
          {chat?.messages?.map((mess, j) => (
            <Card key={j} className="py-2 px-4 shadow-sm">
              {mess}
            </Card>
          ))}
        </div>
        <div className="mt-auto">
          <img alt="user" src={ProfileImage} className="h-10 w-10" />
        </div>
      </div>
      <div className="flex gap-2 justify-end mr-14 mt-2 ">
        <span className="font-medium">{chat?.senderName} •</span>
        <span>
          {getDate(chat?.time)}, {getTime(chat?.time)}
        </span>
      </div>
    </div>
  );
};

const LeftMessageBubble = ({ chat }) => {
  return (
    <div className="text-black text-left p-2 flex flex-col items-start w-full">
      <div className="flex gap-4 w-full justify-start">
        <div className="mt-auto">
          <img alt="user" src={ProfileImage} className="h-10 w-10" />
        </div>
        <div className="flex flex-col gap-4 items-start  max-w-[60%]">
          {chat?.messages?.map((mess, j) => (
            <Card key={j} className="py-2 px-4 shadow-sm ">
              {mess}
            </Card>
          ))}
        </div>
      </div>

      <div className="flex gap-2 justify-end ml-16 mt-2">
        <span className="font-medium">{chat?.client?.first_name} •</span>
        <span className="opacity-60">
          {getDate(chat?.time)}, {getTime(chat?.time)}
        </span>
      </div>
    </div>
  );
};

