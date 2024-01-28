import React from "react";
import Link from "next/link";
import { MCLCompetitionsYear } from "@/scripts/MCLCompetition/getCompetitionYears";

export default function MCLCompetitionYearsRenderer({
  years,
}: {
  years: MCLCompetitionsYear[];
}): JSX.Element {
  return (
    <ul>
      {years.map((year) => {
        return year.hide ? (
          <></>
        ) : (
          <li key={year.yearFull}>
            <Link href={`/competitions/${year.yearFull}`}>{year.yearFull}</Link>
          </li>
        );
      })}
    </ul>
  );
}
