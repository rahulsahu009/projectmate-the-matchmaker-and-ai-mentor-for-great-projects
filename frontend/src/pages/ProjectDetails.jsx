import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import { Code2, Send, MessageSquare } from 'lucide-react';
import api from '../services/api';

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Chat state
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const stompClient = useRef(null);
  const scrollRef = useRef(null);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await api.get(`/projects/${id}`);
        setProject(response.data);
      } catch (error) {
        console.error("Error fetching project", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();

    // Connect WebSocket
    const client = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("Connected to STOMP");
        client.subscribe(`/topic/project/${id}`, (message) => {
          if (message.body) {
            const newMsg = JSON.parse(message.body);
            setMessages((prev) => [...prev, newMsg]);
          }
        });
      },
      onStompError: (frame) => {
        console.error('STOMP error', frame.headers['message']);
      }
    });

    client.activate();
    stompClient.current = client;

    return () => {
      client.deactivate();
    };
  }, [id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !user.id || !stompClient.current || !stompClient.current.connected) return;

    const chatMsg = {
      senderId: user.id,
      projectId: parseInt(id),
      content: inputValue,
    };

    stompClient.current.publish({
      destination: '/app/chat.sendMessage',
      body: JSON.stringify(chatMsg),
    });

    setInputValue('');
  };

  const Skeleton = () => (
    <div className="flex flex-col lg:flex-row gap-8 w-full animate-pulse mt-8">
      <div className="w-full lg:w-2/3 p-8 rounded-3xl bg-gray-200/50 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-800/50">
        <div className="h-12 bg-gray-300 dark:bg-gray-700 w-1/3 rounded-xl mb-6"></div>
        <div className="h-6 bg-gray-300 dark:bg-gray-700 w-1/4 rounded-lg mb-10"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 w-full rounded-md mb-4"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 w-full rounded-md mb-4"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 w-5/6 rounded-md mb-10"></div>
        <div className="h-10 bg-gray-300 dark:bg-gray-700 w-1/4 rounded-xl"></div>
      </div>
      <div className="w-full lg:w-1/3 h-[600px] rounded-3xl bg-gray-200/50 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-800/50"></div>
    </div>
  );

  if (loading) {
    return <div className="container mx-auto px-4 py-8 max-w-7xl"><Skeleton /></div>;
  }

  if (!project) {
    return <div className="flex items-center justify-center min-h-[60vh] text-center py-20 text-gray-500 text-2xl font-bold">Project not found or server is down.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl flex flex-col lg:flex-row gap-8 items-start">
      
      {/* Project Details Panel */}
      <div className="w-full lg:w-2/3 p-8 rounded-3xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-800/50 shadow-2xl transition-all duration-300 hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)]">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight drop-shadow-sm">{project.title}</h1>
        
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <span className={`px-4 py-1.5 text-xs font-black rounded-lg uppercase tracking-wider shadow-sm ${project.status === 'OPEN' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 border border-green-200 dark:border-green-800/50' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800/50'}`}>
            {project.status}
          </span>
          <span className="text-gray-500 dark:text-gray-400 text-sm font-semibold border-l-2 border-gray-300 dark:border-gray-700 pl-3">
             Project ID: {id}
          </span>
          <span className="text-gray-500 dark:text-gray-400 text-sm font-semibold border-l-2 border-gray-300 dark:border-gray-700 pl-3">
             Creator: <span className="text-gray-700 dark:text-gray-300 font-bold">{project.creator?.name || 'Unknown'}</span>
          </span>
        </div>

        <div className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-10 bg-white/40 dark:bg-gray-800/40 p-6 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-inner">
          {project.description}
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">Required Expertise</h3>
          <div className="flex flex-wrap gap-2.5">
            {project.requiredSkills?.split(',').map((skill, index) => (
              <span key={index} className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-bold border border-indigo-100 dark:border-indigo-800/50 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md cursor-default">
                <Code2 className="h-4 w-4 opacity-70" />
                <span>{skill.trim()}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Real-time Collaboration Panel */}
      <div className="w-full lg:w-1/3 flex flex-col h-[650px] rounded-3xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-800/50 shadow-2xl overflow-hidden sticky top-24 transition-all">
        <div className="p-5 border-b border-gray-200/50 dark:border-gray-800/50 bg-white/40 dark:bg-gray-800/40 flex items-center space-x-3 shadow-sm z-10">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
            <MessageSquare className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">Project Room</h3>
            <p className="text-xs text-green-600 dark:text-green-400 font-semibold flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse"></span>Live
            </p>
          </div>
        </div>
        
        <div 
          ref={scrollRef} 
          className="flex-1 overflow-y-auto p-5 space-y-5 scroll-smooth bg-gray-50/30 dark:bg-gray-900/20"
        >
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 font-medium text-sm text-center px-4 space-y-2">
              <MessageSquare className="h-10 w-10 opacity-20" />
              <p>Be the first to say hello!<br/> Chat is live and connected.</p>
            </div>
          ) : (
            messages.map((msg, index) => {
              const isMe = msg.senderId === user.id;
              return (
                <div key={index} className={`flex flex-col animate-[fadeIn_0.3s_ease-out] ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className={`px-4 py-3 rounded-2xl max-w-[85%] ${isMe ? 'bg-indigo-600 text-white rounded-br-none shadow-lg shadow-indigo-600/20' : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none shadow-lg border border-gray-100 dark:border-gray-700/50'}`}>
                    <p className="text-[15px] leading-relaxed break-words">{msg.content}</p>
                  </div>
                  <span className="text-xs font-semibold text-gray-400 mt-1.5 px-2">Member {msg.senderId}</span>
                </div>
              );
            })
          )}
        </div>

        <form onSubmit={sendMessage} className="p-4 bg-white/60 dark:bg-gray-800/60 border-t border-gray-200/50 dark:border-gray-800/50 flex space-x-2 z-10 backdrop-blur-md">
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={!user.id}
            placeholder={user.id ? "Type your message..." : "Login to chat..."}
            className="flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-inner rounded-xl px-4 py-3 text-[15px] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white transition-all disabled:opacity-50"
          />
          <button 
            type="submit" 
            disabled={!inputValue.trim() || !user.id}
            className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:bg-indigo-400 dark:disabled:bg-indigo-900/50 transition-all hover:-translate-y-1 hover:shadow-lg shadow-indigo-600/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 flex items-center justify-center cursor-pointer"
          >
            <Send className="h-5 w-5 ml-0.5" />
          </button>
        </form>
      </div>

    </div>
  );
}
