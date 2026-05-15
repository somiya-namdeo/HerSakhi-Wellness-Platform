import { Bot, MessageCircle } from 'lucide-react';

const ChatbotPreview = () => {
  return (
    <section className="py-20 px-6 lg:px-12 bg-background">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-dark mb-4">
          Your <span className="text-primary">AI wellness companion</span>
        </h2>
        <p className="text-lg text-gray-600 mb-16">Get instant, compassionate support anytime</p>

        <div className="bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-[2rem] shadow-card border border-white max-w-2xl mx-auto">
          <div className="space-y-6">
            
            {/* User Message */}
            <div className="flex gap-4 items-start">
              <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-primary">
                <MessageCircle size={20} />
              </div>
              <div className="bg-white p-4 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100 text-left w-full text-gray-700">
                Why am I having cramps?
              </div>
            </div>

            {/* AI Response */}
            <div className="flex gap-4 items-start flex-row-reverse">
              <div className="bg-primary w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white">
                <Bot size={20} />
              </div>
              <div className="bg-gradient-to-r from-primary to-softPink p-4 rounded-2xl rounded-tr-sm shadow-soft text-left w-full text-white">
                Cramps are often caused by uterine contractions. Try gentle heat therapy, stay hydrated, and consider light stretching. Would you like personalized recommendations?
              </div>
            </div>

            {/* User Message */}
            <div className="flex gap-4 items-start">
              <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-primary">
                <MessageCircle size={20} />
              </div>
              <div className="bg-white p-4 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100 text-left w-full text-gray-700">
                How can I reduce stress during periods?
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default ChatbotPreview;
