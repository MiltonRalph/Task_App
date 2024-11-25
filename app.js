const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');
const morgan = require('morgan');
const helmet = require('helmet');

dotenv.config();

const allowedOrigins = [
  'https://your-netlify-site.netlify.app',
];

const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(bodyParser.json());
app.use(helmet());

app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/users', userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running on port ${PORT}`);
});
