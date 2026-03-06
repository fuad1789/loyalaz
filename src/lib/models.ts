import mongoose from 'mongoose';
import connectDB from './db';

// Tenant Schema
export type TenantPlan = 'Sadə' | 'Populyar' | 'Korporativ';

export interface ITenant extends mongoose.Document {
  name: string;
  pointThreshold: number;
  isActive: boolean;
  plan: TenantPlan;
  createdAt: Date;
  updatedAt: Date;
}

const TenantSchema = new mongoose.Schema<ITenant>(
  {
    name: { type: String, required: true },
    pointThreshold: { type: Number, required: true, default: 6 },
    isActive: { type: Boolean, default: true },
    plan: { type: String, enum: ['Sadə', 'Populyar', 'Korporativ'], default: 'Sadə' },
  },
  { timestamps: true }
);

// User Schema
export type UserRole = 'super_admin' | 'tenant_admin' | 'staff';

export interface IUser extends mongoose.Document {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  tenantId: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ['super_admin', 'tenant_admin', 'staff'], required: true },
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', default: null },
  },
  { timestamps: true }
);

// Card Schema
export type CardStatus = 'inactive' | 'active';

export interface ICard extends mongoose.Document {
  uuid: string;
  tenantId: mongoose.Types.ObjectId;
  status: CardStatus;
  currentPoints: number;
  totalRedemptions: number;
  lastScannedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const CardSchema = new mongoose.Schema<ICard>(
  {
    uuid: { type: String, required: true, unique: true },
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
    status: { type: String, enum: ['inactive', 'active'], default: 'inactive' },
    currentPoints: { type: Number, default: 0 },
    totalRedemptions: { type: Number, default: 0 },
    lastScannedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Transaction Schema
export type TransactionAction = 'activation' | 'point_added' | 'reward';

export interface ITransaction extends mongoose.Document {
  cardId: mongoose.Types.ObjectId;
  tenantId: mongoose.Types.ObjectId;
  staffId: mongoose.Types.ObjectId;
  actionType: TransactionAction;
  pointsBefore: number;
  pointsAfter: number;
  createdAt: Date;
}

const TransactionSchema = new mongoose.Schema<ITransaction>(
  {
    cardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Card', required: true },
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
    staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    actionType: { type: String, enum: ['activation', 'point_added', 'reward'], required: true },
    pointsBefore: { type: Number, default: 0 },
    pointsAfter: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Models
export const Tenant = mongoose.models.Tenant || mongoose.model<ITenant>('Tenant', TenantSchema);
export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export const Card = mongoose.models.Card || mongoose.model<ICard>('Card', CardSchema);
export const Transaction = mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);

// Helper function to get models after connection
export async function getModels() {
  await connectDB();
  return {
    Tenant,
    User,
    Card,
    Transaction,
  };
}