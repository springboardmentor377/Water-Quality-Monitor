#!/usr/bin/env python3
"""
Water Quality Monitor - Startup Script
Run this script to start the backend server with proper configuration.
"""

import os
import sys
import subprocess
import uvicorn
from pathlib import Path

def check_requirements():
    """Check if required packages are installed"""
    try:
        import fastapi
        import sqlalchemy
        import passlib
        import jose
        print("✓ All required packages are installed")
        return True
    except ImportError as e:
        print(f"✗ Missing package: {e}")
        print("Please run: pip install -r requirements.txt")
        return False

def setup_environment():
    """Setup environment variables"""
    env_file = Path(".env")
    env_example = Path(".env.example")
    
    if not env_file.exists() and env_example.exists():
        print("Creating .env file from .env.example...")
        with open(env_example, 'r') as src, open(env_file, 'w') as dst:
            dst.write(src.read())
        print("✓ .env file created")
        print("⚠️  Please edit .env file with your configuration")
    
    return True

def create_uploads_directory():
    """Create uploads directory for image storage"""
    uploads_dir = Path("uploads")
    uploads_dir.mkdir(exist_ok=True)
    print("✓ Uploads directory ready")

def main():
    """Main startup function"""
    print("🌊 Water Quality Monitor - Backend Server")
    print("=" * 50)
    
    # Change to backend directory
    backend_dir = Path(__file__).parent / "backend"
    if backend_dir.exists():
        os.chdir(backend_dir)
        print(f"✓ Working directory: {backend_dir}")
    
    # Check requirements
    if not check_requirements():
        sys.exit(1)
    
    # Setup environment
    setup_environment()
    
    # Create uploads directory
    create_uploads_directory()
    
    # Start the server
    print("\n🚀 Starting FastAPI server...")
    print("📖 API Documentation: http://localhost:8000/docs")
    print("🔍 Alternative Docs: http://localhost:8000/redoc")
    print("\nPress Ctrl+C to stop the server\n")
    
    try:
        uvicorn.run(
            "main:app",
            host="0.0.0.0",
            port=8000,
            reload=True,
            reload_dirs=["./"]
        )
    except KeyboardInterrupt:
        print("\n👋 Server stopped")

if __name__ == "__main__":
    main()
