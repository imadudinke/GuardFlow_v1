#!/bin/bash

# GuardFlow Studio Deployment Script
# Usage: ./deploy.sh [development|production]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${NC}ℹ $1${NC}"
}

# Check if .env exists
check_env_file() {
    if [ ! -f .env ]; then
        print_error ".env file not found!"
        print_info "Creating .env from .env.example..."
        cp .env.example .env
        print_warning "Please edit .env with your configuration before continuing"
        exit 1
    fi
    print_success ".env file found"
}

# Check Docker installation
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed"
        print_info "Install Docker: https://docs.docker.com/get-docker/"
        exit 1
    fi
    print_success "Docker is installed"
}

# Check Docker Compose installation
check_docker_compose() {
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed"
        print_info "Install Docker Compose: https://docs.docker.com/compose/install/"
        exit 1
    fi
    print_success "Docker Compose is installed"
}

# Validate environment variables
validate_env() {
    source .env
    
    if [ "$ENVIRONMENT" = "production" ]; then
        if [ "$SECRET_KEY" = "your-secret-key-change-this-in-production" ] || [ "$SECRET_KEY" = "change-this-secret-key-in-production" ]; then
            print_error "SECRET_KEY must be changed in production!"
            print_info "Generate a secure key: openssl rand -hex 32"
            exit 1
        fi
        
        if [ "$POSTGRES_PASSWORD" = "changeme" ] || [ "$POSTGRES_PASSWORD" = "your_secure_password" ]; then
            print_error "POSTGRES_PASSWORD must be changed in production!"
            exit 1
        fi
    fi
    
    print_success "Environment variables validated"
}

# Deploy development
deploy_development() {
    print_info "Deploying GuardFlow Studio (Development)..."
    
    # Stop existing containers
    print_info "Stopping existing containers..."
    docker-compose down
    
    # Build and start services
    print_info "Building and starting services..."
    docker-compose up -d --build
    
    # Wait for services to be healthy
    print_info "Waiting for services to be healthy..."
    sleep 10
    
    # Run migrations
    print_info "Running database migrations..."
    docker-compose exec -T backend alembic upgrade head || print_warning "Migrations may have already been applied"
    
    print_success "Development deployment complete!"
    print_info "Frontend: http://localhost:3000"
    print_info "Backend API: http://localhost:8001"
    print_info "API Docs: http://localhost:8001/docs"
}

# Deploy production
deploy_production() {
    print_info "Deploying GuardFlow Studio (Production)..."
    
    # Confirm production deployment
    print_warning "You are about to deploy to PRODUCTION"
    read -p "Are you sure? (yes/no): " confirm
    if [ "$confirm" != "yes" ]; then
        print_info "Deployment cancelled"
        exit 0
    fi
    
    # Stop existing containers
    print_info "Stopping existing containers..."
    docker-compose -f docker-compose.prod.yml down
    
    # Build and start services
    print_info "Building and starting services..."
    docker-compose -f docker-compose.prod.yml up -d --build
    
    # Wait for services to be healthy
    print_info "Waiting for services to be healthy..."
    sleep 15
    
    # Run migrations
    print_info "Running database migrations..."
    docker-compose -f docker-compose.prod.yml exec -T backend alembic upgrade head || print_warning "Migrations may have already been applied"
    
    print_success "Production deployment complete!"
    print_info "Frontend: http://localhost:${FRONTEND_PORT:-3000}"
    print_info "Backend API: http://localhost:${BACKEND_PORT:-8001}"
    print_warning "Remember to configure your reverse proxy (Nginx) for HTTPS"
}

# Main script
main() {
    echo "╔════════════════════════════════════════╗"
    echo "║   GuardFlow Studio Deployment         ║"
    echo "╚════════════════════════════════════════╝"
    echo ""
    
    # Check prerequisites
    print_info "Checking prerequisites..."
    check_docker
    check_docker_compose
    check_env_file
    validate_env
    
    echo ""
    
    # Determine deployment type
    DEPLOY_TYPE=${1:-development}
    
    case $DEPLOY_TYPE in
        development|dev)
            deploy_development
            ;;
        production|prod)
            deploy_production
            ;;
        *)
            print_error "Invalid deployment type: $DEPLOY_TYPE"
            print_info "Usage: ./deploy.sh [development|production]"
            exit 1
            ;;
    esac
    
    echo ""
    print_success "Deployment successful!"
    echo ""
    print_info "Useful commands:"
    echo "  View logs:    docker-compose logs -f"
    echo "  Stop:         docker-compose down"
    echo "  Restart:      docker-compose restart"
    echo "  Status:       docker-compose ps"
}

# Run main function
main "$@"
