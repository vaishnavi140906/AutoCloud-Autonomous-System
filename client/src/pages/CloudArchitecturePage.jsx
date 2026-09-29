import React from 'react';
import {
  Cloud,
  Database,
  Server,
  Cpu,
  Radio,
  ShieldCheck,
  Layers,
  ArrowRight,
  ArrowDown,
  Globe,
  Bot,
  Zap,
  Activity,
  CheckCircle2,
} from 'lucide-react';

const CloudArchitecturePage = () => {
  return (
    <div className="space-y-10 pb-16 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-mono mb-3">
          <Layers className="w-3.5 h-3.5" /> SYSTEM DESIGN & SPECIFICATION
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          AutoCloud Platform Architecture
        </h1>
        <p className="text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
          Detailed technical blueprint demonstrating how modern cloud computing architectures support autonomous multi-agent robotics fleets through decoupled ingestion, managed databases, and event-driven alerting.
        </p>
      </div>

      {/* Visual End-to-End Architectural Diagram */}
      <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl">
        <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-400 font-mono mb-6 text-center">
          HIGH-LEVEL DATA FLOW TOPOLOGY
        </h3>

        {/* Diagram Flow */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Node 1 */}
          <div className="flex-1 w-full p-5 rounded-2xl bg-slate-900 border border-cyan-500/30 text-center space-y-2 shadow-glow-cyan/10">
            <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 w-fit mx-auto">
              <Bot className="w-6 h-6" />
            </div>
            <div className="font-bold text-white text-sm">Autonomous Nodes</div>
            <div className="text-[11px] text-slate-400">
              Robots, Drones, AGVs (Simulated Telemetry Sensors)
            </div>
          </div>

          <div className="text-cyan-400 font-mono text-xs flex flex-col items-center">
            <span className="hidden lg:inline">&rarr;</span>
            <span className="lg:hidden">&darr;</span>
            <span className="text-[10px] text-slate-400">REST / WS</span>
          </div>

          {/* Node 2 */}
          <div className="flex-1 w-full p-5 rounded-2xl bg-slate-900 border border-indigo-500/30 text-center space-y-2 shadow-glow-indigo/10">
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 w-fit mx-auto">
              <Server className="w-6 h-6" />
            </div>
            <div className="font-bold text-white text-sm">Cloud API Gateway</div>
            <div className="text-[11px] text-slate-400">
              Node.js / Express REST API & Socket.IO Engine
            </div>
          </div>

          <div className="text-indigo-400 font-mono text-xs flex flex-col items-center">
            <span className="hidden lg:inline">&rarr;</span>
            <span className="lg:hidden">&darr;</span>
            <span className="text-[10px] text-slate-400">TCP / TLS</span>
          </div>

          {/* Node 3 */}
          <div className="flex-1 w-full p-5 rounded-2xl bg-slate-900 border border-emerald-500/30 text-center space-y-2 shadow-glow-emerald/10">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 w-fit mx-auto">
              <Database className="w-6 h-6" />
            </div>
            <div className="font-bold text-white text-sm">MongoDB Atlas DBaaS</div>
            <div className="text-[11px] text-slate-400">
              Cloud Database, Time-Series Indices & Schemas
            </div>
          </div>

          <div className="text-emerald-400 font-mono text-xs flex flex-col items-center">
            <span className="hidden lg:inline">&rarr;</span>
            <span className="lg:hidden">&darr;</span>
            <span className="text-[10px] text-slate-400">Pushes</span>
          </div>

          {/* Node 4 */}
          <div className="flex-1 w-full p-5 rounded-2xl bg-slate-900 border border-amber-500/30 text-center space-y-2 shadow-glow-amber/10">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 w-fit mx-auto">
              <Activity className="w-6 h-6" />
            </div>
            <div className="font-bold text-white text-sm">React Command Center</div>
            <div className="text-[11px] text-slate-400">
              Vite, Tailwind, Recharts & Leaflet UI
            </div>
          </div>
        </div>
      </div>

      {/* Cloud Computing Concepts Pillar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pillar 1 */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">
              1. Cloud Data Storage (Database as a Service)
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            AutoCloud stores real-time sensor streams, user profiles, mission routes, and incident alarms in a managed MongoDB Atlas cloud cluster. Compound indexes on <code>deviceId</code> and <code>timestamp</code> enable sub-millisecond historical queries and analytics aggregations across millions of sensor packets.
          </p>
          <div className="pt-2 border-t border-slate-800 text-[11px] text-cyan-400 font-mono">
            Key Benefit: Elastic storage capacity, zero local database maintenance, automated cloud backups.
          </div>
        </div>

        {/* Pillar 2 */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Radio className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">
              2. Cloud REST API & WebSocket Streaming
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            A microservices-friendly Express.js gateway exposes stateless REST endpoints (<code>POST /api/telemetry</code>) for edge devices and establishes full-duplex WebSocket channels (Socket.IO) with client dashboards for live telemetry broadcasts and mission tracking.
          </p>
          <div className="pt-2 border-t border-slate-800 text-[11px] text-indigo-400 font-mono">
            Key Benefit: Low latency communication, horizontal auto-scaling, decoupled architecture.
          </div>
        </div>

        {/* Pillar 3 */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">
              3. Centralized Fleet Orchestration
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Eliminates siloed control software for different robot models. Delivery robots, surveillance drones, and factory AGVs are unified into a single cloud console where operators can dispatch missions, review thermal performance, and issue remote dock commands.
          </p>
          <div className="pt-2 border-t border-slate-800 text-[11px] text-emerald-400 font-mono">
            Key Benefit: Single pane of glass for heterogeneous multi-robot fleets.
          </div>
        </div>

        {/* Pillar 4 */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">
              4. Cloud Security & Role Authorization
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Implements JSON Web Token (JWT) stateless authorization and bcrypt cryptographic password hashing. Strict role-based access control (RBAC) isolates Admin privileges (system registration, deletions) from Operator monitoring tasks to safeguard physical autonomous nodes.
          </p>
          <div className="pt-2 border-t border-slate-800 text-[11px] text-rose-400 font-mono">
            Key Benefit: Zero plain-text password exposure, secure cloud token verification.
          </div>
        </div>
      </div>
    </div>
  );
};

export default CloudArchitecturePage;
