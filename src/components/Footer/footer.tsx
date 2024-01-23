import React from "react";
import ErrorBoundary from "../ErrorBoundary";
import Link from "next/link";

export const DEVELOPERS = [
  {
    name: "Cyrus Yiu",
    github: "UnsignedArduino",
  },
];

function Footer(): JSX.Element {
  type FooterThing = {
    title: string;
    link: string;
  };

  const footerThings: FooterThing[][] = [
    [
      {
        title: "Home",
        link: "/",
      },
      {
        title: "Help",
        link: "/help",
      },
      { title: "Legal", link: "/legal" },
    ],
    [
      {
        title: "Status page",
        link: "https://stats.uptimerobot.com/6qGRKCVxXx",
      },
      {
        title: "GitHub",
        link: "https://github.com/ma-coding-league/ma-coding-league-website",
      },
    ],
  ];

  const mobileFooterThings = footerThings.flat(Infinity) as FooterThing[];

  const footerText = (
    <>
      The Massachusetts Coding League website is developed and maintained by{" "}
      {DEVELOPERS.map((dev, index) => {
        return (
          <span key={dev.name}>
            <a
              href={"https://github.com/" + dev.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              {dev.name}
            </a>
            {index < DEVELOPERS.length - 2
              ? ", "
              : index < DEVELOPERS.length - 1
                ? " and "
                : ""}
          </span>
        );
      })}{" "}
      and members of the Massachusetts Coding League.
    </>
  );

  return (
    <ErrorBoundary>
      <small>
        <table className="table table-sm table-borderless d-none d-sm-table">
          <tbody>
            {footerThings.map((row, rowIndex): JSX.Element => {
              return (
                <tr key={`row-${rowIndex}`}>
                  {rowIndex === 0 ? (
                    <td className="px-2" rowSpan={footerThings.length}>
                      {footerText}
                    </td>
                  ) : (
                    <></>
                  )}
                  {row.map((thing, colIndex): JSX.Element => {
                    if (thing.link.startsWith("/")) {
                      return (
                        <td key={`col-${colIndex}`}>
                          <Link href={thing.link}>{thing.title}</Link>
                        </td>
                      );
                    } else {
                      return (
                        <td key={`col-${colIndex}`}>
                          <a
                            href={thing.link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {thing.title}
                          </a>
                        </td>
                      );
                    }
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        <table className="table table-sm table-borderless d-sm-none d-table">
          <tbody>
            {mobileFooterThings.map((thing, rowIndex): JSX.Element => {
              return (
                <tr key={`row-${rowIndex}`}>
                  {rowIndex === 0 ? (
                    <td className="px-2" rowSpan={mobileFooterThings.length}>
                      {footerText}
                    </td>
                  ) : (
                    <></>
                  )}
                  <td>
                    {(() => {
                      if (thing.link.startsWith("/")) {
                        return <Link href={thing.link}>{thing.title}</Link>;
                      } else {
                        return (
                          <a
                            href={thing.link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {thing.title}
                          </a>
                        );
                      }
                    })()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </small>
    </ErrorBoundary>
  );
}

export default Footer;
