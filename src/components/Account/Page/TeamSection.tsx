import { useSession } from "next-auth/react";
import React from "react";
import SetDetailsSection from "@/components/Account/Page/SetDetails";

export default function AccountPageTeamSection(): React.ReactNode {
  const { data: session } = useSession();

  return (
    <>
      {/*<code>{JSON.stringify(session?.user, null, 2)}</code>*/}
      {session?.user.team !== null ? (
        session?.user.teamVerified ? (
          <p>Part of team {session?.user.team}.</p>
        ) : (
          <p>Part of team {session?.user.team}. (unverified)</p>
        )
      ) : (
        <>
          <p>
            You are not currently on a team! Select a team below and an admin
            will come around to verify it!
          </p>
        </>
      )}
      {session?.user.graduationYear !== null ? (
        <p>Graduating year {session?.user.graduationYear}.</p>
      ) : (
        <p>Graduation year not set.</p>
      )}
      <h2>Set details</h2>
      <SetDetailsSection />
    </>
  );
}
