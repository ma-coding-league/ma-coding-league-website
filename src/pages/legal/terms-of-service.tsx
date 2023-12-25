import React from "react";
import rehypeKatex from "rehype-katex";
import rehypeStringify from "rehype-stringify";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import * as fs from "node:fs/promises";
import path from "path";
import Layout from "../../components/Layout";
import getAppProps, { AppProps } from "../../components/WithAppProps";

const pageName = "Terms of service";

type TermsOfServiceProps = { appProps: AppProps; termsOfServiceHTML: string };

export function TermsOfService({
  appProps,
  termsOfServiceHTML,
}: TermsOfServiceProps): JSX.Element {
  return (
    <Layout
      title={pageName}
      currentPage={pageName}
      appProps={appProps}
      description="The Massachusetts Coding League website's terms of service."
      keywords="MA coding league, Massachusetts Coding League, MA coding league website, Massachusetts Coding League website, Legal, Legal stuff, Terms of service"
      breadCrumbs={[
        { Legal: "/legal" },
        { "Terms of service": "/legal/terms-of-service" },
      ]}
      dontShowServicesWarning
    >
      <div dangerouslySetInnerHTML={{ __html: termsOfServiceHTML }} />
    </Layout>
  );
}

export async function getStaticProps(): Promise<{
  props: TermsOfServiceProps;
}> {
  return {
    props: {
      appProps: await getAppProps(),
      termsOfServiceHTML: await (async () => {
        const p = path.join(process.cwd(), "public", "terms-of-service.md");
        const raw = await fs.readFile(p);
        const processed = await unified()
          .use(remarkParse)
          .use(remarkGfm)
          .use(remarkBreaks)
          .use(remarkMath)
          .use(remarkRehype)
          .use(rehypeKatex)
          .use(rehypeStringify)
          .process(raw);
        return processed.toString();
      })(),
    },
  };
}

export default TermsOfService;
