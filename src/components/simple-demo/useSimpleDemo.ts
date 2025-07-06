import { useState, useEffect } from 'react';
import { Group } from '@semaphore-protocol/group';
import { Identity } from '@semaphore-protocol/identity';
import type { SimpleState } from './types';
import { saveState } from './utils';

export const useSimpleDemo = () => {
  const [state, setState] = useState<SimpleState>({
    group: null,
    identity: null,
    isMember: false,
    proof: null
  });
  
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Cargar estado desde localStorage al iniciar
  useEffect(() => {
    const savedState = localStorage.getItem('simple-demo-state');
    if (savedState) {
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
        
        setState(loadedState);
      } catch (error) {
        console.error('Error loading simple demo state:', error);
      }
    }
  }, []);

  // Función para actualizar el estado y guardarlo
  const updateState = (newState: SimpleState) => {
    setState(newState);
    saveState(newState);
  };

  // Función para manejar errores
  const handleError = (error: string) => {
    setErrorMessage(error);
  };

  // Función para limpiar errores
  const clearError = () => {
    setErrorMessage('');
  };

  return {
    state,
    errorMessage,
    updateState,
    handleError,
    clearError
  };
}; 