import { apiFetch } from './api';

export interface Client {
  id: string;
  name: string;
  email: string;
  contactNumber: string | null;
  location: string | null;
  dateOfBirth: string | null;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
}

export interface CreateClientInput {
  name: string;
  email: string;
  contactNumber?: string;
  location?: string;
  dateOfBirth?: string;
}

export interface UpdateClientInput {
  name?: string;
  email?: string;
  contactNumber?: string;
  location?: string;
  dateOfBirth?: string;
}

export interface Policy {
  id: string;
  policyNumber: string;
  clientId: string;

  policyOwner: string;
  insured: string;

  issueDate: string | null;
  policyType: string | null;
  policyName: string | null;
  policyCurrency: string | null;

  faceAmount: string | null;

  premiumMode: string | null;
  premiumAmount: string | null;
  excessPremium: string | null;
  totalPremium: string | null;

  premiumDueDate: string | null;

  lastPaymentAmount: string | null;
  lastPaymentDate: string | null;

  vulTotalPaymentsMade: string | null;

  policyStatus: string | null;
  lapseCeaseDate: string | null;

  policyAdvanceBalance: string | null;
  prepaidAmount: string | null;
  fundCashValue: string | null;
  fundCashValueAsOfDate: string | null;

  contactNumber: string | null;
  email: string | null;
  billingAddress: string | null;

  createdAt: string;
  updatedAt: string;
}

export async function getClient(
  id: string,
): Promise<Client> {
  return apiFetch<Client>(`/api/clients/${id}`);
}

export async function getClientPolicies(
  clientId: string,
): Promise<Policy[]> {
  return apiFetch<Policy[]>(
    `/api/clients/${clientId}/policies`,
  );
}

export interface CreatePolicyInput {
  policyNumber: string;
  policyOwner: string;
  insured: string;

  issueDate?: string;
  policyType?: string;
  policyName?: string;
  policyCurrency?: string;

  faceAmount?: string;

  premiumMode?: string;
  premiumAmount?: string;
  excessPremium?: string;
  totalPremium?: string;

  premiumDueDate?: string;

  lastPaymentAmount?: string;
  lastPaymentDate?: string;

  vulTotalPaymentsMade?: string;

  policyStatus?: string;
  lapseCeaseDate?: string;

  policyAdvanceBalance?: string;
  prepaidAmount?: string;
  fundCashValue?: string;
  fundCashValueAsOfDate?: string;

  contactNumber?: string;
  email?: string;
  billingAddress?: string;
}

export async function createPolicy(
  clientId: string,
  data: CreatePolicyInput,
): Promise<Policy> {
  return apiFetch<Policy>(
    `/api/clients/${clientId}/policies`,
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
  );
}

export async function getClients(): Promise<Client[]> {
  return apiFetch<Client[]>('/api/clients');
}

export async function createClient(
  data: CreateClientInput,
): Promise<Client> {
  return apiFetch<Client>('/api/clients', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateClient(
  id: string,
  data: UpdateClientInput,
): Promise<Client> {
  return apiFetch<Client>(`/api/clients/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteClient(
  id: string,
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(
    `/api/clients/${id}`,
    {
      method: 'DELETE',
    },
  );
}

