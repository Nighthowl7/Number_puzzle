# 🧩 Number Puzzle (15-Puzzle)

A beautiful, containerized 15-puzzle game built with React and Node.js, designed to be deployed on Kubernetes.

![Sliding Puzzle](https://img.shields.io/badge/Status-Complete-success)
![React](https://img.shields.io/badge/Frontend-React-blue)
![Express](https://img.shields.io/badge/Backend-Express-green)
![Kubernetes](https://img.shields.io/badge/Infrastructure-Kubernetes-blue)

## ✨ Features

- **Responsive Game Grid**: A 4x4 grid with smooth transitions and hover effects.
- **Move Counter**: Tracks how many moves you've made.
- **Timer**: Real-time timer to challenge your speed.
- **Personal Best**: Local storage integration to save your best moves and time.
- **Solvable Shuffling**: Ensures every game generated is mathematically solvable.
- **Leaderboard API**: Backend service to track global high scores (in-memory).
- **Health Checks**: Built-in health endpoints for monitoring.
- **Kubernetes Ready**: Complete manifests for easy deployment.

## 🛠️ Tech Stack

### Frontend
- **React**: Modern functional components with Hooks.
- **Tailwind CSS**: Sleek, responsive design with vibrant gradients.
- **Lucide-React**: Elegant icon set.

### Backend
- **Node.js & Express**: Lightweight API for leaderboard management.
- **CORS**: Configured for seamless frontend-backend communication.

### DevOps
- **Docker**: Containerized images for both frontend and backend.
- **Kubernetes**: Deployment and Service manifests for automated scaling and management.

## 📂 Project Structure

```text
.
├── backend/            # Express.js API
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
├── frontend/           # React Application
│   ├── Dockerfile
│   ├── package.json
│   ├── src/
│   └── public/
├── k8s/                # Kubernetes Manifests
│   ├── backend-deployment.yaml
│   ├── backend-service.yaml
│   ├── frontend-deployment.yaml
│   └── frontend-service.yaml
└── README.md
```

## 🚀 Getting Started

### Running with Docker Compose

Create a `docker-compose.yml` in the root (optional) or run manually:

```bash
# Build and run backend
cd backend
docker build -t number-puzzle-backend .
docker run -p 5000:5000 number-puzzle-backend

# Build and run frontend
cd ../frontend
docker build -t number-puzzle-frontend .
docker run -p 80:80 number-puzzle-frontend
```

### Local Development

#### Backend
```bash
cd backend
npm install
npm start
```

#### Frontend
```bash
cd frontend
npm install
npm start
```

## ☸️ Kubernetes Deployment

Deploy the entire stack to your cluster:

```bash
kubectl apply -f k8s/
```

This will create:
- `backend`: Deployment and ClusterIP Service (Port 5000).
- `frontend`: Deployment and LoadBalancer/NodePort Service (Port 80).

## 🎮 How to Play

1. Click on a tile adjacent to the empty space to slide it.
2. Arrange the numbers from **1 to 15** in sequential order.
3. The empty space should end up at the bottom-right corner.
4. Try to beat your personal best in moves and time!

---

Developed with ❤️ by [Nighthowl7](https://github.com/Nighthowl7)
