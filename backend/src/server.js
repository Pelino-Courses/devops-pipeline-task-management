const app = require('./app');
const pool = require('./config/database');

const PORT = process.env.PORT || 5000;

// Test database connection
async function testDatabaseConnection() {
    try {
        await pool.query('SELECT NOW()');
        console.log('✅ Database connection successful');
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        process.exit(1);
    }
}

// Start server
async function startServer() {
    await testDatabaseConnection();

    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`🏥 Health check: http://localhost:${PORT}/health`);
        console.log(`📡 API endpoint: http://localhost:${PORT}/api`);
    });
}

startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, closing server...');
    pool.end(() => {
        console.log('Database pool closed');
        process.exit(0);
    });
});
