'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  X,
} from 'lucide-react';

import {
  Client,
  Policy,
  CreatePolicyInput,
  getClient,
  getClientPolicies,
  createPolicy,
} from '@/lib/clients';

interface ClientDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

const emptyPolicyForm: CreatePolicyInput = {
  policyNumber: '',
  policyOwner: '',
  insured: '',

  issueDate: '',
  policyType: '',
  policyName: '',
  policyCurrency: 'PHP',

  faceAmount: '',

  premiumMode: '',
  premiumAmount: '',
  excessPremium: '',
  totalPremium: '',

  premiumDueDate: '',

  lastPaymentAmount: '',
  lastPaymentDate: '',

  vulTotalPaymentsMade: '',

  policyStatus: '',
  lapseCeaseDate: '',

  policyAdvanceBalance: '',
  prepaidAmount: '',
  fundCashValue: '',
  fundCashValueAsOfDate: '',

  contactNumber: '',
  email: '',
  billingAddress: '',
};

export default function ClientDetailPage({
  params,
}: ClientDetailPageProps) {
  const [client, setClient] =
    useState<Client | null>(null);

  const [policies, setPolicies] =
    useState<Policy[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [showAddPolicy, setShowAddPolicy] =
    useState(false);

  const [savingPolicy, setSavingPolicy] =
    useState(false);

  const [policyError, setPolicyError] =
    useState('');

  const [policyForm, setPolicyForm] =
    useState<CreatePolicyInput>(
      emptyPolicyForm,
    );

  const [clientId, setClientId] =
    useState('');

  useEffect(() => {
    loadClient();
  }, []);

  async function loadClient() {
    try {
      setLoading(true);
      setError('');

      const { id } = await params;

      setClientId(id);

      const [
        clientData,
        policiesData,
      ] = await Promise.all([
        getClient(id),
        getClientPolicies(id),
      ]);

      setClient(clientData);
      setPolicies(policiesData);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Unable to load client',
      );
    } finally {
      setLoading(false);
    }
  }

  function updatePolicyField(
    field: keyof CreatePolicyInput,
    value: string,
  ) {
    setPolicyForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function openAddPolicy() {
    setPolicyError('');

    setPolicyForm({
      ...emptyPolicyForm,

      // Automatically use the client's
      // information where appropriate.
      policyOwner: client?.name ?? '',
      contactNumber:
        client?.contactNumber ?? '',
      email: client?.email ?? '',
    });

    setShowAddPolicy(true);
  }

  function closeAddPolicy() {
    if (savingPolicy) {
      return;
    }

    setShowAddPolicy(false);
    setPolicyError('');

    setPolicyForm({
      ...emptyPolicyForm,
    });
  }

  async function handleCreatePolicy(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!clientId) {
      setPolicyError(
        'Client ID is missing.',
      );
      return;
    }

    try {
      setSavingPolicy(true);
      setPolicyError('');

      const cleanedData: CreatePolicyInput = {
        policyNumber:
          policyForm.policyNumber.trim(),

        policyOwner:
          policyForm.policyOwner.trim(),

        insured:
          policyForm.insured.trim(),

        issueDate:
          policyForm.issueDate || undefined,

        policyType:
          policyForm.policyType?.trim() ||
          undefined,

        policyName:
          policyForm.policyName?.trim() ||
          undefined,

        policyCurrency:
          policyForm.policyCurrency?.trim() ||
          undefined,

        faceAmount:
          policyForm.faceAmount?.trim() ||
          undefined,

        premiumMode:
          policyForm.premiumMode?.trim() ||
          undefined,

        premiumAmount:
          policyForm.premiumAmount?.trim() ||
          undefined,

        excessPremium:
          policyForm.excessPremium?.trim() ||
          undefined,

        totalPremium:
          policyForm.totalPremium?.trim() ||
          undefined,

        premiumDueDate:
          policyForm.premiumDueDate ||
          undefined,

        lastPaymentAmount:
          policyForm.lastPaymentAmount?.trim() ||
          undefined,

        lastPaymentDate:
          policyForm.lastPaymentDate ||
          undefined,

        vulTotalPaymentsMade:
          policyForm.vulTotalPaymentsMade?.trim() ||
          undefined,

        policyStatus:
          policyForm.policyStatus?.trim() ||
          undefined,

        lapseCeaseDate:
          policyForm.lapseCeaseDate ||
          undefined,

        policyAdvanceBalance:
          policyForm.policyAdvanceBalance?.trim() ||
          undefined,

        prepaidAmount:
          policyForm.prepaidAmount?.trim() ||
          undefined,

        fundCashValue:
          policyForm.fundCashValue?.trim() ||
          undefined,

        fundCashValueAsOfDate:
          policyForm.fundCashValueAsOfDate ||
          undefined,

        contactNumber:
          policyForm.contactNumber?.trim() ||
          undefined,

        email:
          policyForm.email?.trim() ||
          undefined,

        billingAddress:
          policyForm.billingAddress?.trim() ||
          undefined,
      };

      const newPolicy =
        await createPolicy(
          clientId,
          cleanedData,
        );

      setPolicies((current) =>
        [...current, newPolicy].sort(
          (a, b) =>
            a.policyNumber.localeCompare(
              b.policyNumber,
            ),
        ),
      );

      closeAddPolicy();
    } catch (error) {
      setPolicyError(
        error instanceof Error
          ? error.message
          : 'Unable to create policy',
      );
    } finally {
      setSavingPolicy(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-sm text-muted-foreground">
          Loading client...
        </p>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div>
        <Link
          href="/dashboard/clients"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Clients
        </Link>

        <div className="rounded-lg bg-[#FF6B6B]/10 p-4 text-sm text-[#c73d3d]">
          {error || 'Client not found'}
        </div>
      </div>
    );
  }

  return (
    <>
      <div>
        {/* Back */}
        <Link
          href="/dashboard/clients"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Clients
        </Link>

        {/* Client Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold">
            {client.name}
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Client information and policies
          </p>
        </div>

        {/* Client Information */}
        <div className="mb-8 rounded-xl border bg-card p-6">
          <h2 className="mb-5 font-semibold">
            Client Information
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-xs text-muted-foreground">
                Email
              </p>

              <p className="mt-1 text-sm">
                {client.email}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Contact Number
              </p>

              <p className="mt-1 text-sm">
                {client.contactNumber ?? '—'}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Location
              </p>

              <p className="mt-1 text-sm">
                {client.location ?? '—'}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Date of Birth
              </p>

              <p className="mt-1 text-sm">
                {client.dateOfBirth
                  ? new Date(
                      client.dateOfBirth,
                    ).toLocaleDateString()
                  : '—'}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Policies
              </p>

              <p className="mt-1 text-sm font-medium">
                {policies.length}
              </p>
            </div>
          </div>
        </div>

        {/* Policies */}
        <div>
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                Policies
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Policies associated with this client.
              </p>
            </div>

            <button
              type="button"
              onClick={openAddPolicy}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Add Policy
            </button>
          </div>

          {policies.length === 0 ? (
            <div className="rounded-xl border border-dashed p-10 text-center">
              <h3 className="font-medium">
                No policies
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                This client doesn't have any policies yet.
              </p>

              <button
                type="button"
                onClick={openAddPolicy}
                className="mt-5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Add Policy
              </button>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border bg-card">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        Policy Number
                      </th>

                      <th className="px-4 py-3 text-left text-sm font-medium">
                        Policy Name
                      </th>

                      <th className="px-4 py-3 text-left text-sm font-medium">
                        Type
                      </th>

                      <th className="px-4 py-3 text-left text-sm font-medium">
                        Premium
                      </th>

                      <th className="px-4 py-3 text-left text-sm font-medium">
                        Due Date
                      </th>

                      <th className="px-4 py-3 text-left text-sm font-medium">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {policies.map((policy) => (
                      <tr
                        key={policy.id}
                        className="border-b last:border-0 hover:bg-muted/30"
                      >
                        <td className="px-4 py-3 text-sm font-medium">
                          {policy.policyNumber}
                        </td>

                        <td className="px-4 py-3 text-sm">
                          {policy.policyName ?? '—'}
                        </td>

                        <td className="px-4 py-3 text-sm">
                          {policy.policyType ?? '—'}
                        </td>

                        <td className="px-4 py-3 text-sm">
                          {policy.premiumAmount
                            ? `${policy.policyCurrency ?? ''} ${policy.premiumAmount}`
                            : '—'}
                        </td>

                        <td className="px-4 py-3 text-sm">
                          {policy.premiumDueDate
                            ? new Date(
                                policy.premiumDueDate,
                              ).toLocaleDateString()
                            : '—'}
                        </td>

                        <td className="px-4 py-3 text-sm">
                          {policy.policyStatus ?? '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Policy Modal */}
      {showAddPolicy && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeAddPolicy();
            }
          }}
        >
          <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border bg-white shadow-2xl dark:bg-gray-900">
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-4 dark:bg-gray-900">
              <div>
                <h2 className="text-lg font-semibold">
                  Add Policy
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Add a policy for {client.name}.
                </p>
              </div>

              <button
                type="button"
                onClick={closeAddPolicy}
                disabled={savingPolicy}
                aria-label="Close"
                className="rounded-lg p-2 hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form
              onSubmit={handleCreatePolicy}
              className="space-y-8 p-6"
            >
              {/* Error */}
              {policyError && (
                <div className="rounded-lg bg-[#FF6B6B]/10 p-4 text-sm text-[#c73d3d]">
                  {policyError}
                </div>
              )}

              {/* Policy Information */}
              <section>
                <h3 className="mb-4 font-semibold">
                  Policy Information
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Policy Number *
                    </label>

                    <input
                      type="text"
                      value={policyForm.policyNumber}
                      onChange={(event) =>
                        updatePolicyField(
                          'policyNumber',
                          event.target.value,
                        )
                      }
                      required
                      maxLength={100}
                      className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Policy Owner *
                    </label>

                    <input
                      type="text"
                      value={policyForm.policyOwner}
                      onChange={(event) =>
                        updatePolicyField(
                          'policyOwner',
                          event.target.value,
                        )
                      }
                      required
                      maxLength={150}
                      className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Insured *
                    </label>

                    <input
                      type="text"
                      value={policyForm.insured}
                      onChange={(event) =>
                        updatePolicyField(
                          'insured',
                          event.target.value,
                        )
                      }
                      required
                      maxLength={150}
                      className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Issue Date
                    </label>

                    <input
                      type="date"
                      value={policyForm.issueDate ?? ''}
                      onChange={(event) =>
                        updatePolicyField(
                          'issueDate',
                          event.target.value,
                        )
                      }
                      className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Policy Type
                    </label>

                    <input
                      type="text"
                      value={policyForm.policyType ?? ''}
                      onChange={(event) =>
                        updatePolicyField(
                          'policyType',
                          event.target.value,
                        )
                      }
                      placeholder="TRAD / VUL"
                      className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Policy Name
                    </label>

                    <input
                      type="text"
                      value={policyForm.policyName ?? ''}
                      onChange={(event) =>
                        updatePolicyField(
                          'policyName',
                          event.target.value,
                        )
                      }
                      className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Currency
                    </label>

                    <input
                      type="text"
                      value={policyForm.policyCurrency ?? ''}
                      onChange={(event) =>
                        updatePolicyField(
                          'policyCurrency',
                          event.target.value,
                        )
                      }
                      placeholder="PHP"
                      className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Face Amount
                    </label>

                    <input
                      type="number"
                      value={policyForm.faceAmount ?? ''}
                      onChange={(event) =>
                        updatePolicyField(
                          'faceAmount',
                          event.target.value,
                        )
                      }
                      min="0"
                      step="0.01"
                      className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </section>

              {/* Premium */}
              <section>
                <h3 className="mb-4 font-semibold">
                  Premium
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Premium Mode
                    </label>

                    <input
                      type="text"
                      value={policyForm.premiumMode ?? ''}
                      onChange={(event) =>
                        updatePolicyField(
                          'premiumMode',
                          event.target.value,
                        )
                      }
                      placeholder="Yearly"
                      className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Premium Amount
                    </label>

                    <input
                      type="number"
                      value={policyForm.premiumAmount ?? ''}
                      onChange={(event) =>
                        updatePolicyField(
                          'premiumAmount',
                          event.target.value,
                        )
                      }
                      min="0"
                      step="0.01"
                      className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Excess Premium
                    </label>

                    <input
                      type="number"
                      value={policyForm.excessPremium ?? ''}
                      onChange={(event) =>
                        updatePolicyField(
                          'excessPremium',
                          event.target.value,
                        )
                      }
                      min="0"
                      step="0.01"
                      className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Total Premium
                    </label>

                    <input
                      type="number"
                      value={policyForm.totalPremium ?? ''}
                      onChange={(event) =>
                        updatePolicyField(
                          'totalPremium',
                          event.target.value,
                        )
                      }
                      min="0"
                      step="0.01"
                      className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Premium Due Date
                    </label>

                    <input
                      type="date"
                      value={policyForm.premiumDueDate ?? ''}
                      onChange={(event) =>
                        updatePolicyField(
                          'premiumDueDate',
                          event.target.value,
                        )
                      }
                      className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Last Payment Amount
                    </label>

                    <input
                      type="number"
                      value={policyForm.lastPaymentAmount ?? ''}
                      onChange={(event) =>
                        updatePolicyField(
                          'lastPaymentAmount',
                          event.target.value,
                        )
                      }
                      min="0"
                      step="0.01"
                      className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Last Payment Date
                    </label>

                    <input
                      type="date"
                      value={policyForm.lastPaymentDate ?? ''}
                      onChange={(event) =>
                        updatePolicyField(
                          'lastPaymentDate',
                          event.target.value,
                        )
                      }
                      className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      VUL Total Payments Made
                    </label>

                    <input
                      type="number"
                      value={
                        policyForm.vulTotalPaymentsMade ??
                        ''
                      }
                      onChange={(event) =>
                        updatePolicyField(
                          'vulTotalPaymentsMade',
                          event.target.value,
                        )
                      }
                      min="0"
                      step="1"
                      className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </section>

              {/* Policy Status */}
              <section>
                <h3 className="mb-4 font-semibold">
                  Policy Status
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Policy Status
                    </label>

                    <input
                      type="text"
                      value={policyForm.policyStatus ?? ''}
                      onChange={(event) =>
                        updatePolicyField(
                          'policyStatus',
                          event.target.value,
                        )
                      }
                      placeholder="Premium paying"
                      className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Lapse/Cease Date
                    </label>

                    <input
                      type="date"
                      value={policyForm.lapseCeaseDate ?? ''}
                      onChange={(event) =>
                        updatePolicyField(
                          'lapseCeaseDate',
                          event.target.value,
                        )
                      }
                      className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </section>

              {/* Financial Values */}
              <section>
                <h3 className="mb-4 font-semibold">
                  Financial Values
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Policy Advance Balance
                    </label>

                    <input
                      type="number"
                      value={
                        policyForm.policyAdvanceBalance ??
                        ''
                      }
                      onChange={(event) =>
                        updatePolicyField(
                          'policyAdvanceBalance',
                          event.target.value,
                        )
                      }
                      min="0"
                      step="0.01"
                      className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Prepaid Amount
                    </label>

                    <input
                      type="number"
                      value={
                        policyForm.prepaidAmount ?? ''
                      }
                      onChange={(event) =>
                        updatePolicyField(
                          'prepaidAmount',
                          event.target.value,
                        )
                      }
                      min="0"
                      step="0.01"
                      className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Fund/Cash Value
                    </label>

                    <input
                      type="number"
                      value={
                        policyForm.fundCashValue ?? ''
                      }
                      onChange={(event) =>
                        updatePolicyField(
                          'fundCashValue',
                          event.target.value,
                        )
                      }
                      min="0"
                      step="0.01"
                      className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Fund/Cash Value As Of Date
                    </label>

                    <input
                      type="date"
                      value={
                        policyForm.fundCashValueAsOfDate ??
                        ''
                      }
                      onChange={(event) =>
                        updatePolicyField(
                          'fundCashValueAsOfDate',
                          event.target.value,
                        )
                      }
                      className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </section>

              {/* Contact / Billing */}
              <section>
                <h3 className="mb-4 font-semibold">
                  Contact & Billing
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Contact Number
                    </label>

                    <input
                      type="text"
                      value={
                        policyForm.contactNumber ?? ''
                      }
                      onChange={(event) =>
                        updatePolicyField(
                          'contactNumber',
                          event.target.value,
                        )
                      }
                      className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Email
                    </label>

                    <input
                      type="email"
                      value={policyForm.email ?? ''}
                      onChange={(event) =>
                        updatePolicyField(
                          'email',
                          event.target.value,
                        )
                      }
                      className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-medium">
                      Billing Address
                    </label>

                    <textarea
                      value={
                        policyForm.billingAddress ??
                        ''
                      }
                      onChange={(event) =>
                        updatePolicyField(
                          'billingAddress',
                          event.target.value,
                        )
                      }
                      rows={3}
                      className="w-full resize-none rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </section>

              {/* Actions */}
              <div className="flex justify-end gap-3 border-t pt-5">
                <button
                  type="button"
                  onClick={closeAddPolicy}
                  disabled={savingPolicy}
                  className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={savingPolicy}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {savingPolicy
                    ? 'Saving...'
                    : 'Save Policy'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}