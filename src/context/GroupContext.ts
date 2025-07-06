import { createContext } from "react";
import type { GroupContextType } from '../types';

export const GroupCtx = createContext<GroupContextType | null>(null); 