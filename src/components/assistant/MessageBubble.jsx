import { Bot } from 'lucide-react'
import { motion } from 'framer-motion'

const MessageBubble = ({ message }) => {
  const isAI = message.sender === 'ai'

  const renderTextWithBold = (rawText) => {
    if (rawText === undefined || rawText === null) return '';
    const textStr = String(rawText);
    const parts = textStr.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="font-bold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  const formatMessageText = (text) => {
    if (!text) return null;
    
    const lines = text.split('\n');
    let inList = false;
    const elements = [];
    let currentListItems = [];

    const flushList = (key) => {
      if (currentListItems.length > 0) {
        elements.push(
          <ul key={`ul-${key}`} className="list-disc pl-5 my-1.5 space-y-1">
            {currentListItems}
          </ul>
        );
        currentListItems = [];
      }
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      const bulletMatch = trimmed.match(/^[-*•]\s+(.*)$/);

      if (bulletMatch) {
        inList = true;
        const content = bulletMatch[1];
        currentListItems.push(
          <li key={`li-${index}`} className="text-sm">
            {renderTextWithBold(content)}
          </li>
        );
      } else {
        if (inList) {
          flushList(index);
          inList = false;
        }
        if (trimmed === '') {
          elements.push(<div key={`br-${index}`} className="h-2" />);
        } else {
          elements.push(
            <p key={`p-${index}`} className="text-sm leading-relaxed mb-1">
              {renderTextWithBold(line)}
            </p>
          );
        }
      }
    });

    if (inList) {
      flushList(lines.length);
    }

    return <div className="space-y-0.5">{elements}</div>;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-4 ${isAI ? '' : 'flex-row-reverse'} mb-6`}
    >
      {isAI && (
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <Bot size={20} />
        </div>
      )}
      
      <div className={`flex flex-col ${isAI ? 'items-start' : 'items-end'} max-w-[80%]`}>
        <div 
          className={`px-5 py-3.5 text-sm ${
            isAI 
              ? 'bg-background text-gray-700 rounded-2xl rounded-tl-sm border border-primary/5' 
              : 'bg-primary text-white rounded-2xl rounded-tr-sm shadow-md shadow-primary/20'
          }`}
        >
          {formatMessageText(message.text)}
        </div>
        <span className="text-[10px] text-gray-400 font-medium mt-1 mx-1">
          {message.timestamp}
        </span>
      </div>
    </motion.div>
  )
}

export default MessageBubble
