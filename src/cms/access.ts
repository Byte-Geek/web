import type { Access } from "payload";

export const isAdmin: Access = ({ req }) => Boolean(req.user);
export const anyone: Access = () => true;
export const nobody: Access = () => false;

export const adminOnly = { read: isAdmin, create: isAdmin, update: isAdmin, delete: isAdmin };
