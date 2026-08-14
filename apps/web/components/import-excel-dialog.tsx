"use client";

import {
  useRef,
  useState,
} from "react";

import {
  CheckCircle2,
  FileSpreadsheet,
  Upload,
  X,
} from "lucide-react";

import {
  previewExcelImport,
  importExcel,
} from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ImportExcelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImported?: () => void;
}

interface ImportPreview {
  clients: {
    total: number;
  };

  policies: {
    total: number;
  };

  matching: {
    matched: number;
    unmatched: number;
  };

  unmatchedPolicies: Array<{
    policyNumber: string;
    policyOwner: string | null;
    email: string | null;
    contactNumber: string | null;
  }>;
}

interface ImportResult {
  clients: {
    created: number;
    updated: number;
  };

  policies: {
    created: number;
    updated: number;
  };
}

export function ImportExcelDialog({
  open,
  onOpenChange,
  onImported,
}: ImportExcelDialogProps) {
  const clientsInputRef =
    useRef<HTMLInputElement>(null);

  const policiesInputRef =
    useRef<HTMLInputElement>(null);

  const [clientsFile, setClientsFile] =
    useState<File | null>(null);

  const [policiesFile, setPoliciesFile] =
    useState<File | null>(null);

  const [clientsPassword, setClientsPassword] =
    useState("");

  const [policiesPassword, setPoliciesPassword] =
    useState("");

  const [preview, setPreview] =
    useState<ImportPreview | null>(null);

  const [importResult, setImportResult] =
    useState<ImportResult | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  if (!open) {
    return null;
  }

  function reset() {
    setClientsFile(null);
    setPoliciesFile(null);

    setClientsPassword("");
    setPoliciesPassword("");

    setPreview(null);
    setImportResult(null);
    setError(null);
    setLoading(false);

    if (clientsInputRef.current) {
      clientsInputRef.current.value = "";
    }

    if (policiesInputRef.current) {
      policiesInputRef.current.value = "";
    }
  }

  function close() {
    if (loading) {
      return;
    }

    reset();
    onOpenChange(false);
  }

  function handleClientsFile(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0] ?? null;

    setClientsFile(file);
    setPreview(null);
    setImportResult(null);
    setError(null);
  }

  function handlePoliciesFile(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0] ?? null;

    setPoliciesFile(file);
    setPreview(null);
    setImportResult(null);
    setError(null);
  }

  async function handlePreview() {
    setError(null);
    setPreview(null);
    setImportResult(null);

    if (!clientsFile) {
      setError(
        "Please select the Clients Excel file.",
      );
      return;
    }

    if (!policiesFile) {
      setError(
        "Please select the Policies Excel file.",
      );
      return;
    }

    if (!clientsPassword) {
      setError(
        "Please enter the Clients Excel password.",
      );
      return;
    }

    if (!policiesPassword) {
      setError(
        "Please enter the Policies Excel password.",
      );
      return;
    }

    setLoading(true);

    try {
      const result =
        await previewExcelImport(
          clientsFile,
          clientsPassword,
          policiesFile,
          policiesPassword,
        );

      setPreview(
        result as ImportPreview,
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to validate the Excel files.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleImport() {
    if (!clientsFile || !policiesFile) {
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const result =
        await importExcel(
          clientsFile,
          clientsPassword,
          policiesFile,
          policiesPassword,
        );

      setImportResult(
        result as ImportResult,
      );

      onImported?.();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to import the Excel files.",
      );
    } finally {
      setLoading(false);
    }
  }

  /*
   * Success screen
   */
  if (importResult) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-900">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Import Complete
              </h2>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Your client and policy data has been imported.
              </p>
            </div>

            <button
              type="button"
              onClick={close}
              disabled={loading}
              aria-label="Close"
              className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-gray-800 dark:hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Result */}
          <div className="space-y-6 bg-white p-6 dark:bg-gray-900">
            <div className="text-center">
              <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />

              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                Import completed successfully
              </h3>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                The Excel data has been processed and saved.
              </p>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 gap-4">
              {/* Clients */}
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Clients
                </p>

                <div className="mt-3 space-y-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {importResult.clients.created}
                    </span>{" "}
                    created
                  </p>

                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {importResult.clients.updated}
                    </span>{" "}
                    updated
                  </p>
                </div>
              </div>

              {/* Policies */}
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Policies
                </p>

                <div className="mt-3 space-y-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {importResult.policies.created}
                    </span>{" "}
                    created
                  </p>

                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {importResult.policies.updated}
                    </span>{" "}
                    updated
                  </p>
                </div>
              </div>
            </div>

            {/* Done */}
            <div className="flex justify-end border-t border-gray-200 pt-5 dark:border-gray-700">
              <Button onClick={close}>
                Done
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /*
   * Import dialog
   */
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-xl bg-background shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold">
              Import Excel Data
            </h2>

            <p className="text-sm text-muted-foreground">
              Import clients and their policies.
            </p>
          </div>

          <button
            type="button"
            onClick={close}
            disabled={loading}
            aria-label="Close"
            className="rounded-lg p-2 transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6 p-6">
          {/* Clients Excel */}
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-medium">
                All Individual Clients
              </h3>

              <p className="text-xs text-muted-foreground">
                Select the password-protected client workbook.
              </p>
            </div>

            <input
              ref={clientsInputRef}
              type="file"
              accept=".xlsx"
              className="hidden"
              onChange={handleClientsFile}
            />

            <button
              type="button"
              onClick={() =>
                clientsInputRef.current?.click()
              }
              className="flex w-full items-center gap-3 rounded-lg border border-dashed p-4 text-left transition hover:bg-accent"
            >
              <FileSpreadsheet className="h-5 w-5 shrink-0" />

              <div className="min-w-0 flex-1">
                {clientsFile ? (
                  <>
                    <p className="truncate text-sm font-medium">
                      {clientsFile.name}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {(
                        clientsFile.size /
                        1024 /
                        1024
                      ).toFixed(2)}{" "}
                      MB
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-medium">
                      Select client Excel file
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Click to browse
                    </p>
                  </>
                )}
              </div>

              <Upload className="h-4 w-4 shrink-0" />
            </button>

            <Input
              type="password"
              placeholder="Clients Excel password"
              value={clientsPassword}
              onChange={(event) =>
                setClientsPassword(
                  event.target.value,
                )
              }
            />
          </div>

          {/* Policies Excel */}
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-medium">
                Individual Policy List
              </h3>

              <p className="text-xs text-muted-foreground">
                Select the password-protected policy workbook.
              </p>
            </div>

            <input
              ref={policiesInputRef}
              type="file"
              accept=".xlsx"
              className="hidden"
              onChange={handlePoliciesFile}
            />

            <button
              type="button"
              onClick={() =>
                policiesInputRef.current?.click()
              }
              className="flex w-full items-center gap-3 rounded-lg border border-dashed p-4 text-left transition hover:bg-accent"
            >
              <FileSpreadsheet className="h-5 w-5 shrink-0" />

              <div className="min-w-0 flex-1">
                {policiesFile ? (
                  <>
                    <p className="truncate text-sm font-medium">
                      {policiesFile.name}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {(
                        policiesFile.size /
                        1024 /
                        1024
                      ).toFixed(2)}{" "}
                      MB
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-medium">
                      Select policy Excel file
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Click to browse
                    </p>
                  </>
                )}
              </div>

              <Upload className="h-4 w-4 shrink-0" />
            </button>

            <Input
              type="password"
              placeholder="Policies Excel password"
              value={policiesPassword}
              onChange={(event) =>
                setPoliciesPassword(
                  event.target.value,
                )
              }
            />
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Preview */}
          {preview && (
            <div className="rounded-lg border p-4">
              <div className="mb-4 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />

                <p className="font-medium">
                  Files validated successfully
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {/* Clients */}
                <div className="rounded-lg bg-accent p-3">
                  <p className="text-xs text-muted-foreground">
                    Clients
                  </p>

                  <p className="mt-1 text-xl font-semibold">
                    {preview.clients.total}
                  </p>
                </div>

                {/* Policies */}
                <div className="rounded-lg bg-accent p-3">
                  <p className="text-xs text-muted-foreground">
                    Policies
                  </p>

                  <p className="mt-1 text-xl font-semibold">
                    {preview.policies.total}
                  </p>
                </div>

                {/* Matched */}
                <div className="rounded-lg bg-accent p-3">
                  <p className="text-xs text-muted-foreground">
                    Matched
                  </p>

                  <p className="mt-1 text-xl font-semibold">
                    {preview.matching.matched}
                  </p>
                </div>
              </div>

              {preview.matching.unmatched > 0 && (
                <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm">
                  {preview.matching.unmatched}{" "}
                  policies could not be matched
                  to a client.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t px-6 py-4">
          <button
            type="button"
            onClick={close}
            disabled={loading}
            className="rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          {!preview ? (
            <Button
              onClick={handlePreview}
              disabled={loading}
            >
              {loading
                ? "Validating..."
                : "Validate"}
            </Button>
          ) : (
            <Button
              onClick={handleImport}
              disabled={
                loading ||
                preview.matching.unmatched > 0
              }
            >
              {loading
                ? "Importing..."
                : "Import"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}