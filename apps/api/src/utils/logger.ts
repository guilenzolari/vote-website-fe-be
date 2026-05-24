const isDev = process.env.NODE_ENV === "development";

export const log = {
  debug: (message: string, ...args: any[]) => {
    if (isDev && process.env.LOG_LEVEL === "debug") {
      console.log(`[Debug] ${message}`, ...args);
    }
  },
  info: (message: string, ...args: any[]) => {
    console.log(`[Info] ${message}`, ...args);
  },
  error: (message: string, ...args: any[]) => {
    console.error(`[Error] ${message}`, ...args);
  },
};
