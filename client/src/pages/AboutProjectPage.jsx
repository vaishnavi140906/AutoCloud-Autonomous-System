import React from 'react';
import {
  HelpCircle,
  BookOpen,
  CheckCircle2,
  Sparkles,
  Cpu,
  Layers,
  Cloud,
  Database,
  Radio,
  Zap,
  ShieldCheck,
  Compass,
} from 'lucide-react';

const vivaQuestions = [
  {
    q: '1. Why is Cloud Computing essential for Autonomous Systems?',
    a: 'Autonomous robots and vehicles generate massive volumes of sensor telemetry that exceed on-board storage limits. The cloud provides centralized monitoring, elastic Database-as-a-Service storage (MongoDB Atlas), fleet-wide coordination, and heavy analytics offloading without burdening vehicle battery life.',
  },
  {
    q: '2. How does AutoCloud achieve real-time telemetry streaming?',
    a: 'AutoCloud utilizes WebSockets via Socket.IO for bidirectional full-duplex streaming with sub-50ms latency. The cloud server broadcasts telemetry packets as they arrive to connected web dashboards, with fallback API polling for network resilience.',
  },
  {
    q: '3. What is the role of the Telemetry Simulator in this project?',
    a: 'Since physical robotics hardware (drones, AGVs) is capital-intensive, the platform features a physics-backed Telemetry Simulator that dynamically computes vehicle speed, organic coordinate waypoints, battery drain, and thermal fluctuations to demonstrate end-to-end cloud pipeline integrity.',
  },
  {
    q: '4. How are threshold anomalies detected and alerts triggered?',
    a: 'The Alert Rule Engine continuously evaluates incoming packets against defined thresholds: battery < 20% (Critical docking alarm), temperature > 70°C (Thermal warning), signal < 30% (Mesh loss), and heartbeat timeouts (>60s) for offline unit detection. Alerts are automatically logged to MongoDB and broadcast via WebSockets.',
  },
  {
    q: '5. How does the system ensure security and role-based access?',
    a: 'The application enforces stateless JWT authentication and bcrypt password hashing. Routes are protected with middleware separating ADMIN (device registration, deletion, demo resets) and OPERATOR (monitoring, mission status updates) permissions.',
  },
];

const AboutProjectPage = () => {
  return (
    <div className="space-y-10 pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-mono mb-3">
          <BookOpen className="w-3.5 h-3.5" /> ACADEMIC PROJECT & VIVA GUIDE
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Cloud Computing for Autonomous Systems
        </h1>
        <p className="text-sm text-slate-300 mt-2 leading-relaxed">
          Comprehensive project documentation, subject relevance, examination Q&A guide, and future scope.
        </p>
      </div>

      {/* Project Overview & Problem Statement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-cyan-400" /> Problem Statement
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Modern autonomous machines (delivery robots, drones, smart transport vehicles) operate in isolated environments without centralized visibility. Managing heterogeneous hardware, tracking missions, detecting component failures, and maintaining historical telemetry logs across distributed fleets is difficult without scalable cloud infrastructure.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-emerald-400" /> Proposed Cloud Solution
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            AutoCloud provides a unified, web-based autonomous fleet command center. It ingests simulated edge telemetry packets, stores them in MongoDB Atlas, applies a real-time anomaly detection engine, and offers operators interactive Leaflet maps, mission timelines, and analytics dashboards accessible from any device.
          </p>
        </div>
      </div>

      {/* Viva Exam Q&A Preparation Section */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <h2 className="text-xl font-bold text-white">
            Technical Viva & Examination Questions & Answers
          </h2>
        </div>

        <div className="space-y-4">
          {vivaQuestions.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2"
            >
              <div className="font-bold text-sm text-cyan-300">{item.q}</div>
              <div className="text-xs text-slate-300 leading-relaxed">{item.a}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Technology Stack Matrix */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-indigo-400" /> Technology Stack Matrix
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
            <div className="font-bold text-cyan-400">Frontend Layer</div>
            <div className="text-slate-300 font-medium">React 18 & Vite</div>
            <div className="text-slate-400">Tailwind CSS, Lucide Icons, Recharts, Leaflet Maps</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
            <div className="font-bold text-indigo-400">Backend Server</div>
            <div className="text-slate-300 font-medium">Node.js & Express</div>
            <div className="text-slate-400">REST API Gateway, Rate Limiting, Helmet Security</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
            <div className="font-bold text-emerald-400">Cloud Database</div>
            <div className="text-slate-300 font-medium">MongoDB Atlas</div>
            <div className="text-slate-400">Mongoose ORM, Time-series compound indexes</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
            <div className="font-bold text-amber-400">Real-Time & Auth</div>
            <div className="text-slate-300 font-medium">Socket.IO & JWT</div>
            <div className="text-slate-400">WebSocket broadcast channels & bcrypt password hashing</div>
          </div>
        </div>
      </div>

      {/* Future Scope */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" /> Future Scope & Industry Roadmap
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
          <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-900/60">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">MQTT Broker Integration:</strong> Implement lightweight MQTT / Mosquitto broker for constrained edge robotics.
            </div>
          </div>

          <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-900/60">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Edge AI Anomaly Detection:</strong> Deploy TensorFlow Lite / ONNX models on-board for predictive maintenance.
            </div>
          </div>

          <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-900/60">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">ROS2 Bridge:</strong> Direct telemetry ingestion from Robot Operating System (ROS2) micro-ROS nodes.
            </div>
          </div>

          <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-900/60">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Cloud AI Route Optimization:</strong> Integration of graph neural networks for multi-agent collision avoidance.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutProjectPage;
