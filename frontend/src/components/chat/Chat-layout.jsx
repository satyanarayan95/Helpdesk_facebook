import React, { useEffect, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import axios from "axios";
import { Menu, RotateCw } from "lucide-react";
import { UserProfile } from "./UserProfile";
import { ChatList } from "./chat-list";
import { useSelector } from "react-redux";
import { Chat } from "./chat";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const ChatLayout = ({
  defaultLayout = [26, 74],
  defaultCollapsed = false,
  navCollapsedSize,
}) => {
  const navigate = useNavigate();
  const { isFacebookLinked, fbPageAccessToken, pageDetails } = useSelector((state) => state.fb);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const baseURL = import.meta.env.VITE_API_URL;
  const authToken = localStorage.getItem('token');

  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [isMobile, setIsMobile] = useState(false);
  const [fetchLoader, setFetchLoader] = useState(false);

  useEffect(() => {
    if(!isFacebookLinked) navigate('/connect-fb')
    const checkScreenWidth = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkScreenWidth();
    window.addEventListener("resize", checkScreenWidth);

    return () => {
      window.removeEventListener("resize", checkScreenWidth);
    };
  }, []);



  const getClientDetails = async (chat) => {
    try {
      if (!pageDetails.id) {
        throw new Error("Please connect to a facebook page");
      }

      const clientId = chat?.clientId;
      const res = await axios.get(`https://graph.facebook.com/v19.0/${clientId}`, {
        params: {
          access_token: fbPageAccessToken
        },
      });
      const clientDetails = res.data;
      chat.client = clientDetails;
      return chat;
    } catch (error) {
      const errorCode = error?.response?.data?.error?.code;
      if (errorCode === 190) {
        toast.error("Access token expired ... please reconnect to facebook page",{duration:2000});
        return;
      }
      // toast.error(error?.message,{duration:1500});
    }
  };

  const getAllMessages = async () => {
    try {
      setFetchLoader(true)
      if (!pageDetails.id) {
        toast.error("Please connect to a facebook page",{duration:2000});
        return;
      }
      const res = await axios.get(`${baseURL}/messages/all`, {
        params: { pageId: pageDetails.id },
        headers: {
          Authorization: authToken
        }
      });

      const allChats = res.data.messages;
      const allChatsNamedPromises = allChats?.map((chat) => {
        return getClientDetails(chat);
      });
      const chats = await Promise.all(allChatsNamedPromises);
      setFetchLoader(false)
      setChats(chats);
    } catch (error) {
      setFetchLoader(false)
      toast.error("error occured while fetching messages",{duration: 2000})
    }
  };

  const selectAChat = (chat) => {
    setSelectedChat(chat);
  };

  useEffect(() => {
    // let timer;
    if (fbPageAccessToken && pageDetails) {
      getAllMessages();
      // timer = setInterval(()=> {
      //   getAllMessages();
      // },15000);
    }
    // return () => clearInterval(timer)
  }, [fbPageAccessToken, pageDetails]);

  const updateChat = async (clientId, senderId, message) => {
    let chatExists = false;
    const updatedChats = chats?.map((c) => {
      if (c?.clientId === clientId) {
        chatExists = true;
        const updatedChat = {
          ...c,
          messages: [
            ...c.messages,
            {
              senderId: senderId,
              message: message,
              time: Date.now(),
            },
          ],
        };
        if (updatedChat?.clientId === selectedChat?.clientId) {
          setSelectedChat(updatedChat);
        }
        return updatedChat;
      }
      return c;
    });

    if (chatExists) {
      setChats(updatedChats);
    } else {
      const newChat = {
        clientId: clientId,
        senderId: clientId,
        messages: [
          {
            senderId: senderId,
            message: message,
            time: Date.now(),
          },
        ],
      };

      const newChatWithDetails = await getClientDetails(newChat);
      setChats((prev) => [...prev, newChatWithDetails]);
    }
    getAllMessages();
  };


  return (
    <ResizablePanelGroup
      direction="horizontal"
      onLayout={(sizes) => { localStorage.setItem("layout-size", JSON.stringify(sizes)) }}
      className="h-full items-stretch"
    >
      <ResizablePanel
        defaultSize={defaultLayout[0]}
        collapsedSize={navCollapsedSize}
        collapsible={true}
        minSize={isMobile ? 2 : 24}
        maxSize={isMobile ? 8 : 50}
        onCollapse={() => {
          setIsCollapsed(true);
          localStorage.setItem("layout-collapse", JSON.stringify(true))
        }}
        onExpand={() => {
          setIsCollapsed(false);
          localStorage.setItem("layout-collapse", JSON.stringify(false))
        }}
        className={cn(
          isCollapsed && "min-w-[50px] md:min-w-[70px] transition-all duration-300 ease-in-out"
        )}
      >
        <div className="flex flex-col w-full border-r">
          <div className="overflow-hidden border-b border-black flex items-center justify-between p-2 opacity-65 gap-10">
            <div className="flex items-center gap-2 ">
              <Menu className="h-6 w-6" />
              <h1 className="text-xl font-semibold">Conversations</h1>
            </div>
            <RotateCw
              className={`h-6 w-6 cursor-pointer ${fetchLoader ? "animate-spin animate-twice animate-ease-linear" : ""}`}
              onClick={() => {
                getAllMessages();
              }}
            />
          </div>

          <ChatList chats={chats} selectAChat={selectAChat} />
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
        {selectedChat ? <Chat chat={selectedChat} updateChat={updateChat} /> : <div className="flex h-full w-full items-center justify-center"><h2>Select a conversation to view</h2></div>}
      </ResizablePanel>
      {isMobile
        ? null
        : selectedChat
          ? <div className="max-w-100"><UserProfile chat={selectedChat} /> </div>
          : null
      }
    </ResizablePanelGroup>
  );

};
