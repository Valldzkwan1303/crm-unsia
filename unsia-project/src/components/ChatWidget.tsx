import { MessageCircle } from 'lucide-react';

const ChatWidget = () => {
  const openWA = () => {
    window.open('https://wa.me/628123456789', '_blank');
  };

  return (
    <button
      onClick={openWA}
      className="fixed bottom-8 right-8 p-4 bg-[#25D366] text-white rounded-[1.5rem] shadow-2xl hover:scale-110 active:scale-90 transition-all z-[999] group"
      title="Hubungi Admin"
    >
      <MessageCircle size={28} />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-500 font-bold text-sm whitespace-nowrap">
        Tanya UNSIA
      </span>
    </button>
  );
};

export default ChatWidget;