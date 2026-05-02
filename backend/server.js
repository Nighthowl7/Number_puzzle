const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory storage for leaderboard
let leaderboard = [];

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Get leaderboard - sorted by moves (ascending), then by time (ascending)
app.get('/api/leaderboard', (req, res) => {
  const sortedLeaderboard = leaderboard
    .sort((a, b) => {
      // Sort by moves first (lower is better)
      if (a.moves !== b.moves) return a.moves - b.moves;
      // If moves are equal, sort by time (lower is better)
      return a.time - b.time;
    })
    .slice(0, 10); // Top 10 scores
  
  res.json(sortedLeaderboard);
});

// Submit a new score to leaderboard
app.post('/api/leaderboard', (req, res) => {
  const { name, moves, time } = req.body;
  
  // Validation
  if (!name || !moves || time === undefined) {
    return res.status(400).json({ 
      error: 'Name, moves, and time are required' 
    });
  }

  if (typeof moves !== 'number' || typeof time !== 'number') {
    return res.status(400).json({ 
      error: 'Moves and time must be numbers' 
    });
  }

  // Create entry
  const entry = { 
    id: Date.now(),
    name: name.trim().substring(0, 20), // Limit name length
    moves: Math.floor(moves), 
    time: Math.floor(time), 
    timestamp: new Date().toISOString() 
  };
  
  leaderboard.push(entry);
  
  // Keep only top 100 entries to prevent memory issues
  if (leaderboard.length > 100) {
    leaderboard = leaderboard
      .sort((a, b) => {
        if (a.moves !== b.moves) return a.moves - b.moves;
        return a.time - b.time;
      })
      .slice(0, 100);
  }
  
  res.status(201).json(entry);
});

// Clear leaderboard (useful for testing)
app.delete('/api/leaderboard', (req, res) => {
  leaderboard = [];
  res.json({ message: 'Leaderboard cleared' });
});

// Get game statistics
app.get('/api/stats', (req, res) => {
  if (leaderboard.length === 0) {
    return res.json({
      totalGames: 0,
      averageMoves: 0,
      averageTime: 0,
      bestMoves: null,
      bestTime: null
    });
  }

  const totalMoves = leaderboard.reduce((sum, entry) => sum + entry.moves, 0);
  const totalTime = leaderboard.reduce((sum, entry) => sum + entry.time, 0);
  const bestMoves = Math.min(...leaderboard.map(e => e.moves));
  const bestTime = Math.min(...leaderboard.map(e => e.time));

  res.json({
    totalGames: leaderboard.length,
    averageMoves: Math.round(totalMoves / leaderboard.length),
    averageTime: Math.round(totalTime / leaderboard.length),
    bestMoves,
    bestTime
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🏆 Leaderboard: http://localhost:${PORT}/api/leaderboard`);
});