import { Group } from '@semaphore-protocol/group';
import { Identity } from '@semaphore-protocol/identity';

export interface SemaphoreProof {
  merkleTreeDepth: number;
  merkleTreeRoot: string;
  nullifier: string;
  message: string;
  scope: string;
  points: string[];
}

export interface SimpleState {
  group: Group | null;
  identity: Identity | null;
  isMember: boolean;
  proof: SemaphoreProof | null;
  proofVerified: boolean | null;
  signal: string;
  externalNullifier: string;
}

export interface SimpleStepProps {
  state: SimpleState;
  onStateChange: (newState: SimpleState) => void;
  onError: (error: string) => void;
} 