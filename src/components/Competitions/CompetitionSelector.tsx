import React from "react";
import {
  getServerSideCompetitionNamesFromAPI,
  getServerSideCompetitionYearsFromAPI,
} from "@/scripts/API/Competitions/ServerSide";

export default function CompetitionSelector({
  setSelectedCallback,
  setStateCallback,
}: {
  setSelectedCallback: React.Dispatch<React.SetStateAction<string | null>>;
  setStateCallback: React.Dispatch<
    React.SetStateAction<"loading" | "loaded" | "error">
  >;
}): React.ReactNode {
  const [year, setYear] = React.useState<string | null>(null);
  const [allYears, setAllYears] = React.useState<string[]>([]);
  const [yearsState, setYearsState] = React.useState<
    "loading" | "loaded" | "error"
  >("loading");

  const [comp, setComp] = React.useState<string | null>(null);
  const [allComps, setAllComps] = React.useState<string[]>([]);
  const [compsState, setCompsState] = React.useState<
    "loading" | "loaded" | "error" | "null"
  >("null");

  const refreshYears = () => {
    setYearsState("loading");
    setAllYears([]);
    getServerSideCompetitionYearsFromAPI()
      .then((years) => {
        setAllYears(years);
        setYearsState("loaded");
      })
      .catch((err) => {
        console.error("Failed to get competition years");
        console.error(err);
        setYearsState("error");
      });
  };

  const refreshComps = () => {
    if (year === null) {
      setCompsState("null");
      setAllComps([]);
    } else {
      setCompsState("loading");
      setAllComps([]);
      getServerSideCompetitionNamesFromAPI(year)
        .then((comps) => {
          setAllComps(comps);
          setCompsState("loaded");
        })
        .catch((err) => {
          console.error("Failed to get competition names");
          console.error(err);
          setCompsState("error");
        });
    }
  };

  React.useEffect(() => {
    refreshYears();
  }, []);

  React.useEffect(() => {
    if (yearsState === "loaded") {
      setYear(allYears[0]);
    } else {
      setYear(null);
    }
  }, [allYears, yearsState]);

  React.useEffect(() => {
    refreshComps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year]);

  React.useEffect(() => {
    if (compsState === "loaded") {
      setComp(allComps[0]);
    } else {
      setComp(null);
    }
  }, [allComps, compsState]);

  React.useEffect(() => {
    setSelectedCallback(comp);
  }, [comp, setSelectedCallback]);

  React.useEffect(() => {
    if (compsState === "loaded" && yearsState === "loaded") {
      setStateCallback("loaded");
    } else if (compsState === "loading" || yearsState === "loading") {
      setStateCallback("loading");
    } else if (compsState === "error" || yearsState === "error") {
      setStateCallback("error");
    }
  }, [compsState, setStateCallback, yearsState]);

  return (
    <div>
      <div className="row mb-2">
        <div className="col">
          <select
            className="form-select"
            disabled={yearsState !== "loaded" || compsState !== "loaded"}
            defaultValue={yearsState === "loaded" ? allYears[0] : "null"}
            onChange={(e) => {
              setYear(e.target.value);
            }}
          >
            {(() => {
              switch (yearsState) {
                case "loading":
                  return <option value="null">Loading...</option>;
                case "error":
                  return <option value="null">Error</option>;
                case "loaded":
                  return allYears.map((year) => (
                    <option value={year} key={year}>
                      {year}
                    </option>
                  ));
              }
            })()}
          </select>
        </div>
        <div className="col">
          <button
            type="button"
            className="btn btn-secondary"
            disabled={yearsState === "loading" || compsState === "loading"}
            onClick={() => {
              refreshYears();
            }}
          >
            Refresh
          </button>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <select
            className="form-select"
            disabled={compsState !== "loaded"}
            defaultValue={compsState === "loaded" ? allComps[0] : "null"}
            onChange={(e) => {
              setComp(e.target.value);
            }}
          >
            {(() => {
              switch (compsState) {
                case "null":
                  return <option value="null">Select a year first!</option>;
                case "loading":
                  return <option value="null">Loading...</option>;
                case "error":
                  return <option value="null">Error</option>;
                case "loaded":
                  return allComps.map((comp) => (
                    <option value={comp} key={comp}>
                      {comp}
                    </option>
                  ));
              }
            })()}
          </select>
        </div>
        <div className="col">
          <button
            type="button"
            className="btn btn-secondary"
            disabled={compsState === "loading"}
            onClick={() => {
              refreshComps();
            }}
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}
