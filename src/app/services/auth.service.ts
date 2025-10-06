// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  passwordHash: string;
  createdAt: string;
}

export interface Session {
  userId: string;
  token: string;
  createdAt: string;
}

type ResetMap = Record<string, {
  code: string;         // PIN de 6 dígitos
  expiresAt: number;    // epoch ms
  verified: boolean;    // true después de verify-pin
  attempts: number;     // control básico de intentos
}>;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private KEYS = {
    USERS: 'bn.users',
    SESSION: 'bn.session',
    RESET: 'bn.reset', // Map por email
  } as const;

  constructor(private storage: StorageService) {}

  // ---------- Helpers ----------
  private async loadUsers(): Promise<User[]> {
    return (await this.storage.get<User[]>(this.KEYS.USERS)) ?? [];
  }
  private async saveUsers(users: User[]) {
    await this.storage.set(this.KEYS.USERS, users);
  }
  private async loadReset(): Promise<ResetMap> {
    return (await this.storage.get<ResetMap>(this.KEYS.RESET)) ?? {};
  }
  private async saveReset(map: ResetMap) {
    await this.storage.set(this.KEYS.RESET, map);
  }
  private genCode(len = 6): string {
    const n = new Uint32Array(1);
    crypto.getRandomValues(n);
    return (n[0] % 10 ** len).toString().padStart(len, '0');
  }
  private async hashPassword(raw: string): Promise<string> {
    const enc = new TextEncoder().encode(raw);
    const digest = await crypto.subtle.digest('SHA-256', enc);
    const bytes = new Uint8Array(digest);
    let bin = '';
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin); // base64
  }

  // ---------- API pública ----------
  async register(data: { name: string; email: string; phone?: string; password: string; }): Promise<void> {
    const email = data.email.trim().toLowerCase();
    const users = await this.loadUsers();
    if (users.some(u => u.email === email)) {
      throw new Error('EMAIL_TAKEN');
    }
    const user: User = {
      id: crypto.randomUUID(),
      name: data.name.trim(),
      email,
      phone: data.phone?.trim(),
      passwordHash: await this.hashPassword(data.password),
      createdAt: new Date().toISOString(),
    };
    users.push(user);
    await this.saveUsers(users);
  }

  async login(email: string, password: string): Promise<void> {
    const users = await this.loadUsers();
    const user = users.find(u => u.email === email.trim().toLowerCase());
    if (!user) throw new Error('INVALID_CREDENTIALS');
    const hash = await this.hashPassword(password);
    if (hash !== user.passwordHash) throw new Error('INVALID_CREDENTIALS');

    const session: Session = {
      userId: user.id,
      token: crypto.randomUUID(), // token local de sesión
      createdAt: new Date().toISOString(),
    };
    await this.storage.set(this.KEYS.SESSION, session);
  }

  async logout(): Promise<void> {
    await this.storage.remove(this.KEYS.SESSION);
  }

  async getSession(): Promise<Session | null> {
    return this.storage.get<Session>(this.KEYS.SESSION);
  }

  // ----- Reset de contraseña flow -----
  async requestPasswordReset(email: string): Promise<{ code: string; expiresAt: number }> {
    const users = await this.loadUsers();
    const exists = users.some(u => u.email === email.trim().toLowerCase());
    if (!exists) throw new Error('EMAIL_NOT_FOUND');

    const map = await this.loadReset();
    const code = this.genCode(4);
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 min

    map[email.toLowerCase()] = { code, expiresAt, verified: false, attempts: 0 };
    await this.saveReset(map);

    // En un backend real aquí enviarías el código por email/SMS.
    return { code, expiresAt };
  }

  async verifyPin(email: string, inputCode: string): Promise<boolean> {
    const map = await this.loadReset();
    const rec = map[email.toLowerCase()];
    if (!rec) return false;
    if (Date.now() > rec.expiresAt) return false;

    rec.attempts += 1;
    const ok = rec.code === inputCode.trim();
    if (ok) rec.verified = true;
    await this.saveReset(map);
    return ok;
  }

  async resetPassword(email: string, newPassword: string): Promise<void> {
    const map = await this.loadReset();
    const rec = map[email.toLowerCase()];
    if (!rec || !rec.verified) throw new Error('RESET_NOT_VERIFIED');

    const users = await this.loadUsers();
    const idx = users.findIndex(u => u.email === email.toLowerCase());
    if (idx === -1) throw new Error('EMAIL_NOT_FOUND');

    users[idx] = { ...users[idx], passwordHash: await this.hashPassword(newPassword) };
    await this.saveUsers(users);

    // limpiar solicitud de reset
    delete map[email.toLowerCase()];
    await this.saveReset(map);
  }
}
