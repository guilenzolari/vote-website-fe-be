import { Request, Response, NextFunction } from "express";
import { RateLimitError } from "../errors/VoteError";
import { extractClientIP, hashIP } from "../utils/ipHash";
import { getRateLimitConfig } from "../utils/constants";

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};
const isProd = process.env.NODE_ENV === "production";

export function rateLimit(req: Request, res: Response, next: NextFunction) {
  try {
    // o salt é uma info extra pra trazer aleatoriedade pro hash,
    //  evitando que IPs semelhantes tenham hashes semelhantes
    const ipSalt = process.env.IP_SALT;
    if (!ipSalt) throw new Error("IP_SALT environment variable is not defined");
    const clientIP = extractClientIP(req, isProd);
    const ipHash = hashIP(clientIP, ipSalt);
    const config = getRateLimitConfig();
    const currentTime = Date.now();

    // Initialize or get existing record
    if (!store[ipHash]) {
      store[ipHash] = {
        count: 0,
        resetTime: currentTime + config.windowMs,
      };
    }

    const record = store[ipHash];

    // Verifica se o ip já ultrapassou o tempo de reset, se sim, reseta o contador
    if (currentTime > record.resetTime) {
      record.count = 0;
      record.resetTime = currentTime + config.windowMs;
    }

    // Checa se o número de requisições ultrapassou o limite permitido
    // Se sim retorna um erro informando quanto tempo falta para o reset
    if (record.count >= config.maxRequests) {
      const resetIn = Math.ceil((record.resetTime - currentTime) / 1000);
      throw new RateLimitError(
        `Rate limit exceeded. Try again in ${resetIn} seconds`,
      );
    }

    // Incrementa o contador de requisições para esse IP
    record.count++;

    // Adiciona os headers de rate limit para a resposta, para que o cliente saiba quantas requisições ainda pode fazer e quando o contador será resetado
    res.setHeader("X-RateLimit-Limit", config.maxRequests.toString());
    res.setHeader(
      "X-RateLimit-Remaining",
      (config.maxRequests - record.count).toString(),
    );
    res.setHeader(
      "X-RateLimit-Reset",
      Math.ceil(record.resetTime / 1000).toString(),
    );

    next();
  } catch (error) {
    next(error);
  }
}

// Limpa o store a cada 5 minutos para evitar crescimento infinito, removendo IPs que não fizeram requisições recentes
// Isso evita causar 'out of memory' em casos de muitos IPs únicos tentando acessar a APIs
setInterval(() => {
  const currentTime = Date.now();
  for (const key in store) {
    if (currentTime > store[key].resetTime + 300000) {
      delete store[key];
    }
  }
}, 300000);
