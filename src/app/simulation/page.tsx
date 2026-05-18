"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { 
  Shield, 
  Users, 
  Terminal, 
  Award, 
  ArrowRight, 
  Send, 
  Sparkles, 
  RefreshCw, 
  Activity, 
  TrendingUp, 
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  CornerDownLeft,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

// Interfaces
interface BoardMember {
  id: string;
  name: string;
  role: string;
  avatarText: string;
  bio: string;
  personaDescription: string;
  accentColor: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  name?: string;
  content: string;
}

interface RiskDiagnostic {
  type: "financial" | "technical" | "compliance";
  risk: string;
  severity: "high" | "medium" | "low";
  suggestion: string;
}

interface EvaluationData {
  generalApproval: number;
  boardMemberRatings: Record<string, number>;
  risks: RiskDiagnostic[];
  strategicTip: string;
}

export default function RehearsalWarRoom() {
  const router = useRouter();
  
  // Local Session States
  const [proposalTitle, setProposalTitle] = useState("");
  const [proposalDesc, setProposalDesc] = useState("");
  const [boardMembers, setBoardMembers] = useState<BoardMember[]>([]);
  const [rigorLevel, setRigorLevel] = useState("standard");

  // Core Simulation States
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeMemberId, setActiveMemberId] = useState("");
  const [userResponse, setUserResponse] = useState("");
  const [isSimulating, setIsSimulating] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Live Strategic Assessment States
  const [generalApproval, setGeneralApproval] = useState(50);
  const [memberApprovals, setMemberApprovals] = useState<Record<string, number>>({});
  const [risks, setRisks] = useState<RiskDiagnostic[]>([]);
  const [strategicTip, setStrategicTip] = useState("");

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize page from sessionStorage
  useEffect(() => {
    const title = sessionStorage.getItem("foxhole_proposal_title");
    const desc = sessionStorage.getItem("foxhole_proposal_desc");
    const membersRaw = sessionStorage.getItem("foxhole_board_members");
    const rigor = sessionStorage.getItem("foxhole_rigor_level") || "standard";

    if (!title || !desc || !membersRaw) {
      // Redirect back to setup if no active session
      router.push("/setup");
      return;
    }

    const members: BoardMember[] = JSON.parse(membersRaw);
    setProposalTitle(title);
    setProposalDesc(desc);
    setBoardMembers(members);
    setRigorLevel(rigor);

    // Default first board speaker
    if (members.length > 0) {
      setActiveMemberId(members[0].id);
      
      // Initialize first ratings
      const initRatings: Record<string, number> = {};
      members.forEach(m => {
        initRatings[m.id] = 50;
      });
      setMemberApprovals(initRatings);

      // Generate a welcoming dialogue from the lead director
      const welcomeName = members[0].name;
      const welcomeRole = members[0].role;
      const initialGreeting = `Welcome to the boardroom. We have received your proposal: "${title}". I am ${welcomeName}, ${welcomeRole}. To start our rehearsal, please summarize the primary strategic risk you anticipate during this roll-out, and how your team is actively addressing it.`;
      
      setMessages([
        {
          role: "assistant",
          name: welcomeName,
          content: initialGreeting
        }
      ]);
    }
  }, [router]);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSimulating]);

  const activeMember = boardMembers.find(m => m.id === activeMemberId);

  // Live Strategic Assessment Trigger
  const triggerAssessment = async (currentMessages: ChatMessage[]) => {
    setIsEvaluating(true);
    try {
      const response = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proposalTitle,
          proposalDesc,
          boardMembers,
          messages: currentMessages,
          rigorLevel
        })
      });

      if (!response.ok) throw new Error("Evaluation call failed");
      const data: EvaluationData = await response.json();
      
      // Update assessment states smoothly
      setGeneralApproval(data.generalApproval);
      setMemberApprovals(data.boardMemberRatings);
      setRisks(data.risks || []);
      setStrategicTip(data.strategicTip || "");
    } catch (e) {
      console.error("Evaluation feedback error:", e);
    } finally {
      setIsEvaluating(false);
    }
  };

  // Submit User Message & trigger AI dialog
  const handleSubmitMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userResponse.trim() || isSimulating || !activeMember) return;

    const userText = userResponse;
    setUserResponse("");

    const newMessages: ChatMessage[] = [
      ...messages,
      {
        role: "user",
        content: userText
      }
    ];
    setMessages(newMessages);
    setIsSimulating(true);

    try {
      // Append placeholders for streaming dialog
      const streamMessageIndex = newMessages.length;
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          name: activeMember.name,
          content: ""
        }
      ]);

      const response = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proposalTitle,
          proposalDesc,
          currentMember: activeMember,
          messages: newMessages,
          rigorLevel
        })
      });

      if (!response.ok) throw new Error("Failed to stream simulated boardroom question");
      
      // Read raw text stream from toTextStreamResponse()
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let streamedContent = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const textChunk = decoder.decode(value, { stream: true });
          streamedContent += textChunk;

          // Update state in real-time
          setMessages(prev => {
            const updated = [...prev];
            updated[streamMessageIndex] = {
              role: "assistant",
              name: activeMember.name,
              content: streamedContent
            };
            return updated;
          });
        }
      }

      // Simulation speaker finishes, execute assessment analysis
      const finalHistory: ChatMessage[] = [
        ...newMessages,
        {
          role: "assistant",
          name: activeMember.name,
          content: streamedContent
        }
      ];
      await triggerAssessment(finalHistory);

    } catch (err: any) {
      console.error(err);
      // Remove temporary spinner / fallback response
      setMessages(prev => {
        const copy = [...prev];
        copy.pop();
        return [
          ...copy,
          {
            role: "assistant",
            name: activeMember.name,
            content: `Apologies, I encountered an issue. Can you repeat that point regarding cost allocations?`
          }
        ];
      });
    } finally {
      setIsSimulating(false);
    }
  };

  // Complete Simulation & hand over to Debrief
  const handleFinishSimulation = () => {
    // Pack all history and latest scores to sessionStorage for final debrief report
    sessionStorage.setItem("foxhole_debrief_score", generalApproval.toString());
    sessionStorage.setItem("foxhole_debrief_member_ratings", JSON.stringify(memberApprovals));
    sessionStorage.setItem("foxhole_debrief_risks", JSON.stringify(risks));
    sessionStorage.setItem("foxhole_debrief_tip", strategicTip);
    sessionStorage.setItem("foxhole_debrief_chat", JSON.stringify(messages));

    router.push("/debrief");
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-6">
      
      {/* LEFT SIDE: Room Dialogue Chat Panel */}
      <div className="flex-1 flex flex-col gap-4 h-[calc(100vh-12rem)] min-h-[500px]">
        {/* Board Speaker Selector tab header */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl glass-panel border-white/[0.06] bg-[#0c142c]/40 shrink-0">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest leading-none">Simulation Room</span>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">{proposalTitle || "Boardroom Rehearsal"}</h2>
          </div>
          
          {/* Active Speaker Switcher buttons */}
          <div className="flex gap-2">
            {boardMembers.map((member) => {
              const isActive = activeMemberId === member.id;
              const approval = memberApprovals[member.id] || 50;
              return (
                <button
                  key={member.id}
                  onClick={() => !isSimulating && setActiveMemberId(member.id)}
                  disabled={isSimulating}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all duration-200 text-left ${
                    isActive
                      ? "border-blue-500 bg-blue-500/10 text-white shadow-lg shadow-blue-500/5 scale-105"
                      : "border-white/5 bg-[#030612]/30 text-slate-400 hover:text-slate-200"
                  } ${isSimulating ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                  <Avatar className="h-6 w-6 border border-white/10">
                    <AvatarFallback className="bg-slate-900 text-white font-bold text-[10px]">
                      {member.avatarText}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-extrabold leading-none">{member.name.split(" ")[0]}</span>
                    <span className={`text-[8px] font-bold ${
                      approval >= 70 ? "text-emerald-400" : approval <= 40 ? "text-rose-400" : "text-amber-400"
                    }`}>
                      {approval}% Appr.
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Active Chat dialogue block */}
        <Card className="glass-panel border-white/[0.06] bg-[#050917]/70 flex-1 flex flex-col overflow-hidden relative">
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((msg, index) => {
                const isUser = msg.role === "user";
                const memberProfile = boardMembers.find(m => m.name === msg.name);
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex gap-3 max-w-[85%] ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}
                  >
                    {!isUser && (
                      <Avatar className="h-9 w-9 border border-white/10 shrink-0 mt-0.5">
                        <AvatarFallback className="bg-slate-900 text-white font-bold text-xs">
                          {memberProfile?.avatarText || "BM"}
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div className="flex flex-col gap-1">
                      {!isUser && (
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-400 ml-1">
                          {msg.name} ({memberProfile?.role.split(" ")[0]})
                        </span>
                      )}
                      <div className={`p-4 rounded-2xl text-sm leading-relaxed border ${
                        isUser
                          ? "bg-blue-600/10 border-blue-500/25 text-slate-100 rounded-tr-none"
                          : "bg-[#0c142c]/50 border-white/[0.05] text-slate-200 rounded-tl-none"
                      }`}>
                        {msg.content === "" ? (
                          <div className="flex items-center gap-1.5 py-1">
                            <span className="h-2 w-2 rounded-full bg-blue-400 animate-bounce" />
                            <span className="h-2 w-2 rounded-full bg-blue-400 animate-bounce [animation-delay:0.2s]" />
                            <span className="h-2 w-2 rounded-full bg-blue-400 animate-bounce [animation-delay:0.4s]" />
                          </div>
                        ) : (
                          msg.content
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            <div ref={chatEndRef} />
          </div>

          {/* Prompt Entry Form footer */}
          <div className="p-4 border-t border-white/5 bg-[#030612]/70 shrink-0">
            <form onSubmit={handleSubmitMessage} className="relative flex items-end gap-2">
              <Textarea
                rows={2}
                disabled={isSimulating}
                value={userResponse}
                onChange={(e) => setUserResponse(e.target.value)}
                placeholder={
                  isSimulating 
                    ? "Board member is speaking..." 
                    : `Speak to ${activeMember?.name || "the board"}... Press Enter to send.`
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmitMessage(e);
                  }
                }}
                className="bg-[#040816] border-white/10 hover:border-white/20 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white rounded-xl resize-none py-3 text-xs sm:text-sm pr-12 min-h-[56px] transition-all duration-200 scrollbar-none"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!userResponse.trim() || isSimulating}
                className="absolute right-2.5 bottom-2.5 h-8 w-8 bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-lg border-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
            <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium px-1 mt-2">
              <span>PII and metadata safe. Lobster Trap proxy active on Port 8080.</span>
              <span>Rigor: <strong className="text-blue-400 capitalize">{rigorLevel}</strong></span>
            </div>
          </div>
        </Card>
      </div>

      {/* RIGHT SIDE: Strategic Assessment Panel */}
      <div className="w-full lg:w-96 flex flex-col gap-4 h-[calc(100vh-12rem)] min-h-[500px] shrink-0">
        
        {/* General Approval Rating Progress Gauge */}
        <Card className="glass-panel border-white/[0.06] bg-[#0c142c]/40 shrink-0">
          <CardContent className="p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Board Approval Rating</span>
              {isEvaluating && <Activity className="h-4 w-4 text-blue-400 animate-pulse" />}
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-4xl font-black bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent leading-none">
                {generalApproval}%
              </span>
              <div className="flex-1 space-y-1">
                <Progress 
                  value={generalApproval} 
                  className={`h-2.5 rounded-full ${
                    generalApproval >= 70 ? "bg-emerald-500/10" : generalApproval <= 40 ? "bg-rose-500/10" : "bg-blue-500/10"
                  }`} 
                />
                <span className="text-[9px] text-slate-400 flex items-center gap-1 font-mono">
                  <TrendingUp className="h-3 w-3 text-blue-400" />
                  {generalApproval >= 70 ? "BOARD ALIGNMENT REACHED" : "DILIGENCE REVIEW PENDING"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dynamic Board Avatar Status cards list */}
        <div className="flex-1 overflow-y-auto space-y-3 p-1">
          {boardMembers.map((member) => {
            const approval = memberApprovals[member.id] || 50;
            return (
              <Card 
                key={member.id}
                className={`glass-panel border-white/[0.05] bg-[#050917]/70 transition-all duration-300 overflow-hidden ${
                  activeMemberId === member.id ? "border-blue-500/40 shadow-md shadow-blue-500/5 bg-[#0a112c]/40" : ""
                }`}
              >
                <CardContent className="p-4 flex gap-3.5">
                  <Avatar className="h-9 w-9 border border-white/10 shrink-0 mt-0.5">
                    <AvatarFallback className="bg-slate-900 text-white font-bold text-xs">
                      {member.avatarText}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-extrabold text-slate-100">{member.name}</h4>
                        <p className="text-[9px] text-slate-400 font-semibold">{member.role}</p>
                      </div>
                      <span className={`text-xs font-black ${
                        approval >= 70 ? "text-emerald-400" : approval <= 40 ? "text-rose-400" : "text-amber-400"
                      }`}>
                        {approval}%
                      </span>
                    </div>
                    <Progress 
                      value={approval} 
                      className={`h-1.5 ${
                        approval >= 70 ? "bg-emerald-500/10" : approval <= 40 ? "bg-rose-500/10" : "bg-blue-500/10"
                      }`} 
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Real-time Vulnerabilities / Risks diagnostics feed */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block px-1">Risk Vulnerabilities Feed ({risks.length})</span>
            
            {risks.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-6 rounded-xl border border-white/5 bg-[#030612]/30 text-center">
                <CheckCircle className="h-6 w-6 text-slate-600 mb-1" />
                <p className="text-[10px] text-slate-500">No high-level vulnerabilities logged yet.</p>
                <p className="text-[8px] text-slate-600">Complete the initial dialog turn to run strategic evaluations.</p>
              </div>
            ) : (
              risks.map((risk, idx) => (
                <div 
                  key={idx} 
                  className={`p-3.5 rounded-xl border flex flex-col gap-2 ${
                    risk.severity === "high" 
                      ? "border-rose-500/20 bg-rose-500/5 text-rose-300" 
                      : risk.severity === "medium"
                      ? "border-amber-500/20 bg-amber-500/5 text-amber-300"
                      : "border-blue-500/20 bg-blue-500/5 text-blue-300"
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="uppercase tracking-wider flex items-center gap-1.5">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      {risk.type} RISK
                    </span>
                    <Badge variant="outline" className={`text-[8px] uppercase tracking-widest ${
                      risk.severity === "high" ? "border-rose-500/30 text-rose-400 bg-rose-500/10" : "border-amber-500/30 text-amber-400 bg-amber-500/10"
                    }`}>
                      {risk.severity}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">{risk.risk}</p>
                  <div className="text-[10px] text-slate-400 flex items-start gap-1 p-2 bg-black/40 rounded-lg border border-white/5 font-mono leading-relaxed">
                    <Lightbulb className="h-3.5 w-3.5 text-blue-400 shrink-0 mt-0.5" />
                    <span><strong>Fix suggestion:</strong> {risk.suggestion}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* High-level Tactical tip */}
          {strategicTip && (
            <Card className="glass-panel border-purple-500/20 bg-purple-500/5 shrink-0 overflow-hidden relative">
              <CardContent className="p-4 flex gap-2.5">
                <Lightbulb className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
                <div className="flex-1 space-y-1">
                  <span className="text-[9px] font-bold text-purple-400 uppercase tracking-widest">Fiduciary Tactical Tip</span>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">{strategicTip}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Rehearsal complete bottom action CTA */}
        <Button
          onClick={handleFinishSimulation}
          className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold tracking-wide shadow-lg shadow-blue-500/20 border-0 active:scale-95 transition-all duration-200 shrink-0"
        >
          Finish Rehearsal & Analyze Debrief <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

    </div>
  );
}
