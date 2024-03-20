import TeamSelector from "@/components/Teams/TeamSelector";
import { NotificationType, notify } from "@/components/Notifications";
import React from "react";
import { UserDetails } from "@/scripts/API/Users";

export default function SetDetailsSection(): React.ReactNode {
  const [userDetails, setUserDetails] = React.useState<UserDetails>({
    team: null,
    graduationYear: null,
  });
  const [fetchDetailsState, setFetchDetailsState] = React.useState<
    "loading" | "loaded" | "error"
  >("loading");
  const [teamSelectorState, setTeamSelectorState] = React.useState<
    "loading" | "loaded" | "error"
  >("loading");
  const [joinTeamState, setJoinTeamState] = React.useState<
    "null" | "loading" | "loaded" | "error"
  >("null");

  React.useEffect(() => {
    setFetchDetailsState("loading");
    fetch("/api/account/details")
      .then((response) => {
        if (response.status !== 200) {
          throw new Error("Failed to get details!");
        }
        return response.json();
      })
      .then((data) => {
        setUserDetails(data);
        setFetchDetailsState("loaded");
      })
      .catch((err) => {
        console.error("Failed to get details!");
        console.error(err);
        notify("Failed to get details!", NotificationType.Error);
        setFetchDetailsState("error");
      });
  }, []);

  return (
    <form
      style={{ overflowX: "hidden" }}
      onSubmit={(e) => {
        e.preventDefault();
        setJoinTeamState("loading");
        fetch("/api/account/details", {
          body: JSON.stringify(userDetails),
          method: "PUT",
        })
          .then((res) => {
            if (res.status !== 202) {
              throw new Error("Failed to update details!");
            }
            setJoinTeamState("loaded");
            notify("Successfully updated details!", NotificationType.Success);
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          })
          .catch((err) => {
            console.error("Failed to update details!");
            console.error(err);
            setJoinTeamState("error");
            notify("Failed to update details!", NotificationType.Error);
          });
      }}
    >
      <label className="form-label">Team</label>
      <TeamSelector
        setSelectedCallback={(team: string | null) => {
          setUserDetails({
            ...userDetails,
            team: team !== null ? { id: team } : null,
          });
        }}
        setStateCallback={setTeamSelectorState}
        hideRefreshButton
        disabled={fetchDetailsState !== "loaded"}
      />
      <label className="form-label mt-2 mb-0">Graduation year</label>
      <div className="row">
        <div className="col-auto">
          <input
            type="number"
            step="1"
            defaultValue={userDetails.graduationYear ?? undefined}
            onBlur={(e) => {
              setUserDetails({
                ...userDetails,
                graduationYear: parseInt(e.target.value) ?? null,
              });
            }}
            className="form-control mt-2"
            placeholder="Graduation year"
            disabled={fetchDetailsState !== "loaded"}
          />
        </div>
      </div>
      <button
        type="submit"
        className="btn btn-primary mt-2"
        disabled={
          teamSelectorState !== "loaded" ||
          joinTeamState !== "null" ||
          fetchDetailsState !== "loaded"
        }
      >
        {teamSelectorState === "loaded" ? (
          <>Set details</>
        ) : (
          <>Finish the form first!</>
        )}
      </button>
      <p>
        Your team and graduation year will change immediately. Your status will
        immediately change to unverified and cannot be undone except by admins.
        This will also refresh the page.
      </p>
      {(() => {
        switch (joinTeamState) {
          case "loading":
            return <p>Setting details...</p>;
          case "loaded":
            return <p>Successfully set details! Refreshing page...</p>;
          case "error":
            return <p>Failed to set details!</p>;
          case "null":
          default:
            return <></>;
        }
      })()}
    </form>
  );
}
