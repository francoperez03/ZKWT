import { Group } from '@semaphore-protocol/group';
import { Identity } from '@semaphore-protocol/identity';

export interface SimpleState {
  group: Group | null;
  identity: Identity | null;
  isMember: boolean;
  proof: string | null;
}

export interface SimpleStepProps {
  state: SimpleState;
  onStateChange: (newState: SimpleState) => void;
  onError: (error: string) => void;
} 