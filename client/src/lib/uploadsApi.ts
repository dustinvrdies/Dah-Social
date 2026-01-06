export type UploadedFile = {
  url: string;
  type: "image" | "video";
  name: string;
  size: number;
};

export async function uploadFiles(files: File[]): Promise<UploadedFile[]> {
  const form = new FormData();
  for (const f of files) form.append("files", f);

  const res = await fetch("/api/uploads", {
    method: "POST",
    body: form,
    credentials: "include",
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || res.statusText);
  }

  const data = await res.json();
  return data.files as UploadedFile[];
}
