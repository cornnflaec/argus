'use client';

import { useEffect, useState } from 'react';

import {
  Client,
  CreateClientInput,
  createClient,
  getClients,
} from '@/lib/clients';

import { ImportExcelDialog } from '@/components/import-excel-dialog';

import Link from 'next/link';

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showAddClient, setShowAddClient] =
    useState(false);

  const [saving, setSaving] = useState(false);

  const [importOpen, setImportOpen] =
    useState(false);

  const [form, setForm] =
    useState<CreateClientInput>({
      name: '',
      email: '',
      contactNumber: '',
      location: '',
      dateOfBirth: '',
    });

  useEffect(() => {
    loadClients();
  }, []);

  async function loadClients() {
    try {
      setLoading(true);
      setError('');

      const data = await getClients();

      setClients(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Unable to load clients',
      );
    } finally {
      setLoading(false);
    }
  }

  function updateField(
    field: keyof CreateClientInput,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function resetForm() {
    setForm({
      name: '',
      email: '',
      contactNumber: '',
      location: '',
      dateOfBirth: '',
    });
  }

  function closeAddClient() {
    if (saving) {
      return;
    }

    setShowAddClient(false);
    resetForm();
  }

  async function handleCreateClient(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    try {
      setSaving(true);
      setError('');

      const client = await createClient({
        name: form.name.trim(),
        email: form.email.trim(),
        contactNumber:
          form.contactNumber?.trim() || undefined,
        location:
          form.location?.trim() || undefined,
        dateOfBirth:
          form.dateOfBirth || undefined,
      });

      setClients((current) =>
        [...current, client].sort((a, b) =>
          a.name.localeCompare(b.name),
        ),
      );

      setShowAddClient(false);
      resetForm();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Unable to create client',
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div>
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              Clients
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage your client information.
            </p>
          </div>

          <div className="flex gap-3">
            {/* Import Excel */}
            <button
              type="button"
              onClick={() => setImportOpen(true)}
              className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent"
            >
              Import Excel
            </button>

            {/* Add Client */}
            <button
              type="button"
              onClick={() =>
                setShowAddClient(true)
              }
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Add Client
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg bg-[#FF6B6B]/10 p-4 text-sm text-[#c73d3d]">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="rounded-xl border p-8 text-center">
            <p className="text-sm text-muted-foreground">
              Loading clients...
            </p>
          </div>
        )}

        {/* Empty state */}
        {!loading &&
          !error &&
          clients.length === 0 && (
            <div className="rounded-xl border border-dashed p-12 text-center">
              <h2 className="font-semibold">
                No clients yet
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Add your first client to get started.
              </p>

              <button
                type="button"
                onClick={() =>
                  setShowAddClient(true)
                }
                className="mt-5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Add Client
              </button>
            </div>
          )}

        {/* Client table */}
        {!loading &&
          !error &&
          clients.length > 0 && (
            <div className="overflow-hidden rounded-xl border bg-card">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        Name
                      </th>

                      <th className="px-4 py-3 text-left text-sm font-medium">
                        Email
                      </th>

                      <th className="px-4 py-3 text-left text-sm font-medium">
                        Contact
                      </th>

                      <th className="px-4 py-3 text-left text-sm font-medium">
                        Location
                      </th>

                      <th className="px-4 py-3 text-left text-sm font-medium">
                        Date of Birth
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {clients.map((client) => (
                      <tr
                        key={client.id}
                        className="border-b last:border-0 hover:bg-muted/30"
                      >
                        <td className="px-4 py-3 text-sm font-medium">
                          <Link
                            href={`/dashboard/clients/${client.id}`}
                            className="hover:underline"
                          >
                            {client.name}
                          </Link>
                        </td>

                        <td className="px-4 py-3 text-sm">
                          {client.email}
                        </td>

                        <td className="px-4 py-3 text-sm">
                          {client.contactNumber ??
                            '—'}
                        </td>

                        <td className="px-4 py-3 text-sm">
                          {client.location ?? '—'}
                        </td>

                        <td className="px-4 py-3 text-sm">
                          {client.dateOfBirth
                            ? new Date(
                                client.dateOfBirth,
                              ).toLocaleDateString()
                            : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
      </div>

      {/* Add Client Modal */}
      {showAddClient && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeAddClient();
            }
          }}
        >
          <div className="w-full max-w-lg rounded-xl border bg-background shadow-xl">
            {/* Modal header */}
            <div className="border-b p-6">
              <h2 className="text-lg font-semibold">
                Add Client
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Add a client to your private workspace.
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleCreateClient}
              className="space-y-5 p-6"
            >
              {/* Name */}
              <div>
                <label
                  htmlFor="client-name"
                  className="mb-2 block text-sm font-medium"
                >
                  Client Name
                </label>

                <input
                  id="client-name"
                  type="text"
                  value={form.name}
                  onChange={(event) =>
                    updateField(
                      'name',
                      event.target.value,
                    )
                  }
                  placeholder="Juan Dela Cruz"
                  required
                  maxLength={150}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="client-email"
                  className="mb-2 block text-sm font-medium"
                >
                  Email Address
                </label>

                <input
                  id="client-email"
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    updateField(
                      'email',
                      event.target.value,
                    )
                  }
                  placeholder="client@example.com"
                  required
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Contact */}
              <div>
                <label
                  htmlFor="client-contact"
                  className="mb-2 block text-sm font-medium"
                >
                  Contact Number
                </label>

                <input
                  id="client-contact"
                  type="tel"
                  value={form.contactNumber}
                  onChange={(event) =>
                    updateField(
                      'contactNumber',
                      event.target.value,
                    )
                  }
                  placeholder="09171234567"
                  maxLength={30}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Location */}
              <div>
                <label
                  htmlFor="client-location"
                  className="mb-2 block text-sm font-medium"
                >
                  Location
                </label>

                <input
                  id="client-location"
                  type="text"
                  value={form.location}
                  onChange={(event) =>
                    updateField(
                      'location',
                      event.target.value,
                    )
                  }
                  placeholder="Lipa, Batangas"
                  maxLength={255}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Date of birth */}
              <div>
                <label
                  htmlFor="client-date-of-birth"
                  className="mb-2 block text-sm font-medium"
                >
                  Date of Birth
                </label>

                <input
                  id="client-date-of-birth"
                  type="date"
                  value={form.dateOfBirth}
                  onChange={(event) =>
                    updateField(
                      'dateOfBirth',
                      event.target.value,
                    )
                  }
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 border-t pt-5">
                <button
                  type="button"
                  onClick={closeAddClient}
                  disabled={saving}
                  className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? 'Saving...'
                    : 'Save Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Import Excel Modal */}
      <ImportExcelDialog
        open={importOpen}
        onOpenChange={setImportOpen}
        onImported={loadClients}
      />
    </>
  );
}