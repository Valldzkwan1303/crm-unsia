import { MessageCircle } from 'lucide-react';

interface ChatWidgetProps {
  mode?: string;
  userName?: string;
}

const ChatWidget = (_props: ChatWidgetProps) => {
  const openWA = () => {
    window.open('https://wa.me/628123456789', '_blank');
  };

  return (
    <button
      onClick={openWA}
      className="fixed bottom-8 right-8 p-4 bg-white/90 backdrop-blur-md text-emerald-600 border border-emerald-100 rounded-[1.5rem] shadow-xl shadow-emerald-900/10 hover:bg-[#25D366] hover:border-[#25D366] hover:text-white hover:scale-110 active:scale-90 transition-all duration-500 z-[999] group flex items-center gap-0"
      title="Hubungi Admin"
    >
      <MessageCircle size={28} />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 group-hover:mr-1 transition-all duration-500 font-bold text-sm whitespace-nowrap">
        Tanya UNSIA
      </span>
    </button>
  );
};

export default ChatWidget;