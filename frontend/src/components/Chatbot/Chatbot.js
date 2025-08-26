import React, { useState, useEffect, useRef } from 'react';
import './Chatbot.css';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Hi there! How can I help you find a movie?' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleSendMessage = async () => {
        if (inputValue.trim() === '') return;

        const newMessages = [...messages, { sender: 'user', text: inputValue }];
        setMessages(newMessages);
        setInputValue('');
        setIsLoading(true);

        try {
            // Adjust this URL if your backend runs on a different port during development
            const response = await fetch('/api/chatbot/query', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ queryText: inputValue }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
                throw new Error(errorData.error || 'Bot API request failed');
            }

            const data = await response.json();

            // Construct bot response message
            let botResponseText = data.dialogflowResponse;
            if (data.movies && data.movies.length > 0) {
                const movieList = data.movies.map(movie =>
                    `<li><strong>${movie.title}</strong> (${movie.release_date ? movie.release_date.substring(0, 4) : 'N/A'})<br/><em>${movie.overview ? movie.overview.substring(0, 120) + '...' : 'No overview available.'}</em></li>`
                ).join('');
                botResponseText += `<ul>${movieList}</ul>`;
            }

            setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: botResponseText, isHtml: true }]);

        } catch (error) {
            console.error('Error sending message to bot:', error);
            setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: `Sorry, I encountered an error: ${error.message}` }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <>
            {!isOpen && (
                <div className="chat-icon" onClick={toggleChat} title="Chat with MovieBot">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                </div>
            )}

            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <span>Movie Bot</span>
                        <button onClick={toggleChat} className="close-chat-button" title="Close chat">&times;</button>
                    </div>
                    <div className="chat-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.sender}-message`}>
                                {msg.isHtml ? (
                                    <div dangerouslySetInnerHTML={{ __html: msg.text }} />
                                ) : (
                                    msg.text
                                )}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="chat-input-area">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask about movies..."
                            disabled={isLoading}
                        />
                        <button onClick={handleSendMessage} disabled={isLoading}>
                            {isLoading ? 'Sending...' : 'Send'}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Chatbot; 