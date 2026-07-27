"use client";

import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

interface PaginationProps {
  pageCount: number;
  currentPage: number;
  onPageChange: (selectedPage: number) => void;
}

export default function Pagination({
  pageCount,
  currentPage,
  onPageChange,
}: PaginationProps) {
  return (
    <ReactPaginate
      pageCount={pageCount}
      pageRangeDisplayed={3}
      marginPagesDisplayed={1}
      forcePage={currentPage - 1}
      onPageChange={({ selected }) => onPageChange(selected + 1)}
      previousLabel="<"
      nextLabel=">"
      containerClassName={css.pagination}
      activeClassName={css.active}
    />
  );
}
