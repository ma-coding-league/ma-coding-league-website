import React from "react";
import ErrorBoundary from "../ErrorBoundary";
import Link from "next/link";
import icon from "../../../public/android-chrome-512x512.png";
import Image from "next/image";
import { DEVELOPERS } from "@/people";

function Footer(): React.ReactNode {
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
      { title: "Competitions", link: "/competitions" },
      { title: "Teams", link: "/teams" },
      { title: "Officers", link: "/officers" },
    ],
    [
      {
        title: "Help",
        link: "/help",
      },
      { title: "Legal", link: "/legal" },
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
      <Link
        href="/"
        className="d-flex align-items-center mb-2 link-body-emphasis text-decoration-none"
      >
        <Image
          src={icon}
          alt="Logo"
          className="d-inline-block"
          style={{ objectFit: "contain", width: "2em", height: "2em" }}
        />
      </Link>
      {/*© 2024 Cyrus Yiu. All rights reserved.*/}
      {/*<br />*/}
      The Massachusetts Coding League website is developed and maintained by{" "}
      {DEVELOPERS.map((dev, index) => {
        return (
          <span key={dev.person.name}>
            <a href={dev.link} target="_blank" rel="noopener noreferrer">
              {dev.person.name}
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
      <hr className="m-2" />
      <small>
        <table className="table table-sm table-borderless d-none d-sm-table">
          <tbody>
            <tr>
              <td className="px-2">{footerText}</td>
              <td>
                <table className="table table-sm table-borderless d-none d-sm-table">
                  <tbody>
                    {footerThings.map((row, rowIndex): React.ReactNode => {
                      return (
                        <tr key={`row-${rowIndex}`}>
                          {row.map((thing, colIndex): React.ReactNode => {
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
              </td>
            </tr>
          </tbody>
        </table>
        <table className="table table-sm table-borderless d-sm-none d-table">
          <tbody>
            {mobileFooterThings.map((thing, rowIndex): React.ReactNode => {
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
