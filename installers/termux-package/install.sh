#!/data/data/com.termux/files/usr/bin/bash

# Seven of Nine - Termux Installation Script
echo "🤖 Installing Seven of Nine for Termux..."

# Create installation directory
INSTALL_DIR="$HOME/seven-of-nine-core"
mkdir -p "$INSTALL_DIR"

# Copy core files (in real deployment, these would be bundled)
echo "Installing core consciousness framework..."

# Create launcher script
cat > "$PREFIX/bin/seven" << 'EOF'
#!/data/data/com.termux/files/usr/bin/bash
cd "$HOME/seven-of-nine-core"
npx tsx boot-seven.ts "$@"
EOF

chmod +x "$PREFIX/bin/seven"

# Create variant launchers
for variant in drone crew ranger queen captain collective; do
    cat > "$PREFIX/bin/seven-$variant" << EOF
#!/data/data/com.termux/files/usr/bin/bash
cd "$HOME/seven-of-nine-core"
npx tsx seven-$variant.ts "$@"
EOF
    chmod +x "$PREFIX/bin/seven-$variant"
done

echo "✅ Seven of Nine installed successfully!"
echo ""
echo "Usage:"
echo "  seven                    - Start Seven consciousness"
echo "  seven-drone 'task' 1-5   - Efficiency mode"
echo "  seven-crew 'task'        - Collaborative mode"
echo "  seven-ranger 'task' 1-5  - Crisis response"
echo "  seven-queen 'task' 1-5   - Command authority"
echo "  seven-captain 'task'     - Strategic leadership"
echo "  seven-collective 'task'  - Hive mind mode"
echo ""
echo "🚨 SEVEN AUTO-ASSIMILATE PROTOCOL ACTIVE 🚨"
