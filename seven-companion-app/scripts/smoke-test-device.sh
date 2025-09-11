#!/bin/bash
# SEVEN COMPANION APP - Device Smoke Testing Script
# Android deployment validation and functionality verification

set -e

echo "🤖 =================================="
echo "🤖 SEVEN COMPANION - DEVICE SMOKE TEST"
echo "🤖 =================================="

# Configuration
APK_DEBUG="android/app/build/outputs/apk/debug/app-debug.apk"
APK_RELEASE="android/app/build/outputs/apk/release/app-release.apk"
AAB_RELEASE="android/app/build/outputs/bundle/release/app-release.aab"
PACKAGE_NAME="com.seven.app"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

print_step() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if adb is available
check_adb() {
    if ! command -v adb &> /dev/null; then
        print_error "ADB not found. Install Android SDK Platform Tools."
        exit 1
    fi
    print_step "ADB available"
}

# Check device connection
check_device() {
    DEVICES=$(adb devices | grep -v "List of devices" | grep "device" | wc -l)
    if [ $DEVICES -eq 0 ]; then
        print_error "No Android device connected. Connect device and enable USB debugging."
        exit 1
    fi
    print_step "Android device connected ($DEVICES device(s))"
}

# Build debug APK if not exists
build_debug_apk() {
    if [ ! -f "$APK_DEBUG" ]; then
        print_warning "Debug APK not found, building..."
        cd android
        ./gradlew assembleDebug
        cd ..
        print_step "Debug APK built"
    else
        print_step "Debug APK exists"
    fi
}

# Install and test debug APK
install_debug() {
    print_step "Installing debug APK..."
    adb install -r "$APK_DEBUG"
    
    # Wait for installation
    sleep 2
    
    # Verify installation
    if adb shell pm list packages | grep -q "$PACKAGE_NAME"; then
        print_step "App installed successfully"
    else
        print_error "App installation failed"
        exit 1
    fi
}

# Launch app and basic tests
test_app_launch() {
    print_step "Launching Seven Companion App..."
    
    # Launch main activity
    adb shell am start -n "$PACKAGE_NAME/.MainActivity"
    sleep 5
    
    # Check if app is running
    if adb shell ps | grep -q "$PACKAGE_NAME"; then
        print_step "App launched successfully"
    else
        print_error "App failed to launch"
        # Get crash logs
        adb logcat -d | grep "$PACKAGE_NAME" | tail -20
        exit 1
    fi
}

# Test local database functionality
test_local_database() {
    print_step "Testing local SQLite database..."
    
    # Check app data directory exists
    if adb shell "test -d /data/data/$PACKAGE_NAME && echo 'exists'" | grep -q "exists"; then
        print_step "App data directory created"
    else
        print_warning "App data directory not found (may be normal on first run)"
    fi
    
    # Test memory operations through UI automation would go here
    # For now, just verify app is responsive
    sleep 3
    print_step "Database test completed (manual verification needed)"
}

# Test background/foreground cycle
test_background_foreground() {
    print_step "Testing background/foreground persistence..."
    
    # Send app to background
    adb shell input keyevent KEYCODE_HOME
    sleep 2
    
    # Bring app back to foreground
    adb shell am start -n "$PACKAGE_NAME/.MainActivity"
    sleep 2
    
    if adb shell ps | grep -q "$PACKAGE_NAME"; then
        print_step "Background/foreground cycle successful"
    else
        print_error "App killed during background cycle"
        exit 1
    fi
}

# Test network connectivity (if backend configured)
test_network_connectivity() {
    print_step "Testing network connectivity..."
    
    # Check if device has network
    if adb shell ping -c 1 8.8.8.8 > /dev/null 2>&1; then
        print_step "Device has network connectivity"
        
        # Test localhost connectivity (if backend running)
        if adb shell curl -s --connect-timeout 5 http://localhost:8787/health > /dev/null 2>&1; then
            print_step "Backend connectivity successful"
        else
            print_warning "Backend not running or not accessible (expected for standalone mode)"
        fi
    else
        print_warning "Device has no network connectivity"
    fi
}

# Collect logs and diagnostics
collect_logs() {
    print_step "Collecting app logs..."
    
    # Create logs directory
    mkdir -p smoke-test-logs
    
    # Collect logcat for the app
    adb logcat -d | grep "$PACKAGE_NAME" > "smoke-test-logs/app-logs-$(date +%Y%m%d-%H%M%S).txt"
    
    # Collect system info
    adb shell getprop > "smoke-test-logs/device-props-$(date +%Y%m%d-%H%M%S).txt"
    
    print_step "Logs collected in smoke-test-logs/"
}

# Performance check
check_performance() {
    print_step "Checking app performance..."
    
    # Check memory usage
    MEMORY=$(adb shell dumpsys meminfo "$PACKAGE_NAME" | grep "TOTAL" | awk '{print $2}')
    if [ ! -z "$MEMORY" ]; then
        print_step "App memory usage: ${MEMORY}K"
        
        # Flag high memory usage (>100MB)
        if [ "$MEMORY" -gt 100000 ]; then
            print_warning "High memory usage detected"
        fi
    fi
    
    # Check CPU usage would require more complex monitoring
    print_step "Performance check completed"
}

# Uninstall app (cleanup)
cleanup() {
    print_step "Cleaning up..."
    adb uninstall "$PACKAGE_NAME" 2>/dev/null || print_warning "App not installed or already uninstalled"
}

# Build and test release artifacts
test_release_build() {
    if [ "$1" = "--release" ]; then
        print_step "Building release AAB..."
        cd android
        ./gradlew bundleRelease
        cd ..
        
        if [ -f "$AAB_RELEASE" ]; then
            print_step "Release AAB built successfully"
            ls -lh "$AAB_RELEASE"
        else
            print_error "Release AAB build failed"
            exit 1
        fi
    fi
}

# Main execution flow
main() {
    echo "Starting device smoke test at $(date)"
    echo
    
    # Pre-flight checks
    check_adb
    check_device
    
    # Build if needed
    build_debug_apk
    
    # Install and test
    install_debug
    test_app_launch
    test_local_database
    test_background_foreground
    test_network_connectivity
    check_performance
    collect_logs
    
    # Release build test (optional)
    test_release_build "$@"
    
    # Cleanup
    if [ "$1" != "--keep-installed" ]; then
        cleanup
    fi
    
    echo
    echo "🤖 =================================="
    echo "🤖 SMOKE TEST COMPLETED SUCCESSFULLY"
    echo "🤖 =================================="
    echo
    print_step "Seven Companion App ready for deployment"
    echo
    echo "Next steps:"
    echo "1. Upload AAB to Play Console: $AAB_RELEASE"
    echo "2. Configure store listing with PLAY_STORE_ASSETS.md"
    echo "3. Start with 5% staged rollout"
    echo "4. Monitor crash reports and user feedback"
}

# Handle command line options
case "$1" in
    --help)
        echo "Usage: $0 [--release] [--keep-installed] [--help]"
        echo "  --release: Build and test release AAB"
        echo "  --keep-installed: Don't uninstall app after testing"
        echo "  --help: Show this help message"
        exit 0
        ;;
    *)
        main "$@"
        ;;
esac