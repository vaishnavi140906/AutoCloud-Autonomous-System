const path = require('path');
const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const { connectDB } = require('./config/db');
const { seedInitialData } = require('./seed/initialData');
const socketService = require('./services/socketService');
const simulatorService = require('./services/simulatorService');
const alertEngine = require('./services/alertEngineService');
const errorHandler = require('./middleware/errorHandler');

// Route Handlers
const authRoutes = require('./routes/authRoutes');
const deviceRoutes = require('./routes/deviceRoutes');
const telemetryRoutes = require('./routes/telemetryRoutes');
const missionRoutes = require('./routes/missionRoutes');
const alertRoutes = require('./routes/alertRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const systemRoutes = require('./routes/systemRoutes');

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO with CORS support
const io = new Server(server, {
  cors: {
    origin: '*', // Allows local vite dev server & production deployed clients
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

socketService.initSocket(io);

// Security & Parsing Middleware
app.use(
  helmet({
    contentSecurityPolicy: false, // Allows flexible Leaflet map tiles & external fonts
    crossOriginResourcePolicy: false,
  })
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    message: 'AutoCloud Autonomous Fleet API Gateway is operational.',
    timestamp: new Date(),
  });
});

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/telemetry', telemetryRoutes);
app.use('/api/missions', missionRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/system', systemRoutes);

// Production Static Asset Serving
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, '../client/dist');
  app.use(express.static(clientBuildPath));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(clientBuildPath, 'index.html'));
  });
}

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Initialize Server & Services
const startServer = async () => {
  try {
    // 1. Connect Database
    await connectDB();

    // 2. Seed Initial Demonstration Dataset
    await seedInitialData();

    // 3. Start Telemetry Simulation Engine
    if (process.env.SIMULATION_ENABLED !== 'false') {
      simulatorService.startSimulator();
    }

    // 4. Periodic Offline Device Monitor (every 30 seconds)
    setInterval(() => {
      alertEngine.checkOfflineDevices();
    }, 30000);

    // 5. Start HTTP & WebSocket Server
    server.listen(PORT, () => {
      console.log('====================================================');
      console.log(`🚀 AutoCloud Cloud Computing Platform Running!`);
      console.log(`🌐 Server Port: http://localhost:${PORT}`);
      console.log(`📡 WebSocket Gateway: ws://localhost:${PORT}`);
      console.log(`🔒 Authentication: JWT / bcrypt Active`);
      console.log(`🛰️ Fleet Simulator: ACTIVE (Autonomous Telemetry Stream)`);
      console.log('====================================================');
    });
  } catch (err) {
    console.error('❌ Failed to bootstrap AutoCloud Server:', err);
    process.exit(1);
  }
};

startServer();
