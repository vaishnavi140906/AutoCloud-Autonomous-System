import React from 'react';
import { Link } from 'react-router-dom';
import {
  Cloud,
  Bot,
  Activity,
  Compass,
  AlertTriangle,
  BarChart3,
  ShieldCheck,
  Zap,
  ArrowRight,
  Database,
  Radio,
  Server,
  Layers,
  Cpu,
  Lock,
  Globe,
  CheckCircle2,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-16 overflow-hidden">
        {/* Glow ambient background orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-600/20 via-indigo-600/20 to-purple-600/10 rounded-full blur-[100px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-6 shadow-glow-cyan/20 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cloud Computing for Autonomous Systems</span>
          </div>

          {/* Main Hero Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none">
            Powering the Future of <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400">
              Autonomous Systems
            </span>
          </h1>

          {/* Subheading */}
          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Connect. Monitor. Analyze. Control. A next-generation cloud platform to manage autonomous robots, drones, and smart vehicles with real-time telemetry and cloud analytics.
          </p>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to={isAuthenticated ? '/dashboard' : '/login'}
              className="inline-flex items-center gap-2 px-7 py-3.5 text-base font-bold text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 rounded-2xl shadow-xl shadow-cyan-600/25 transition-all hover:scale-105 active:scale-95"
            >
              <Activity className="w-5 h-5" />
              {isAuthenticated ? 'Launch Command Center' : 'Get Started Demo'}
            </Link>

            <Link
              to="/architecture"
              className="inline-flex items-center gap-2 px-7 py-3.5 text-base font-semibold text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 rounded-2xl transition-all hover:scale-105"
            >
              <Cloud className="w-5 h-5 text-cyan-400" />
              Explore Cloud Architecture
            </Link>
          </div>

          {/* Live Platform Stats Pill Strip */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl glass-panel border border-slate-800 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">100%</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Cloud API Uptime</div>
            </div>
            <div className="p-4 rounded-2xl glass-panel border border-slate-800 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400 font-mono">&lt; 50ms</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">WebSocket Latency</div>
            </div>
            <div className="p-4 rounded-2xl glass-panel border border-slate-800 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">0 Hardware</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Simulated Telemetry</div>
            </div>
            <div className="p-4 rounded-2xl glass-panel border border-slate-800 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">Viva Ready</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Academic Demonstration</div>
            </div>
          </div>
        </div>
      </section>

      {/* Cloud Architecture Interactive Visual Section */}
      <section id="architecture" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-2 font-mono">
            END-TO-END PIPELINE
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How AutoCloud Integrates Autonomous Edge & Cloud
          </h3>
          <p className="mt-3 text-slate-400 max-w-2xl mx-auto text-sm">
            Autonomous units transmit continuous sensor packets across REST and WebSocket gateways into MongoDB Atlas for instant analytics and anomaly detection.
          </p>
        </div>

        <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center text-center">
            {/* Step 1: Autonomous Devices */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-700/80 space-y-2">
              <div className="w-12 h-12 mx-auto rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
                <Bot className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-white">Autonomous Fleet</h4>
              <p className="text-[11px] text-slate-400">Robots, Drones, AGVs, Smart Vehicles</p>
            </div>

            {/* Arrow */}
            <div className="hidden md:flex justify-center text-cyan-400">
              <ArrowRight className="w-6 h-6 animate-pulse" />
            </div>

            {/* Step 2: Cloud Ingestion Gateway */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-700/80 space-y-2">
              <div className="w-12 h-12 mx-auto rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                <Radio className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-white">Cloud REST & Socket.IO</h4>
              <p className="text-[11px] text-slate-400">Low-latency telemetry streaming gateway</p>
            </div>

            {/* Arrow */}
            <div className="hidden md:flex justify-center text-indigo-400">
              <ArrowRight className="w-6 h-6 animate-pulse" />
            </div>

            {/* Step 3: MongoDB Atlas & Analytics Engine */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-700/80 space-y-2">
              <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <Database className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-white">MongoDB Atlas</h4>
              <p className="text-[11px] text-slate-400">Cloud database & real-time alert engine</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Platform Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-2 font-mono">
            CAPABILITIES
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Centralized Cloud Orchestration Features
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition-all space-y-3">
            <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 w-fit border border-cyan-500/20">
              <Activity className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">Real-Time Fleet Telemetry</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Streams continuous battery voltage, vehicle velocity, core thermal levels, GPS coordinates, and signal strengths with instant WebSocket pushes.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-indigo-500/40 transition-all space-y-3">
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 w-fit border border-indigo-500/20">
              <Compass className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">Mission Control & Dispatch</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Assigns autonomous routes, monitors waypoint navigation progress in real time, and tracks estimated time of arrival across distributed sectors.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-rose-500/40 transition-all space-y-3">
            <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 w-fit border border-rose-500/20">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">Smart Anomaly Alert Engine</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Monitors critical thresholds like low battery (&lt;20%), thermal overheating (&gt;70°C), weak mesh signals, and disconnected units automatically.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition-all space-y-3">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 w-fit border border-emerald-500/20">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">Cloud Analytics & Reporting</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Aggregates operational fleet uptime, battery discharge rates, mission success metrics, and exports searchable historical telemetry records as CSV.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-amber-500/40 transition-all space-y-3">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 w-fit border border-amber-500/20">
              <Lock className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">Role-Based Fleet Security</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Secures system control with JWT tokens and bcrypt password encryption, separating Admin full management from Operator monitoring permissions.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-purple-500/40 transition-all space-y-3">
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 w-fit border border-purple-500/20">
              <Globe className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white">Live OpenStreetMap Radar</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Integrates high-precision Leaflet map layers displaying moving custom markers for drones, rovers, and autonomous transport units without paid APIs.
            </p>
          </div>
        </div>
      </section>

      {/* Cloud Computing Pillars for Viva Exam */}
      <section id="technology" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-800">
          <div className="max-w-3xl mb-10">
            <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-2 font-mono">
              CLOUD COMPUTING SUBJECT ALIGNMENT
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Demonstrated Cloud Concepts in AutoCloud
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="text-cyan-400 font-mono text-sm font-bold flex items-center gap-2">
                <Database className="w-4 h-4" /> Cloud Data Storage
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Centralized storage of multi-vehicle telemetry streams, alert states, and mission timelines using MongoDB Atlas Database-as-a-Service (DBaaS).
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-cyan-400 font-mono text-sm font-bold flex items-center gap-2">
                <Server className="w-4 h-4" /> Cloud REST API & WebSockets
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Decoupled API endpoints allowing edge devices to ingest telemetry payloads and operators to issue remote commands from any browser.
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-cyan-400 font-mono text-sm font-bold flex items-center gap-2">
                <Layers className="w-4 h-4" /> Scalability & Multi-Tenancy
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Microservice-ready modular architecture enabling dozens of new autonomous vehicles to connect seamlessly without frontend restructuring.
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-cyan-400 font-mono text-sm font-bold flex items-center gap-2">
                <Activity className="w-4 h-4" /> Centralized Monitoring
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Eliminates localized siloed screens by consolidating industrial robots, sky drones, and delivery bots into a single unified cloud console.
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-cyan-400 font-mono text-sm font-bold flex items-center gap-2">
                <Zap className="w-4 h-4" /> Serverless / Managed Hosting
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Engineered for rapid cloud deployment on Vercel (Frontend), Render / Railway (Backend), and MongoDB Atlas (Managed DB).
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-cyan-400 font-mono text-sm font-bold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Cloud Security & JWT
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Industry-standard authentication and authorization preventing unauthorized overrides to physical autonomous vehicles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-cyan-900/40 via-indigo-900/40 to-slate-900 border border-cyan-500/30 shadow-2xl relative overflow-hidden">
          <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to Explore the AutoCloud Platform?
          </h3>
          <p className="mt-3 text-slate-300 max-w-xl mx-auto text-sm leading-relaxed">
            Launch the command center using 1-click Demo Admin or Operator accounts to test real-time telemetry streaming and anomaly detection.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/login"
              className="px-6 py-3 text-sm font-bold text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl shadow-lg shadow-cyan-600/30 transition-all hover:scale-105"
            >
              Sign In to Command Center
            </Link>
            <Link
              to="/about"
              className="px-6 py-3 text-sm font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-700 rounded-xl transition-all"
            >
              Read Viva Presentation Guide
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
