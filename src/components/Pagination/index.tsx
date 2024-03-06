import React from "react";
import { constrain } from "@/scripts/Utils/Numbers";

function PaginationButton({
  num,
  page,
  setPageCallback,
  disabled = false,
}: {
  num: number;
  page: number;
  pageCount: number;
  setPageCallback: (
    page: number,
  ) =>
    | void
    | ((page: number) => Promise<void>)
    | React.Dispatch<React.SetStateAction<number>>;
  disabled?: boolean;
}): React.ReactNode {
  return (
    <li
      className={`page-item${page === num ? " active" : ""}${
        disabled ? " disabled" : ""
      }`}
      aria-current={page === num ? "page" : undefined}
    >
      <button
        className="page-link"
        onClick={() => {
          setPageCallback(num);
        }}
        disabled={disabled}
      >
        {num + 1}
      </button>
    </li>
  );
}

export default function Pagination({
  page,
  pageCount,
  setPageCallback,
  disabled = false,
}: {
  page: number;
  pageCount: number;
  setPageCallback: (
    page: number,
  ) =>
    | void
    | ((page: number) => Promise<void>)
    | React.Dispatch<React.SetStateAction<number>>;
  disabled?: boolean;
}): React.ReactNode {
  return (
    <nav>
      <ul className="pagination">
        <li className={`page-item${page === 0 || disabled ? " disabled" : ""}`}>
          <button
            className="page-link"
            disabled={page === 0 || disabled}
            onClick={() => {
              setPageCallback(page - 1);
            }}
          >
            Previous
          </button>
        </li>
        {(() => {
          if (pageCount < 10) {
            return Array.from(Array(pageCount).keys()).map((num) => {
              return (
                <PaginationButton
                  num={num}
                  page={page}
                  pageCount={pageCount}
                  setPageCallback={setPageCallback}
                  key={num}
                  disabled={disabled}
                />
              );
            });
          } else {
            let numbersToShow = ["0", "1"];
            for (let i = -2; i <= 2; i++) {
              numbersToShow.push(
                constrain(page + i, 0, pageCount - 1).toString(),
              );
            }
            numbersToShow.push((pageCount - 2).toString());
            numbersToShow.push((pageCount - 1).toString());
            numbersToShow = Array.from(new Set(numbersToShow));
            for (let i = 1; i < numbersToShow.length; i++) {
              if (
                parseInt(numbersToShow[i]) - parseInt(numbersToShow[i - 1]) >
                1
              ) {
                numbersToShow.splice(i, 0, "...");
                i++;
              }
            }

            return numbersToShow.map((num) => {
              return num === "..." ? (
                <li className="page-item disabled">
                  <button className="page-link" disabled={true}>
                    ...
                  </button>
                </li>
              ) : (
                <PaginationButton
                  num={parseInt(num)}
                  page={page}
                  pageCount={pageCount}
                  setPageCallback={setPageCallback}
                  disabled={disabled}
                />
              );
            });
          }
        })()}

        <li
          className={`page-item${
            page === pageCount - 1 || disabled ? " disabled" : ""
          }`}
        >
          <button
            className="page-link"
            disabled={page === pageCount - 1 || disabled}
            onClick={() => {
              setPageCallback(page + 1);
            }}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
}
