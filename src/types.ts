export enum UserRole {
  PATIENT = 'patient',
  DOCTOR = 'doctor',
}

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: number;
  onboarded: boolean;
  // Role specific fields
  age?: number;
  gender?: string;
  bloodGroup?: string;
  address?: string;
  degree?: string;
  weight?: string;
  height?: string;
  sharingEnabled?: boolean;
}

export enum RecordType {
  PRESCRIPTION = 'prescription',
  REPORT = 'report',
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  fileURL: string;
  fileName: string;
  type: RecordType;
  createdAt: number;
}
