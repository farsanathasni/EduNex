import type { Response } from "express";

const clients = new Map<string, Set<Response>>();

export function addClient(userId: string, res: Response) {
  if (!clients.has(userId)) clients.set(userId, new Set());
  clients.get(userId)!.add(res);
}

export function removeClient(userId: string, res: Response) {
  const set = clients.get(userId);
  set?.delete(res);
  if (set && set.size === 0) clients.delete(userId);
}

export function sendToUser(userId: string, data: unknown) {
  clients.get(userId)?.forEach((res) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  });
}