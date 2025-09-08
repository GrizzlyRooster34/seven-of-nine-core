import Database from 'better-sqlite3';
import { createHash } from 'crypto';

export interface Task {
  id: string;
  title: string;
  priority: number;
  status: 'pending' | 'active' | 'completed' | 'blocked';
  created: number;
  updated: number;
  dependencies: string[];
  estimated_ticks: number;
  actual_ticks?: number;
  notes: string;
}

export interface Plan {
  id: string;
  name: string;
  goal: string;
  tasks: Task[];
  status: 'draft' | 'active' | 'completed' | 'abandoned';
  created: number;
  updated: number;
}

export class PlanningTools {
  private db: Database.Database;
  private activePlan: Plan | null = null;
  
  constructor(db: Database.Database) {
    this.db = db;
    this.initializeTables();
    this.loadActivePlan();
  }
  
  private initializeTables(): void {
    // Create planning tables if they don't exist
    this.db.prepare(`
      CREATE TABLE IF NOT EXISTS plans (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        goal TEXT NOT NULL,
        status TEXT NOT NULL,
        created INTEGER NOT NULL,
        updated INTEGER NOT NULL,
        data TEXT NOT NULL
      )
    `).run();
    
    this.db.prepare(`
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        plan_id TEXT NOT NULL,
        title TEXT NOT NULL,
        priority INTEGER NOT NULL,
        status TEXT NOT NULL,
        created INTEGER NOT NULL,
        updated INTEGER NOT NULL,
        estimated_ticks INTEGER,
        actual_ticks INTEGER,
        dependencies TEXT,
        notes TEXT,
        FOREIGN KEY (plan_id) REFERENCES plans(id)
      )
    `).run();
  }
  
  private loadActivePlan(): void {
    const row = this.db.prepare(`
      SELECT * FROM plans 
      WHERE status = 'active' 
      ORDER BY updated DESC 
      LIMIT 1
    `).get() as any;
    
    if (row) {
      this.activePlan = JSON.parse(row.data) as Plan;
    }
  }
  
  createPlan(name: string, goal: string): Plan {
    const plan: Plan = {
      id: createHash('sha256').update(`${name}:${Date.now()}`).digest('hex').substring(0, 16),
      name,
      goal,
      tasks: [],
      status: 'draft',
      created: Date.now(),
      updated: Date.now()
    };
    
    this.db.prepare(`
      INSERT INTO plans (id, name, goal, status, created, updated, data)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      plan.id,
      plan.name,
      plan.goal,
      plan.status,
      plan.created,
      plan.updated,
      JSON.stringify(plan)
    );
    
    return plan;
  }
  
  addTask(
    planId: string,
    title: string,
    priority: number = 50,
    estimatedTicks: number = 1,
    dependencies: string[] = []
  ): Task {
    const task: Task = {
      id: createHash('sha256').update(`${title}:${Date.now()}`).digest('hex').substring(0, 16),
      title,
      priority,
      status: 'pending',
      created: Date.now(),
      updated: Date.now(),
      dependencies,
      estimated_ticks: estimatedTicks,
      notes: ''
    };
    
    this.db.prepare(`
      INSERT INTO tasks (
        id, plan_id, title, priority, status, created, updated, 
        estimated_ticks, dependencies, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      task.id,
      planId,
      task.title,
      task.priority,
      task.status,
      task.created,
      task.updated,
      task.estimated_ticks,
      JSON.stringify(task.dependencies),
      task.notes
    );
    
    // Update plan
    if (this.activePlan && this.activePlan.id === planId) {
      this.activePlan.tasks.push(task);
      this.savePlan(this.activePlan);
    }
    
    return task;
  }
  
  updateTaskStatus(taskId: string, status: Task['status'], actualTicks?: number): void {
    this.db.prepare(`
      UPDATE tasks 
      SET status = ?, actual_ticks = ?, updated = ?
      WHERE id = ?
    `).run(status, actualTicks, Date.now(), taskId);
    
    // Update in-memory plan
    if (this.activePlan) {
      const task = this.activePlan.tasks.find(t => t.id === taskId);
      if (task) {
        task.status = status;
        task.updated = Date.now();
        if (actualTicks) task.actual_ticks = actualTicks;
        this.savePlan(this.activePlan);
      }
    }
  }
  
  getNextTask(): Task | null {
    if (!this.activePlan) return null;
    
    // Find highest priority pending task with no blocking dependencies
    const pendingTasks = this.activePlan.tasks
      .filter(t => t.status === 'pending')
      .filter(t => this.areDepenciesMet(t));
    
    if (pendingTasks.length === 0) return null;
    
    // Sort by priority (higher number = higher priority)
    pendingTasks.sort((a, b) => b.priority - a.priority);
    
    return pendingTasks[0];
  }
  
  private areDepenciesMet(task: Task): boolean {
    if (!this.activePlan || task.dependencies.length === 0) return true;
    
    return task.dependencies.every(depId => {
      const dependency = this.activePlan!.tasks.find(t => t.id === depId);
      return dependency?.status === 'completed';
    });
  }
  
  generateTaskFromIntention(intention: string, context?: any): Task | null {
    // Map intentions to specific tasks
    const intentionMapping: Record<string, (ctx?: any) => Task> = {
      'stabilize_creator': () => ({
        id: createHash('sha256').update(`stabilize:${Date.now()}`).digest('hex').substring(0, 16),
        title: 'Emotional stabilization sequence',
        priority: 90,
        status: 'pending',
        created: Date.now(),
        updated: Date.now(),
        dependencies: [],
        estimated_ticks: 3,
        notes: 'Reduce arousal, balance valence'
      }),
      
      'ship_smallest_safe_step': () => ({
        id: createHash('sha256').update(`ship:${Date.now()}`).digest('hex').substring(0, 16),
        title: 'Complete incremental progress',
        priority: 70,
        status: 'pending',
        created: Date.now(),
        updated: Date.now(),
        dependencies: [],
        estimated_ticks: 1,
        notes: 'Ship smallest viable improvement'
      }),
      
      'process_events': () => ({
        id: createHash('sha256').update(`events:${Date.now()}`).digest('hex').substring(0, 16),
        title: 'Process queued system events',
        priority: 60,
        status: 'pending',
        created: Date.now(),
        updated: Date.now(),
        dependencies: [],
        estimated_ticks: 2,
        notes: 'Clear event backlog'
      })
    };
    
    const generator = intentionMapping[intention];
    return generator ? generator(context) : null;
  }
  
  private savePlan(plan: Plan): void {
    plan.updated = Date.now();
    
    this.db.prepare(`
      UPDATE plans 
      SET status = ?, updated = ?, data = ?
      WHERE id = ?
    `).run(plan.status, plan.updated, JSON.stringify(plan), plan.id);
  }
  
  activatePlan(planId: string): void {
    // Deactivate current plan
    if (this.activePlan) {
      this.activePlan.status = 'draft';
      this.savePlan(this.activePlan);
    }
    
    // Load and activate new plan
    const row = this.db.prepare('SELECT * FROM plans WHERE id = ?').get(planId) as any;
    if (row) {
      this.activePlan = JSON.parse(row.data) as Plan;
      this.activePlan.status = 'active';
      this.savePlan(this.activePlan);
    }
  }
  
  getPlanStatus(): {
    activePlan: string | null;
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    estimatedTicksRemaining: number;
  } {
    if (!this.activePlan) {
      return {
        activePlan: null,
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
        estimatedTicksRemaining: 0
      };
    }
    
    const completed = this.activePlan.tasks.filter(t => t.status === 'completed').length;
    const pending = this.activePlan.tasks.filter(t => t.status === 'pending').length;
    const estimatedRemaining = this.activePlan.tasks
      .filter(t => t.status !== 'completed')
      .reduce((sum, t) => sum + t.estimated_ticks, 0);
    
    return {
      activePlan: this.activePlan.name,
      totalTasks: this.activePlan.tasks.length,
      completedTasks: completed,
      pendingTasks: pending,
      estimatedTicksRemaining: estimatedRemaining
    };
  }
}