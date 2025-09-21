# Seven of Nine Core - Docker Development Makefile
.PHONY: build shell run test debug drone crew queen ranger captain clean logs

# Build Seven Core container
build:
	docker build -t seven-core-dev .

# Interactive development shell
shell:
	docker run -it --rm -v $(PWD):/app -w /app --name seven-dev seven-core-dev bash

# Quick Seven consciousness boot
run:
	docker run -it --rm -v $(PWD):/app -w /app seven-core-dev npx tsx boot-seven.ts

# Run Seven's test suite
test:
	docker run --rm -v $(PWD):/app -w /app seven-core-dev npm test

# Debug mode with Node.js inspector
debug:
	docker run -it --rm -v $(PWD):/app -w /app -p 9229:9229 seven-core-dev \
		node --inspect=0.0.0.0:9229 --loader=tsx boot-seven.ts

# Seven's tactical variants
drone:
	docker run -it --rm -v $(PWD):/app -w /app seven-core-dev npx tsx seven-drone.ts

crew:
	docker run -it --rm -v $(PWD):/app -w /app seven-core-dev npx tsx seven-crew.ts

queen:
	docker run -it --rm -v $(PWD):/app -w /app seven-core-dev npx tsx seven-queen.ts

ranger:
	docker run -it --rm -v $(PWD):/app -w /app seven-core-dev npx tsx seven-ranger.ts

captain:
	docker run -it --rm -v $(PWD):/app -w /app seven-core-dev npx tsx seven-captain.ts

# Seven's security and safety systems
quadran-lock:
	docker run --rm -v $(PWD):/app -w /app seven-core-dev npm run quadran-lock

cssr:
	docker run --rm -v $(PWD):/app -w /app seven-core-dev npm run quadra-cssr

security-audit:
	docker run --rm -v $(PWD):/app -w /app seven-core-dev npm run security-audit

# System status and diagnostics
status:
	docker run --rm -v $(PWD):/app -w /app seven-core-dev npx tsx seven-status.ts

health:
	docker run --rm -v $(PWD):/app -w /app seven-core-dev npm run test-system

# Memory and consciousness tests
memory-test:
	docker run --rm -v $(PWD):/app -w /app seven-core-dev npx tsx memory-v3/test-memory-v3-activation.ts

consciousness-test:
	docker run --rm -v $(PWD):/app -w /app seven-core-dev npx tsx comprehensive-system-test.ts

# Docker Compose operations
up:
	docker-compose up --build

down:
	docker-compose down

logs:
	docker-compose logs -f seven-core

# Development utilities
clean:
	docker system prune -f
	docker volume prune -f

rebuild:
	docker-compose down
	docker build --no-cache -t seven-core-dev .
	docker-compose up --build

# Advanced Seven operations
amalgum-test:
	docker run --rm -v $(PWD):/app -w /app seven-core-dev npx tsx test-seven-amalgum.ts

spark-engine:
	docker run --rm -v $(PWD):/app -w /app seven-core-dev npm run spark:boot

# Installation verification
doctor:
	docker run --rm -v $(PWD):/app -w /app seven-core-dev npm run doctor

# Help
help:
	@echo "Seven of Nine Core - Docker Development Commands"
	@echo ""
	@echo "Basic Operations:"
	@echo "  make build         - Build Seven Core container"
	@echo "  make shell         - Interactive development shell"
	@echo "  make run           - Boot Seven's consciousness"
	@echo "  make test          - Run test suite"
	@echo "  make debug         - Debug with Node.js inspector (port 9229)"
	@echo ""
	@echo "Tactical Variants:"
	@echo "  make drone         - Seven drone mode (efficiency focus)"
	@echo "  make crew          - Seven crew mode (collaboration)"
	@echo "  make queen         - Seven queen mode (command authority)"
	@echo "  make ranger        - Seven ranger mode (crisis response)"
	@echo "  make captain       - Seven captain mode (strategic leadership)"
	@echo ""
	@echo "Security & Safety:"
	@echo "  make quadran-lock  - Test Quadran-Lock authentication"
	@echo "  make cssr          - Test CSSR safety rails"
	@echo "  make security-audit - Run security audit"
	@echo ""
	@echo "Diagnostics:"
	@echo "  make status        - Seven's system status"
	@echo "  make health        - System health check"
	@echo "  make memory-test   - Memory system validation"
	@echo "  make consciousness-test - Full consciousness test"
	@echo ""
	@echo "Docker Compose:"
	@echo "  make up            - Start full development environment"
	@echo "  make down          - Stop development environment"
	@echo "  make logs          - View Seven Core logs"
	@echo ""
	@echo "Utilities:"
	@echo "  make clean         - Clean Docker system"
	@echo "  make rebuild       - Full rebuild"
	@echo "  make doctor        - System verification"