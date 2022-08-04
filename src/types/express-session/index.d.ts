import "express-session";

declare module "express-session" {
    // You can also use interface SessionData instead
    interface SessionData {
        username?: string
    }
}