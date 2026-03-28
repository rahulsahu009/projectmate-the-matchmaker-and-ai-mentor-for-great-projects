import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import { Code2, Send, MessageSquare, Github, GitCommit, Link as LinkIcon, ArrowRight } from 'lucide-react';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [githubActivity, setGithubActivity] = useState([]);
  const [githubLoading, setGithubLoading] = useState(false);
  
  // Chat state
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const stompClient = useRef(null);
  const scrollRef = useRef(null);

  const { user: authUser } = useAuth();
  const user = authUser || {};

  useEffect(() => {
    const fetchGithubActivity = async (projectId) => {
      setGithubLoading(true);
      try {
        const gRes = await api.get(`/projects/${projectId}/github/commits`);
        setGithubActivity(gRes.data);
      } catch (e) {
        console.error('Failed to load GitHub activity natively', e);
      } finally {
        setGithubLoading(false);
      }
    };

    const fetchProject = async () => {
      try {
        const response = await api.get(`/projects/${id}`);
        setProject(response.data);
        if (response.data.githubRepoUrl) {
          fetchGithubActivity(response.data.id);
        }
      } catch (error) {
        console.error("Error fetching project metadata", error);
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

        {/* Recent GitHub Activity Widget */}
        {project.githubRepoUrl && (
          <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 dark:border-gray-800/50 shadow-2xl relative group transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none" />
            <div className="relative z-10 w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center shadow-inner">
                    <Github className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent leading-tight tracking-tight">System Timeline</h2>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Track repository events seamlessly</p>
                  </div>
                </div>
                <a href={project.githubRepoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center space-x-2 text-sm text-indigo-500 font-bold px-5 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 transition-all hover:-translate-y-0.5 whitespace-nowrap shadow-sm">
                  <LinkIcon className="h-4 w-4" />
                  <span>View Source</span>
                </a>
              </div>

              <div className="space-y-6 pt-2">
                {githubLoading ? (
                  <div className="animate-pulse space-y-5 pt-4 border-l-2 border-indigo-500/20 ml-2 pl-6">
                    <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded-md w-3/4 shadow-inner"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-md w-1/2 shadow-inner"></div>
                  </div>
                ) : githubActivity && githubActivity.length > 0 ? (
                  githubActivity.map((event, idx) => (
                    <div key={idx} className="relative pl-8 before:absolute before:inset-y-0 before:left-[11px] before:w-0.5 before:bg-gradient-to-b before:from-indigo-500/50 before:to-transparent last:before:hidden py-3 group/commit">
                      <div className="absolute left-0 top-5 h-6 w-6 rounded-full border-2 border-indigo-500 bg-white dark:bg-gray-950 flex items-center justify-center shadow-[0_0_10px_rgba(99,102,241,0.5)] z-10 transition-transform group-hover/commit:scale-125 duration-300">
                        <GitCommit className="h-3 w-3 text-indigo-500" />
                      </div>
                      <div className="bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 backdrop-blur-sm transition-all hover:bg-white dark:hover:bg-gray-800 shadow-sm hover:shadow-md hover:border-indigo-500/30">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center space-y-2 sm:space-y-0 mb-3">
                          <span className="font-bold text-gray-900 dark:text-gray-100 flex items-center text-lg drop-shadow-sm">
                            {event.commit?.author?.name || 'Unknown Author'}
                          </span>
                          <span className="text-xs font-mono font-semibold text-gray-500 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-lg shadow-sm">
                            {new Date(event.commit?.author?.date || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-4 font-medium leading-relaxed">{event.commit?.message}</p>
                        <a href={event.html_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-bold text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors group/link cursor-pointer">
                          View API Extract <ArrowRight className="h-3.5 w-3.5 ml-1.5 transition-transform group-hover/link:translate-x-1" />
                        </a>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 my-4 shadow-inner mt-4">
                    <p className="text-gray-500 dark:text-gray-400 font-medium">No recent commits established natively within tracking perimeter.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
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
