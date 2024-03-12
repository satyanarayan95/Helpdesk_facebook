
import { ChatLayout } from "@/components/chat/Chat-layout";

export const ChatWindow = () => {
    const layout = localStorage.getItem("layout-size");
    const defaultLayout = layout ? JSON.parse(layout) : '';

    return (
        <main className="flex h-[calc(100dvh)] w-screen">
            <div className="z-10 border rounded-lg  w-full h-full text-sm lg:flex">
                <ChatLayout defaultLayout={defaultLayout} navCollapsedSize={10} />
            </div>
        </main>
    );
}
