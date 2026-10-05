"use client";

import { FileBrowser } from "@/components/studio/file-browser";
import { PageHeader } from "@/components/studio/ui";

export default function FilesPage() {
  return (
    <>
      <PageHeader title="Files" detail="Images, PDFs and Markdown, 25 MB at most each." />
      <FileBrowser />
    </>
  );
}
