const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  'http://localhost:3001';

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const isFormData =
    options.body instanceof FormData;

  const headers = new Headers(
    options.headers,
  );

  if (!isFormData) {
    headers.set(
      'Content-Type',
      'application/json',
    );
  } else {
    // Let the browser set the multipart boundary.
    headers.delete('Content-Type');
  }

  const response = await fetch(
    `${API_URL}${path}`,
    {
      ...options,
      headers,
      credentials: 'include',
    },
  );

  if (!response.ok) {
    let message =
      `Request failed with status ${response.status}`;

    try {
      const errorBody =
        await response.json();

      message =
        errorBody.message ??
        message;
    } catch {
      // Response wasn't JSON.
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType =
    response.headers.get(
      'content-type',
    );

  if (
    contentType?.includes(
      'application/json',
    )
  ) {
    return response.json() as Promise<T>;
  }

  return (await response.text()) as T;
}

export async function previewExcelImport(
  clientsFile: File,
  clientsPassword: string,
  policiesFile: File,
  policiesPassword: string,
) {
  const formData = new FormData();

  formData.append(
    'clientsFile',
    clientsFile,
  );

  formData.append(
    'clientsPassword',
    clientsPassword,
  );

  formData.append(
    'policiesFile',
    policiesFile,
  );

  formData.append(
    'policiesPassword',
    policiesPassword,
  );

  return apiFetch(
    '/api/import/excel/preview',
    {
      method: 'POST',
      body: formData,
    },
  );
}

export async function importExcel(
  clientsFile: File,
  clientsPassword: string,
  policiesFile: File,
  policiesPassword: string,
) {
  const formData = new FormData();

  formData.append(
    'clientsFile',
    clientsFile,
  );

  formData.append(
    'clientsPassword',
    clientsPassword,
  );

  formData.append(
    'policiesFile',
    policiesFile,
  );

  formData.append(
    'policiesPassword',
    policiesPassword,
  );

  return apiFetch(
    '/api/import/excel',
    {
      method: 'POST',
      body: formData,
    },
  );
}