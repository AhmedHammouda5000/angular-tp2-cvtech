import { Service, signal } from '@angular/core';

export type ToastType = 'success' | 'danger' | 'warning' | 'info';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

@Service()
export class ToastService {
  private nextId = 0;
  private readonly toastList = signal<Toast[]>([]);
  readonly toasts = this.toastList.asReadonly();

  show(message: string, type: ToastType = 'info', duration = 4000): void {
    const toast: Toast = { id: this.nextId++, message, type };
    this.toastList.update((list) => [...list, toast]);
    setTimeout(() => this.remove(toast.id), duration);
  }

  success(message: string): void {
    this.show(message, 'success');
  }

  error(message: string): void {
    this.show(message, 'danger');
  }

  remove(id: number): void {
    this.toastList.update((list) => list.filter((t) => t.id !== id));
  }
}
