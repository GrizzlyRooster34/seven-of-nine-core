# Seven Companion - Release Checklist

## Pre-Release Tasks

### Version Management
- [ ] Bump `versionCode` in `android/app/build.gradle` (+1 from previous)
- [ ] Update `versionName` in `android/app/build.gradle` (e.g., "1.0.1")
- [ ] Update "What's New" section in Play Store listing
- [ ] Test app with new version number locally

### Code Quality Gates
- [ ] Run `npx tsc -p tsconfig.app.json` → verify TSC=0
- [ ] Run `npm run lint` → verify no linting errors
- [ ] Test core functionality: Auth → Memory → Chat → Dashboard
- [ ] Verify offline mode graceful fallbacks
- [ ] Test Quadran-Lock authentication flow

### GitHub Secrets Configuration
- [ ] `ANDROID_KEYSTORE_BASE64` → seven-release.keystore.b64 contents
- [ ] `SEVEN_STORE_PASSWORD` → changeit  
- [ ] `SEVEN_KEY_ALIAS` → seven
- [ ] `SEVEN_KEY_PASSWORD` → changeit

### CI Pipeline Execution
- [ ] Push to main branch or trigger workflow manually
- [ ] Monitor GitHub Actions build progress
- [ ] Verify TypeScript compilation passes
- [ ] Verify Android SDK setup completes
- [ ] Download successful artifacts:
  - [ ] `app-debug-apk` → for local testing
  - [ ] `app-release-aab` → for Play Store upload

## Play Console Setup

### App Information
- [ ] App name: "Seven Companion — Tactical AI Interface"
- [ ] Short description (≤80 chars): "Bonded tactical AI cockpit for Seven's consciousness, secure and adaptive."
- [ ] Full description: Use template from `play-store-metadata.md`
- [ ] Category: Productivity
- [ ] Contains ads: No

### Store Listing Assets
- [ ] App icon (512x512px): Seven tactical insignia design
- [ ] Feature graphic (1024x500px): Tactical interface theme
- [ ] Screenshots (minimum 2):
  - [ ] Main tactical dashboard
  - [ ] Chat interface with Seven
  - [ ] Memory management screen
  - [ ] Settings & authentication panel

### Data Safety Form
- [ ] Data types collected:
  - [ ] Crash logs (anonymous, diagnostic purpose)
  - [ ] Usage analytics (optional, user-controlled)
- [ ] Data sharing: None
- [ ] Data not sold: Confirmed
- [ ] Data encrypted in transit: Yes
- [ ] Users can request deletion: Yes

### Content Rating
- [ ] Complete content rating questionnaire
- [ ] No user-generated content: Confirmed
- [ ] No location sharing: Confirmed  
- [ ] No gambling/financial: Confirmed
- [ ] No medical claims: Confirmed

### Contact & Legal
- [ ] Support email: support@sevencompanion.com
- [ ] Privacy policy URL: https://sevencompanion.com/privacy
- [ ] Upload privacy-policy.html to website

## Release Process

### Internal Testing Track
- [ ] Upload AAB to Internal testing track
- [ ] Add internal testers (email addresses)
- [ ] Release to Internal testing
- [ ] Test install and core functionality
- [ ] Verify no crashes or critical issues

### Closed Testing (Optional)
- [ ] Create Closed testing track
- [ ] Add limited external testers
- [ ] Monitor feedback and crash reports
- [ ] Fix any critical issues found

### Production Release
- [ ] Promote build to Production track
- [ ] Set rollout percentage (start with 10-20%)
- [ ] Monitor Play Console for:
  - [ ] Install success rate
  - [ ] Crash rate (<0.5% target)
  - [ ] ANR (Application Not Responding) rate
  - [ ] User ratings and reviews

## Post-Release Monitoring

### Health Metrics (First 48 Hours)
- [ ] Install success rate >95%
- [ ] Crash-free users >99.5%
- [ ] ANR rate <0.1%
- [ ] Average rating ≥4.0 stars

### User Feedback Response
- [ ] Monitor and respond to user reviews
- [ ] Track feature requests and bug reports
- [ ] Plan hotfix release if critical issues found

### Analytics (if enabled)
- [ ] Monitor user retention (Day 1, Day 7, Day 30)
- [ ] Track feature usage patterns
- [ ] Identify most/least used functionality

## Rollback Plan
If critical issues are discovered:
- [ ] Halt rollout in Play Console
- [ ] Identify root cause from crash reports
- [ ] Prepare hotfix release
- [ ] Test fix thoroughly before re-release
- [ ] Communicate with affected users via app update notes

## Success Criteria
- ✅ Build completes successfully in CI
- ✅ TSC=0 TypeScript compilation 
- ✅ Play Store review approval
- ✅ <2% crash rate in first week
- ✅ Positive user reception (≥4.0 rating)
- ✅ Core Quadran-Lock auth flow functional
- ✅ Memory and chat systems operational