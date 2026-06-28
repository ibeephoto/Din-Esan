import { state } from './state.js';
import { CONFIG } from './config.js';

export function enqueueSync(type, payload) {
  state.queue.push({
    id: crypto.randomUUID(),
    type,
    payload,
    retry: 0,
    ts: Date.now()
  });
  processQueue();
}

export async function processQueue() {
  if (!navigator.onLine) return;

  while (state.queue.length > 0) {
    const job = state.queue[0];

    try {
      await fetch(CONFIG.GAS_URL, {
        method: "POST",
        body: JSON.stringify(job)
      });

      state.queue.shift();
    } catch (e) {
      job.retry++;
      if (job.retry > 5) state.queue.shift();
      break;
    }
  }
}
