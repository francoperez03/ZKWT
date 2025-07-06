import { useContext } from "react";
import { GroupCtx } from '../context/GroupContext';

export const useGroups = () => {
  const ctx = useContext(GroupCtx);
  if (!ctx) throw new Error("Group context missing");
  return ctx;
}; 