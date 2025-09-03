"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.devMode = devMode;
function devMode() {
    return process.env.NODE_ENV !== "production" && process.env.QUADRAN_DEV === "1";
}
//# sourceMappingURL=dev-flags.js.map