"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { fetchNoteById } from "@/lib/api";
import Modal from "@/components/Modal/Modal";
import css from "@/components/NoteDetails/NoteDetails.module.css";

export default function NotePreviewClient() {
  const router = useRouter();
  const params = useParams();

  const id = params.id as string;

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  if (isLoading) {
    return null;
  }

  if (isError || !note) {
    return null;
  }

  return (
    <Modal onClose={() => router.back()}>
      <main className={css.main}>
        <div className={css.container}>
          <button
            type="button"
            aria-label="Close modal"
            onClick={() => router.back()}
            className={css.closeButton}
          >
            ✕
          </button>
          <div className={css.item}>
            <div className={css.header}>
              <h2>{note.title}</h2>
            </div>

            <p className={css.tag}>{note.tag}</p>

            <p className={css.content}>{note.content}</p>

            <p className={css.date}>
              {new Date(note.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </main>
    </Modal>
  );
}
