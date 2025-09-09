type Sev = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
type Finding = {
    id: string;
    sev: Sev;
    case: "cortana" | "clu" | "skynet" | "transcendence";
    why: string;
};
export declare function runQuadraLockCSSR(): Promise<Finding[]>;
export {};
//# sourceMappingURL=run-quadra-lock-cssr.d.ts.map