import React from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import getOfficersFromAPI, { Officer } from "@/components/Officers/officersAPI";

export default function OfficersList(): React.ReactNode {
  const [state, setState] = React.useState<"loading" | "loaded" | "error">(
    "loading",
  );
  const [officers, setOfficers] = React.useState<Officer[]>([]);

  React.useEffect(() => {
    setState("loading");
    setOfficers([]);
    getOfficersFromAPI()
      .then((o) => {
        setOfficers(o);
        setState("loaded");
      })
      .catch((err) => {
        console.error(err);
        setState("error");
      });
  }, []);

  return (
    <ErrorBoundary>
      {(() => {
        switch (state) {
          case "loading":
            const loadingCard = (
              <div className="col mb-3 mt-1 placeholder-glow">
                <div className="card mb-2 h-100">
                  <div className="card-body">
                    <h5 className="card-title">
                      <span className="placeholder col-7" />
                    </h5>
                    <h6 className="card-subtitle text-body-secondary">
                      <span className="placeholder col-9" />
                      <span className="placeholder col-6" />
                    </h6>
                    <div className="card-text mt-2">
                      <p>
                        <span className="placeholder col-9" />
                        <span className="placeholder col-7" />
                        <span className="placeholder col-8" />
                        <span className="placeholder col-4" />
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
            return (
              <div style={{ overflowX: "hidden" }}>
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4">
                  <>
                    {loadingCard}
                    {loadingCard}
                    {loadingCard}
                    {loadingCard}
                    {loadingCard}
                    {loadingCard}
                  </>
                </div>
              </div>
            );
          case "loaded":
            return (
              <div style={{ overflowX: "hidden" }}>
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4">
                  {officers.map((officer: Officer, index: number) => {
                    return (
                      <div className="col mb-3 mt-1" key={`help-card-${index}`}>
                        <div className="card mb-2 h-100">
                          {/*<Image*/}
                          {/*  src={officer.image}*/}
                          {/*  alt={officer.altText}*/}
                          {/*  className="card-img-top"*/}
                          {/*  objectFit="cover"*/}
                          {/*/>*/}
                          {officer.openForApplication ? (
                            <div className="card-header">
                              Open for application!
                            </div>
                          ) : null}
                          <div className="card-body">
                            <h5 className="card-title">{officer.role}</h5>
                            {officer.personName != null ? (
                              <h6 className="card-subtitle text-body-secondary">
                                Held by <b>{officer.personName}</b> of{" "}
                                {officer.personSchool}.
                              </h6>
                            ) : null}
                            <div className="card-text mt-2">
                              <p>{officer.description}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          default:
          case "error":
            return (
              <div className="alert alert-warning" role="alert">
                Error fetching officers, try refreshing the page!
              </div>
            );
        }
      })()}
    </ErrorBoundary>
  );
}
