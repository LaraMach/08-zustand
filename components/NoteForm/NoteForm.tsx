"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import type { Note } from "@/types/note";

import { createNote, type CreateNoteData } from "@/lib/api";
import css from "./NoteForm.module.css";

interface NoteFormValues {
  title: string;
  content: string;
  tag: "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
}

const initialValues: NoteFormValues = {
  title: "",
  content: "",
  tag: "Todo",
};

function NoteForm() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { register, handleSubmit } = useForm<NoteFormValues>({
    defaultValues: initialValues,
  });

  const mutation = useMutation<Note, Error, CreateNoteData>({
    mutationFn: createNote,

    onSuccess: () => {
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
          {...register("title")}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          rows={8}
          className={css.textarea}
          {...register("content")}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select id="tag" className={css.select} {...register("tag")}>
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
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
