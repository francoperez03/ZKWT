import { Identity } from '@semaphore-protocol/identity';
import { Group } from '@semaphore-protocol/group';
import type { SimpleState } from './types';

// Helper para obtener el secreto de la identidad
export const getIdentitySecret = (identity: Identity): string => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const identityAny = identity as any;
    return identityAny._secretScalar?.toString() || identityAny.secretScalar?.toString() || 'ERROR_SECRET';
  } catch {
    return 'ERROR_SECRET';
  }
};

// Guardar estado en localStorage
export const saveState = (state: SimpleState) => {
  const stateToSave = {
    group: state.group ? {
      members: state.group.members.map(member => member.toString())
    } : null,
    identity: state.identity ? getIdentitySecret(state.identity) : null,
    isMember: state.isMember,
    proof: state.proof
  };
  localStorage.setItem('simple-demo-state', JSON.stringify(stateToSave));
};

// Cargar estado desde localStorage
export const loadState = (): SimpleState => {
  const savedState = localStorage.getItem('simple-demo-state');
  if (!savedState) {
    return {
      group: null,
      identity: null,
      isMember: false,
      proof: null
    };
  }

  try {
    const parsed = JSON.parse(savedState);
    const loadedState: SimpleState = {
      group: parsed.group ? new Group(parsed.group.members.map(BigInt)) : null,
      identity: parsed.identity ? new Identity(parsed.identity) : null,
      isMember: parsed.isMember || false,
      proof: parsed.proof || null
    };
    
    // Verificar y sincronizar la membresía después de cargar
    if (loadedState.group && loadedState.identity && loadedState.isMember) {
      const identityInGroup = loadedState.group.members.some(
        member => member.toString() === loadedState.identity!.commitment.toString()
      );
      
      if (!identityInGroup) {
        // Si dice que es miembro pero no está en el grupo, agregarlo
        loadedState.group.addMember(loadedState.identity.commitment);
      }
    }
    
    return loadedState;
  } catch (error) {
    console.error('Error loading simple demo state:', error);
    return {
      group: null,
      identity: null,
      isMember: false,
      proof: null
    };
  }
}; 