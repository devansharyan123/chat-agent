import { ChatWindow } from "@/components/chat/ChatWindow";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="w-full max-w-3xl h-dvh sm:h-[90dvh] sm:my-4 sm:px-4">
        <ChatWindow />
      </div>
    </div>
  );
}
