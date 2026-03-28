import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../lib/axios';
import { AuthContext } from '../context/AuthContext';
import { Client } from '@stomp/stompjs';
import Modal from '../components/Modal';

const ProjectDetails = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [project, setProject] = useState(null);
    const [teamMessages, setTeamMessages] = useState([]);
    const [aiMessages, setAiMessages] = useState([]);
    const [activeTab, setActiveTab] = useState('TEAM');
    const [teamWidgetTab, setTeamWidgetTab] = useState('MEMBERS');
    const [teamRequests, setTeamRequests] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [stompClient, setStompClient] = useState(null);
    const [isRoadmapExpanded, setIsRoadmapExpanded] = useState(false);
    
    // New states for finalizing team
    const [isFinalizeModalOpen, setIsFinalizeModalOpen] = useState(false);
    const [githubUrl, setGithubUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAutoSyncing, setIsAutoSyncing] = useState(false);
    const [hasAutoSynced, setHasAutoSynced] = useState(false);
    
    const navigate = useNavigate();

    useEffect(() => {
        if (project && project.githubRepoUrl && (project.teamFinalized || project.isTeamFinalized) && !hasAutoSynced) {
            setHasAutoSynced(true);
            const performAutoSync = async () => {
                setIsAutoSyncing(true);
                try {
                    const res = await api.post(`/projects/${project.id}/auto-sync-progress`);
                    setProject(res.data);
                } catch (error) {
                    console.error("Auto sync failed:", error);
                } finally {
                    setIsAutoSyncing(false);
                }
            };
            performAutoSync();
        }
    }, [project?.githubRepoUrl, project?.teamFinalized, project?.isTeamFinalized, hasAutoSynced]);

    useEffect(() => {
        fetchProject();
        fetchMessages();
    }, [id]);

    const fetchMessages = async () => {
        try {
            const teamRes = await api.get(`/team-messages/${id}/TEAM`);
            setTeamMessages(teamRes.data);
            const aiRes = await api.get(`/team-messages/${id}/AI`);
            setAiMessages(aiRes.data);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    useEffect(() => {
        if (project) {
            fetchTeamRequests();
        }
    }, [project, id]);

    useEffect(() => {
        const client = new Client({
            brokerURL: 'ws://localhost:8080/project-websocket',
            reconnectDelay: 5000,
            onConnect: () => {
                client.subscribe(`/topic/chat/${id}/TEAM`, (msg) => {
                    const parsedMsg = JSON.parse(msg.body);
                    setTeamMessages(prev => [...prev, parsedMsg]);
                });
                client.subscribe(`/topic/chat/${id}/AI`, (msg) => {
                    const parsedMsg = JSON.parse(msg.body);
                    setAiMessages(prev => [...prev, parsedMsg]);
                });
            }
        });
        client.activate();
        setStompClient(client);

        return () => client.deactivate();
    }, [id]);

    const fetchProject = async () => {
        try {
            const res = await api.get('/projects');
            const found = res.data.find(p => p.id === parseInt(id));
            if (!found) {
                navigate('/dashboard');
                return;
            }

            if (found.createdBy.id === user.id) {
                setProject(found);
                return;
            }

            try {
                const reqRes = await api.get('/team-requests/user');
                const myReq = reqRes.data.find(r => r.project.id === found.id && r.status === 'ACCEPTED');
                if (myReq) {
                    setProject(found);
                } else {
                    alert('You do not have access to this project workspace.');
                    navigate('/dashboard');
                }
            } catch (err) {
                console.error('Access check failed', err);
                navigate('/dashboard');
            }
        } catch (error) { 
            console.error(error); 
            navigate('/dashboard');
        }
    };

    const fetchTeamRequests = async () => {
        try {
            const res = await api.get(`/team-requests/project/${id}`);
            setTeamRequests(res.data);
        } catch (error) {
            console.error("Error fetching team requests:", error);
        }
    };

    const handleRequestStatus = async (requestId, status) => {
        try {
            await api.patch(`/team-requests/${requestId}?status=${status}`);
            setTeamRequests(prev => prev.map(req => req.id === requestId ? { ...req, status } : req));
        } catch (error) {
            console.error("Error updating request status:", error);
            alert(error.response?.data?.message || 'Error updating status');
        }
    };

    const handleFinalizeClick = () => {
        setIsFinalizeModalOpen(true);
    };

    const submitFinalize = async () => {
        if (!githubUrl || !githubUrl.includes('github.com/')) {
            alert('Please enter a valid GitHub repository URL (must contain "github.com/").');
            return;
        }

        setIsSubmitting(true);
        try {
            await api.patch(`/projects/${id}/finalize`, { githubRepoUrl: githubUrl });
            setProject(prev => ({...prev, teamFinalized: true, isTeamFinalized: true, githubRepoUrl: githubUrl, status: 'IN_PROGRESS'}));
            alert('Team has been finalized and repository linked successfully!');
            setIsFinalizeModalOpen(false);
            setTeamWidgetTab('MEMBERS');
        } catch (error) {
            console.error("Error finalizing team:", error);
            alert(error.response?.data?.message || "Error finalizing team");
        } finally {
            setIsSubmitting(false);
        }
    };

    const sendMessage = () => {
        if (!newMessage.trim() || !stompClient) return;
        
        const messageObj = {
            senderId: user.id,
            senderName: user.name,
            content: newMessage,
            projectId: id
        };
        
        stompClient.publish({
            destination: `/app/chat/${id}/${activeTab}`,
            body: JSON.stringify(messageObj)
        });
        setNewMessage('');
    };

    if (!project) return <div className="text-white p-8">Loading project...</div>;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-gray-950 text-slate-900 dark:text-white p-4 sm:p-8 transition-colors duration-300">
            <div className="max-w-[1440px] mx-auto flex gap-8 flex-col lg:flex-row items-start">
                {/* Left side: Project Info & Roadmap */}
                <div className="flex-1 space-y-8">
                <div className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-xl border border-slate-200 dark:border-gray-800 shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] flex flex-col xl:flex-row gap-8 transition-colors">
                    {/* Left: Project Info */}
                    <div className="flex-1">
                        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">{project.title}</h1>
                        <p className="text-slate-600 dark:text-gray-400 mb-6 leading-relaxed">{project.description}</p>
                        <div className="flex flex-wrap gap-2">
                            {project.requiredSkills?.split(',').map((s, i) => (
                                <span key={i} className="px-3 py-1 bg-purple-50 dark:bg-purple-900/20 text-neon-purple dark:text-purple-400 rounded-full text-sm font-semibold border border-purple-100 dark:border-purple-800/50">{s.trim()}</span>
                            ))}
                        </div>
                        {project.createdBy?.id === user?.id && !(project.teamFinalized || project.isTeamFinalized) && (
                            <button onClick={handleFinalizeClick} className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-bold shadow-[0_4px_15px_rgba(16,185,129,0.3)] hover:opacity-90 mt-6 inline-block transition-all transform hover:-translate-y-0.5">
                                Finalize Team
                            </button>
                        )}
                        {(project.teamFinalized || project.isTeamFinalized) && (
                            <div className="flex items-center gap-3 mt-6 flex-wrap">
                                <span className="px-4 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 text-green-700 dark:text-green-400 rounded-lg font-bold inline-block shadow-sm">
                                    Team is Finalized
                                </span>
                                {project.githubRepoUrl && (
                                    <a href={project.githubRepoUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-white dark:bg-gray-800 border border-slate-300 dark:border-gray-700 text-electric-blue dark:text-sky-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-400 dark:hover:border-gray-500 hover:bg-slate-50 dark:hover:bg-gray-700 rounded-lg font-bold inline-block transition-all shadow-sm">
                                        View Repository
                                    </a>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right: Team Members & Requests Widget */}
                    <div className="w-full xl:w-[400px] border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl flex flex-col min-h-[200px] shadow-sm overflow-hidden shrink-0 transition-colors">
                        <div className="flex border-b border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-800/50">
                            <button 
                                onClick={() => setTeamWidgetTab('MEMBERS')}
                                className={`flex-1 py-3 text-sm font-bold transition-colors ${teamWidgetTab === 'MEMBERS' ? 'bg-white dark:bg-gray-900 border-b-2 border-electric-blue text-slate-900 dark:text-white' : 'text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-800'}`}
                            >
                                Team Members
                            </button>
                            {project.createdBy?.id === user?.id && !(project.teamFinalized || project.isTeamFinalized) && (
                                <button 
                                    onClick={() => setTeamWidgetTab('REQUESTS')}
                                    className={`flex-1 py-3 text-sm font-bold transition-colors flex items-center justify-center gap-2 ${teamWidgetTab === 'REQUESTS' ? 'bg-white dark:bg-gray-900 border-b-2 border-electric-blue text-slate-900 dark:text-white' : 'text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-800'}`}
                                >
                                    Requests
                                    {teamRequests.filter(req => req.status === 'PENDING').length > 0 && (
                                        <span className="bg-red-500 text-white rounded-full px-2 py-0.5 text-xs shadow-sm">
                                            {teamRequests.filter(req => req.status === 'PENDING').length}
                                        </span>
                                    )}
                                </button>
                            )}
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-slate-50/50 dark:bg-gray-900/50">
                            {teamWidgetTab === 'MEMBERS' ? (
                                <>
                                    <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-3 rounded-xl border border-slate-200 dark:border-gray-700 border-l-4 border-l-neon-purple shadow-sm transition-colors">
                                        <div className="flex items-center flex-wrap gap-2">
                                            <Link to={`/user/${project.createdBy.id}`} className="text-electric-blue hover:text-slate-900 dark:hover:text-white hover:underline transition-colors font-bold text-sm">
                                                {project.createdBy.name}
                                            </Link>
                                            <span className="text-[10px] text-neon-purple dark:text-purple-400 font-semibold border border-purple-100 dark:border-purple-800/50 bg-purple-50 dark:bg-purple-900/20 px-2 py-0.5 rounded truncate max-w-[180px]">Creator • {project.createdBy.skills}</span>
                                        </div>
                                    </div>
                                    {teamRequests.filter(req => req.status === 'ACCEPTED').map(req => (
                                        <div key={req.id} className="flex justify-between items-center bg-white dark:bg-gray-800 p-3 rounded-xl border border-slate-200 dark:border-gray-700 shadow-sm transition-colors">
                                            <div className="flex items-center flex-wrap gap-2">
                                                <Link to={`/user/${req.requester.id}`} className="text-electric-blue hover:text-slate-900 dark:hover:text-white hover:underline transition-colors font-bold text-sm">
                                                    {req.requester.name}
                                                </Link>
                                                <span className="text-[10px] font-semibold text-slate-500 dark:text-gray-400 border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900 px-2 py-0.5 rounded truncate max-w-[150px]">{req.requester.skills}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[11px] font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-md shrink-0">Member</span>
                                                {project.createdBy?.id === user?.id && !(project.teamFinalized || project.isTeamFinalized) && (
                                                    <button onClick={() => handleRequestStatus(req.id, 'REJECTED')} className="text-[10px] text-red-600 dark:text-red-400 hover:text-white font-bold bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-800/50 hover:bg-red-500 dark:hover:bg-red-600 px-2 py-1 rounded transition-colors">Remove</button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <>
                                    {teamRequests.filter(req => req.status === 'PENDING').length === 0 ? (
                                        <p className="text-slate-500 dark:text-gray-400 text-sm text-center mt-6 font-medium">No pending join requests.</p>
                                    ) : (
                                        teamRequests.filter(req => req.status === 'PENDING').map(req => (
                                            <div key={req.id} className="flex flex-col bg-white dark:bg-gray-800 p-3 rounded-xl border border-slate-200 dark:border-gray-700 shadow-sm gap-3 transition-colors">
                                                <div className="flex items-center flex-wrap gap-2">
                                                    <Link to={`/user/${req.requester.id}`} className="text-electric-blue hover:text-slate-900 dark:hover:text-white hover:underline transition-colors font-bold text-sm">
                                                        {req.requester.name}
                                                    </Link>
                                                    <span className="text-[10px] font-semibold text-slate-500 dark:text-gray-400 border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900 px-2 py-0.5 rounded truncate max-w-[120px]">{req.requester.skills}</span>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleRequestStatus(req.id, 'ACCEPTED')} className="flex-1 py-1.5 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800/50 rounded-lg hover:bg-green-600 hover:text-white hover:border-green-600 transition-colors text-xs font-bold">Accept</button>
                                                    <button onClick={() => handleRequestStatus(req.id, 'REJECTED')} className="flex-1 py-1.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/50 rounded-lg hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors text-xs font-bold">Reject</button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Project Progress Tracker */}
                {(project.teamFinalized || project.isTeamFinalized) && project.githubRepoUrl && (project.progressPercentage > 0 || project.aiProgressNotes || isAutoSyncing) && (
                    <div className="bg-white dark:bg-gray-900 p-8 rounded-xl border border-slate-200 dark:border-gray-800 shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            <h2 className="text-2xl font-bold text-electric-blue flex items-center gap-3">
                                AI Progress Tracker 
                                <span className="text-xs font-semibold text-slate-500 dark:text-gray-400 bg-slate-50 dark:bg-gray-800/50 px-3 py-1.5 rounded-full border border-slate-200 dark:border-gray-700 tracking-wide uppercase hidden sm:inline-block">Powered by GitHub Commits</span>
                            </h2>
                            {isAutoSyncing && (
                                <span className="text-xs font-medium text-slate-500 dark:text-gray-400 flex items-center gap-2 bg-slate-50 dark:bg-gray-800/50 px-3 py-1.5 rounded-full border border-slate-200 dark:border-gray-700 shrink-0">
                                    <span className="w-3.5 h-3.5 border-2 border-neon-purple border-t-transparent rounded-full animate-spin"></span> 
                                    Syncing API...
                                </span>
                            )}
                        </div>
                        
                        <div className="mb-8">
                            <div className="flex justify-between items-end mb-3">
                                <span className="text-sm font-semibold text-slate-500 dark:text-gray-400 tracking-wide uppercase">Overall Completion</span>
                                <span className="text-3xl font-bold text-neon-purple drop-shadow-sm">{project.progressPercentage || 0}%</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-gray-800 rounded-full h-4 border border-slate-200 dark:border-gray-700 overflow-hidden shadow-inner">
                                <div 
                                    className="bg-gradient-to-r from-electric-blue to-neon-purple h-full rounded-full transition-all duration-1000 relative shadow-sm" 
                                    style={{ width: `${project.progressPercentage || 0}%` }}
                                >
                                    <div className="absolute inset-0 bg-white/20 w-full animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                        
                        {project.aiProgressNotes && (
                            <div>
                                <h3 className="text-xs font-bold text-slate-500 dark:text-gray-400 mb-3 uppercase tracking-widest flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500 shadow-sm"></span> 
                                    Completed Features Map
                                </h3>
                                <div className="bg-slate-50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-700 rounded-lg p-5 shadow-sm">
                                    <div className="prose prose-slate max-w-none text-slate-600 dark:text-gray-300 text-sm whitespace-pre-line leading-relaxed font-medium">
                                        {project.aiProgressNotes}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div className="bg-white dark:bg-gray-900 p-8 rounded-xl border border-slate-200 dark:border-gray-800 shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-colors">
                    <h2 className="text-2xl font-bold mb-4 text-electric-blue">AI Technical Roadmap</h2>
                    <div className={`relative transition-all duration-300 ${!isRoadmapExpanded && project.aiRoadmap?.length > 400 ? 'max-h-64 overflow-hidden' : ''}`}>
                        <div className="prose prose-slate max-w-none text-slate-700 dark:text-gray-300 whitespace-pre-wrap bg-slate-50 dark:bg-gray-800/50 p-6 rounded-lg border border-slate-200 dark:border-gray-700 shadow-sm">
                            {project.aiRoadmap || "No roadmap generated."}
                        </div>
                        {!isRoadmapExpanded && project.aiRoadmap?.length > 400 && (
                            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-gray-900 to-transparent pointer-events-none rounded-b-lg border-b border-slate-200 dark:border-gray-800"></div>
                        )}
                    </div>
                    {project.aiRoadmap?.length > 400 && (
                        <div className="mt-4 flex justify-center">
                            <button 
                                onClick={() => setIsRoadmapExpanded(!isRoadmapExpanded)}
                                className="px-6 py-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-full text-electric-blue hover:bg-slate-50 dark:hover:bg-gray-700 transition-all text-sm font-bold shadow-sm focus:outline-none"
                            >
                                {isRoadmapExpanded ? '^ View Less' : 'v View Full Roadmap'}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Right side: Team Workspace / Chat */}
            <div className="w-full lg:w-[450px] lg:sticky lg:top-24 bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-gray-800 flex flex-col h-[750px] lg:h-[calc(100vh-8rem)] shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] shrink-0 transition-colors">
                <div className="flex border-b border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-800 rounded-t-xl overflow-hidden transition-colors">
                    <button 
                        onClick={() => setActiveTab('TEAM')}
                        className={`flex-1 py-4 text-center font-bold transition-colors ${activeTab === 'TEAM' ? 'bg-white dark:bg-gray-900 border-b-2 border-electric-blue text-slate-900 dark:text-white' : 'text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-800/50 hover:text-slate-800 dark:hover:text-gray-200'}`}
                    >
                        Team Chat
                    </button>
                    <button 
                        onClick={() => setActiveTab('AI')}
                        className={`flex-1 py-4 text-center font-bold transition-colors ${activeTab === 'AI' ? 'bg-white dark:bg-gray-900 border-b-2 border-electric-blue text-slate-900 dark:text-white' : 'text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-800/50 hover:text-slate-800 dark:hover:text-gray-200'}`}
                    >
                        Ask Mentor AI
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50/30 dark:bg-gray-900/50">
                    {(activeTab === 'TEAM' ? teamMessages : aiMessages).map((m, i) => (
                        <div key={i} className={`flex flex-col ${m.senderId === user?.id ? 'items-end' : 'items-start'}`}>
                            <span className="text-xs text-slate-500 dark:text-gray-400 mb-1 font-medium">{m.senderName}</span>
                            <div className={`p-3 max-w-[85%] rounded-2xl shadow-sm text-sm ${
                                m.senderId === -1 ? 'bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/50 text-purple-900 dark:text-purple-300' : 
                                m.senderId === user?.id ? 'bg-electric-blue text-white font-medium rounded-br-none' : 'bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-slate-700 dark:text-gray-300 rounded-bl-none'
                            }`}>
                                {m.content}
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="p-4 border-t border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-b-xl flex gap-3 transition-colors">
                    <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} 
                        onKeyPress={e => e.key === 'Enter' && sendMessage()}
                        className="flex-1 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:border-electric-blue focus:ring-1 focus:ring-electric-blue outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-gray-500" placeholder="Type a message..." />
                    <button onClick={sendMessage} className="bg-electric-blue text-white px-5 py-2.5 rounded-lg font-bold hover:bg-cyan-600 shadow-sm transition-all focus:outline-none transform hover:-translate-y-0.5">Send</button>
                </div>
                </div>
            </div>

            <Modal isOpen={isFinalizeModalOpen} onClose={() => !isSubmitting && setIsFinalizeModalOpen(false)} title="Finalize Team & Link Repository">
                <div className="space-y-4">
                    <p className="text-slate-600 dark:text-gray-300 text-sm">
                        Please provide the GitHub repository URL for this project. Once finalized, you will not be able to accept new members or remove current ones.
                    </p>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">GitHub Repository URL <span className="text-red-500">*</span></label>
                        <input 
                            type="url" 
                            placeholder="https://github.com/username/repo"
                            value={githubUrl}
                            onChange={(e) => setGithubUrl(e.target.value)}
                            className="w-full bg-white dark:bg-gray-800 border border-slate-300 dark:border-gray-600 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:border-electric-blue focus:ring-1 focus:ring-electric-blue outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-gray-500 shadow-sm"
                        />
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button 
                            onClick={() => setIsFinalizeModalOpen(false)}
                            className="px-4 py-2 text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors font-semibold"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={submitFinalize}
                            disabled={isSubmitting}
                            className={`px-6 py-2 bg-gradient-to-r from-neon-purple to-electric-blue text-white rounded-lg font-bold shadow-sm transition-all ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90 transform hover:-translate-y-0.5'}`}
                        >
                            {isSubmitting ? 'Finalizing...' : 'Finalize & Start'}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
export default ProjectDetails;
