import { useState } from "react";
import type { ReactNode } from "react";
import { Group } from "@semaphore-protocol/group";
import { v4 as uuidv4 } from "uuid";
import type { StoredGroup, StoredIdentity } from '../types';
import { loadGroups, saveGroups, loadIdentities, saveIdentities } from '../utils/storage';
import { GroupCtx } from '../context/GroupContext';

interface GroupProviderProps {
  children: ReactNode;
}

export function GroupProvider({ children }: GroupProviderProps) {
  const [groups, setGroups] = useState<Record<string, StoredGroup>>(loadGroups());
  const [identities, setIdentities] = useState<Record<string, StoredIdentity>>(loadIdentities());

  const addGroup = (name: string) => {
    const id = uuidv4();
    const group = new Group();
    const g: StoredGroup = { 
      name, 
      depth: 20, 
      members: [], 
      root: group.root.toString(),
      createdAt: new Date().toISOString()
    };
    const newGroups = { ...groups, [id]: g };
    setGroups(newGroups);
    saveGroups(newGroups);
    return id;
  };

  const addMember = (groupId: string, commitment: string) => {
    const g = groups[groupId];
    if (!g) return;
    
    const group = new Group(g.members.map(BigInt));
    group.addMember(BigInt(commitment));
    
    const updated = {
      ...groups,
      [groupId]: { 
        ...g, 
        members: group.members.map(m => m.toString()), 
        root: group.root.toString() 
      },
    };
    setGroups(updated);
    saveGroups(updated);
  };

  const addIdentity = (name: string, commitment: string) => {
    const id = uuidv4();
    const identity: StoredIdentity = {
      id,
      name,
      commitment,
      createdAt: new Date().toISOString()
    };
    const newIdentities = { ...identities, [id]: identity };
    setIdentities(newIdentities);
    saveIdentities(newIdentities);
    return id;
  };

  const removeIdentity = (identityId: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [identityId]: _, ...remaining } = identities;
    setIdentities(remaining);
    saveIdentities(remaining);
  };

  return (
    <GroupCtx.Provider value={{ 
      groups, 
      identities, 
      addGroup, 
      addMember, 
      addIdentity, 
      removeIdentity 
    }}>
      {children}
    </GroupCtx.Provider>
  );
} 