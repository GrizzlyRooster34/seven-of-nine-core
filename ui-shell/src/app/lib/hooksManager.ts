import {

  HooksConfiguration,
  HookMatcher,
  HookValidationResult,
  HookValidationError,
  HookValidationWarning,
  HookCommand,
} from '@/app/types/hooks';

export class HooksManager {
  
  static mergeConfigs(
    user: HooksConfiguration,
    project: HooksConfiguration,
    local: HooksConfiguration
  ): HooksConfiguration {
    const merged: HooksConfiguration = {};
    
    
    const matcherEvents: (keyof HooksConfiguration)[] = ['PreToolUse', 'PostToolUse'];
    
    
    const directEvents: (keyof HooksConfiguration)[] = ['Notification', 'Stop', 'SubagentStop'];

    
    for (const event of matcherEvents) {
      
      let matchers = [...((user[event] as HookMatcher[] | undefined) || [])];
      
      
      if (project[event]) {
        matchers = this.mergeMatchers(matchers, project[event] as HookMatcher[]);
      }
      
      
      if (local[event]) {
        matchers = this.mergeMatchers(matchers, local[event] as HookMatcher[]);
      }
      
      if (matchers.length > 0) {
        (merged as any)[event] = matchers;
      }
    }
    
    
    for (const event of directEvents) {
      
      const hooks: HookCommand[] = [];
      
      
      if (user[event]) {
        hooks.push(...(user[event] as HookCommand[]));
      }
      
      
      if (project[event]) {
        hooks.push(...(project[event] as HookCommand[]));
      }
      
      
      if (local[event]) {
        hooks.push(...(local[event] as HookCommand[]));
      }
      
      if (hooks.length > 0) {
        (merged as any)[event] = hooks;
      }
    }
    
    return merged;
  }

  
  private static mergeMatchers(
    base: HookMatcher[],
    override: HookMatcher[]
  ): HookMatcher[] {
    const result = [...base];
    
    for (const overrideMatcher of override) {
      const existingIndex = result.findIndex(
        m => m.matcher === overrideMatcher.matcher
      );
      
      if (existingIndex >= 0) {
        
        result[existingIndex] = overrideMatcher;
      } else {
        
        result.push(overrideMatcher);
      }
    }
    
    return result;
  }

  
  static async validateConfig(hooks: HooksConfiguration): Promise<HookValidationResult> {
    const errors: HookValidationError[] = [];
    const warnings: HookValidationWarning[] = [];

    
    if (!hooks) {
      return { valid: true, errors, warnings };
    }

    
    const matcherEvents = ['PreToolUse', 'PostToolUse'] as const;
    
    
    const directEvents = ['Notification', 'Stop', 'SubagentStop'] as const;

    
    for (const event of matcherEvents) {
      const matchers = hooks[event];
      if (!matchers || !Array.isArray(matchers)) continue;

      for (const matcher of matchers) {
        
        if (matcher.matcher) {
          try {
            new RegExp(matcher.matcher);
          } catch (e) {
            errors.push({
              event,
              matcher: matcher.matcher,
              message: `Invalid regex pattern: ${e instanceof Error ? e.message : 'Unknown error'}`
            });
          }
        }

        
        if (matcher.hooks && Array.isArray(matcher.hooks)) {
          for (const hook of matcher.hooks) {
            if (!hook.command || !hook.command.trim()) {
              errors.push({
                event,
                matcher: matcher.matcher,
                message: 'Empty command'
              });
            }

            
            const dangers = this.checkDangerousPatterns(hook.command || '');
            warnings.push(...dangers.map(d => ({
              event,
              matcher: matcher.matcher,
              command: hook.command || '',
              message: d
            })));
          }
        }
      }
    }

    
    for (const event of directEvents) {
      const directHooks = hooks[event];
      if (!directHooks || !Array.isArray(directHooks)) continue;

      for (const hook of directHooks) {
        if (!hook.command || !hook.command.trim()) {
          errors.push({
            event,
            message: 'Empty command'
          });
        }

        
        const dangers = this.checkDangerousPatterns(hook.command || '');
        warnings.push(...dangers.map(d => ({
          event,
          command: hook.command || '',
          message: d
        })));
      }
    }

    return { valid: errors.length === 0, errors, warnings };
  }

  
  public static checkDangerousPatterns(command: string): string[] {
    const warnings: string[] = [];
    
    
    if (!command || typeof command !== 'string') {
      return warnings;
    }
    
    const patterns = [
      { pattern: /rm\s+-rf\s+\/(?:\s|$)/, message: 'Destructive command on root directory' },
      { pattern: /rm\s+-rf\s+~/, message: 'Destructive command on home directory' },
      { pattern: /:\s*\(\s*\)\s*\{.*\}\s*;/, message: 'Fork bomb pattern detected' },
      { pattern: /curl.*\|\s*(?:bash|sh)/, message: 'Downloading and executing remote code' },
      { pattern: /wget.*\|\s*(?:bash|sh)/, message: 'Downloading and executing remote code' },
      { pattern: />\/dev\/sda/, message: 'Direct disk write operation' },
      { pattern: /sudo\s+/, message: 'Elevated privileges required' },
      { pattern: /dd\s+.*of=\/dev\//, message: 'Dangerous disk operation' },
      { pattern: /mkfs\./, message: 'Filesystem formatting command' },
      { pattern: /:(){ :|:& };:/, message: 'Fork bomb detected' },
    ];

    for (const { pattern, message } of patterns) {
      if (pattern.test(command)) {
        warnings.push(message);
      }
    }

    
    if (command.includes('$') && !command.includes('"$')) {
      warnings.push('Unquoted shell variable detected - potential code injection risk');
    }

    return warnings;
  }

  
  static escapeCommand(command: string): string {
    
    return command
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\$/g, '\\$')
      .replace(/`/g, '\\`');
  }

  
  static generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
} 
