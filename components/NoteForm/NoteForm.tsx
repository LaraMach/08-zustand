"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Note } from "@/types/note";

import { createNote, type CreateNoteData } from "@/lib/api";
import css from "./NoteForm.module.css";
import { useNoteStore } from "@/lib/store/noteStore";

const noteSchema = z.object({
  title: z
    .string()
    .min(3, "Minimum 3 characters")
    .max(50, "Maximum 50 characters"),

  content: z.string().max(500, "Maximum 500 characters"),

  tag: z.enum(["Todo", "Work", "Personal", "Meeting", "Shopping"]),
});

type NoteFormValues = z.infer<typeof noteSchema>;

function NoteForm() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { draft, setDraft, clearDraft } = useNoteStore();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NoteFormValues>({
    resolver: zodResolver(noteSchema),
    defaultValues: draft,
  });

  useEffect(() => {
    reset(draft);
  }, [draft, reset]);

  const mutation = useMutation<Note, Error, CreateNoteData>({
    mutationFn: createNote,

    onSuccess: () => {
      clearDraft();

      queryClient.invalidateQueries({
        queryKey: ["notes"],
      });

      router.push("/notes/filter/all");
    },
  });

  return (
    <form
      className={css.form}
      onSubmit={handleSubmit((values) => mutation.mutate(values))}
    >
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>

        <input
          id="title"
          type="text"
          className={css.input}
          {...register("title", {
            onChange: (e) => setDraft({ title: e.target.value }),
          })}
        />

        {errors.title && (
          <span className={css.error}>{errors.title.message}</span>
        )}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          rows={8}
          className={css.textarea}
          {...register("content", {
            onChange: (e) => setDraft({ content: e.target.value }),
          })}
        />
        {errors.content && (
          <span className={css.error}>{errors.content.message}</span>
        )}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          className={css.select}
          {...register("tag", {
            onChange: (e) =>
              setDraft({
                tag: e.target.value as CreateNoteData["tag"],
              }),
          })}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
        {errors.tag && <span className={css.error}>{errors.tag.message}</span>}
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={() => router.back()}
        >
          Cancel
        </button>

        <button
          type="submit"
          className={css.submitButton}
          disabled={mutation.isPending}
        >
          Create note
        </button>
      </div>
    </form>
  );
}

export default NoteForm;
