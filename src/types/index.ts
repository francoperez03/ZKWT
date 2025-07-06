export interface StoredGroup {
  name: string;
  depth: number;
  members: string[];
  root: string;
  createdAt: string;
}

export interface StoredIdentity {
  id: string;
  name: string;
  commitment: string;
  createdAt: string;
  // No almacenamos la clave privada por seguridad
}

export interface GroupContextType {
  groups: Record<string, StoredGroup>;
  identities: Record<string, StoredIdentity>;
  addGroup: (name: string) => string;
  addMember: (groupId: string, commitment: string) => void;
  addIdentity: (name: string, commitment: string) => string;
  removeIdentity: (identityId: string) => void;
} 