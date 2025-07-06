import { useState, useEffect } from 'react';
import type { SimpleState } from './types';
import { saveState, loadState } from './utils';

const initialState: SimpleState = {
  group: null,
  identity: null,
  isMember: false,
  proof: null,
  proofVerified: null,
  signal: 'Voto_A',
  externalNullifier: 'eleccion_presidente_2024'
};

export const useSimpleDemo = () => {
  const [state, setState] = useState<SimpleState>(initialState);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Cargar estado desde localStorage al inicializar
  useEffect(() => {
    const savedState = loadState();
    if (savedState) {
      setState(prevState => ({
        ...prevState,
        ...savedState,
        // Resetear campos de verificación al cargar
        proofVerified: null
      }));
    }
  }, []);

  // Guardar estado en localStorage cuando cambie
  useEffect(() => {
    if (state.group || state.identity) {
      saveState(state);
    }
  }, [state]);

  const updateState = (newState: SimpleState) => {
    setState(newState);
  };

  const handleError = (error: string) => {
    setErrorMessage(error);
  };

  const clearError = () => {
    setErrorMessage('');
  };

  const resyncState = () => {
    const savedState = loadState();
    if (savedState) {
      setState(prevState => ({
        ...prevState,
        ...savedState,
        // Resetear verificación al resincronizar
        proofVerified: null
      }));
      console.log('Estado resincronizado desde localStorage');
    }
  };

  const clearState = () => {
    setState(initialState);
    localStorage.removeItem('simple-demo-state');
    setErrorMessage('');
    console.log('Estado limpiado');
  };

  return {
    state,
    errorMessage,
    updateState,
    handleError,
    clearError,
    resyncState,
    clearState
  };
}; 