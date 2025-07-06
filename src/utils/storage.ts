import type { StoredGroup, StoredIdentity } from '../types';

const GROUPS_KEY = "semaphore.groups";
const IDENTITIES_KEY = "semaphore.identities";

export function loadGroups(): Record<string, StoredGroup> {
  try {
    return JSON.parse(localStorage.getItem(GROUPS_KEY) || "{}");
  } catch {
    return {};
  }
}

export function saveGroups(groups: Record<string, StoredGroup>) {
  localStorage.setItem(GROUPS_KEY, JSON.stringify(groups));
}

export function loadIdentities(): Record<string, StoredIdentity> {
  try {
    return JSON.parse(localStorage.getItem(IDENTITIES_KEY) || "{}");
  } catch {
    return {};
  }
}

export function saveIdentities(identities: Record<string, StoredIdentity>) {
  localStorage.setItem(IDENTITIES_KEY, JSON.stringify(identities));
} 