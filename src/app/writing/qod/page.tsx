import { QodBranches, QodGateway } from "../diagrams";
import { Post, postMetadata } from "../post";

export const metadata = postMetadata("qod");

const SECTIONS = [
  ["gap", "The missing serving layer"],
  ["try", "One command to try it"],
  ["governance", "Security inside the engine"],
  ["agents", "Safe for agents"],
  ["doors", "Every door, same rules"],
  ["ops", "Runs like a warehouse"],
  ["fit", "When to use it"],
] as const;

export default function Qod() {
  return (
    <Post slug="qod" sections={SECTIONS}>
      <div className="tldr">
        <p className="tldr-label mono">In short</p>
        <ul>
          <li>
            DuckDB is the engine and DuckLake the catalog. Users, grants and routing are left out by design. Quack on
            Demand (qod) is that missing layer, open source under Apache 2.0.
          </li>
          <li>
            Table, row and column security is decided inside the engine, on what DuckDB actually bound, for BI tools,
            DuckDB clients, HTTP and AI agents alike.
          </li>
          <li>Agents write on branches that a human merges. One command runs the whole gateway on your laptop.</li>
        </ul>
      </div>

      <h2 id="gap">The missing serving layer</h2>
      <p>
        DuckLake gives you a lakehouse catalog backed by Postgres, and DuckDB gives you a fast engine. Between them and a
        room full of analysts sits the part DuckLake explicitly leaves out: concurrent users, authentication,
        authorization and connection routing.
      </p>
      <p>
        qod is that part. It turns a DuckLake lakehouse into a multi-tenant SQL warehouse: on-demand DuckDB nodes,
        least-loaded routing, row and column security with masking, and Arrow Flight SQL on the wire, so Power BI,
        Tableau, DBeaver and any JDBC, ODBC or ADBC client just connect. It runs on your own infrastructure, on any cloud
        or on-prem.
      </p>
      <QodGateway />

      <h2 id="try">One command to try it</h2>
      <pre>
        <code>{SERVE}</code>
      </pre>
      <p>
        The demo boots a seeded warehouse with security already live. Log in as tenant <code>acme</code>, pool{" "}
        <code>bi</code>, and switch users to watch the policies apply. The analyst <code>alice</code> sees phone numbers
        masked to <code>***</code> and only one market segment’s rows. <code>acme-admin</code> runs the same query and
        sees everything. A table nobody granted to alice is refused.
      </p>
      <p>
        To go further, follow the <a href="https://qod.starlake.ai/getting-started/quickstart">quickstart</a>. The code
        is on <a href="https://github.com/starlake-ai/qod">GitHub</a> under Apache-2.0.
      </p>

      <h2 id="governance">Security decided inside the engine</h2>
      <ul>
        <li>
          <strong>Per-statement authorization.</strong> Each node checks the objects of the plan DuckDB bound (tables,
          views, columns, functions, files), not the SQL text, so a clever query cannot hide what it reads.
        </li>
        <li>
          <strong>Row and column security.</strong> Row filters per role, and columns denied or masked through a SQL
          transform, applied before the node sees the statement. No views to maintain, no copied tables.
        </li>
        <li>
          <strong>No write-around.</strong> A write that references a masked or filtered table is denied, which closes the
          classic “copy it somewhere I can read” bypass.
        </li>
        <li>
          <strong>Immediate revocation.</strong> Revoking a grant or token cancels that principal’s statements in flight.
        </li>
        <li>
          <strong>Nothing leaks through metadata.</strong> <code>information_schema</code> shows only what you may
          query, and every statement and admin change lands in an audit log.
        </li>
      </ul>

      <h2 id="agents">Safe for agents</h2>
      <p>
        AI agents connect over MCP with a personal access token, which can be limited to read-only, one database or
        branches only. They get the same identity, grants and audit as any analyst.
      </p>
      <p>
        For writes, an agent works on a branch. A branch clones a DuckLake database at its current head without copying
        data: it reads the parent’s Parquet files in place and writes its own. The agent’s change set can be reviewed as
        a diff, and a different person merges it into main as one tagged snapshot. That is the difference between
        letting an agent near production data and letting it change production data.
      </p>
      <QodBranches />

      <h2 id="doors">Every door, same rules</h2>
      <ul>
        <li>
          <strong>Arrow Flight SQL</strong> for BI tools and JDBC, ODBC, ADBC, PyArrow or Spark. With a live connection,
          only result rows leave the server; the base tables never land on the analyst’s machine.
        </li>
        <li>
          <strong>Native DuckDB</strong>: any DuckDB with the <code>quack</code> extension can attach the gateway and
          join its own local tables with governed remote ones in one query.
        </li>
        <li>
          <strong>A read-only REST edge</strong> for tools that only speak HTTP, such as n8n or a spreadsheet import.
        </li>
        <li>
          <strong>MCP</strong> for agents, and a <code>qod</code> CLI with full parity with the admin API.
        </li>
      </ul>
      <pre>
        <code>{HYBRID}</code>
      </pre>

      <h2 id="ops">Runs like a warehouse, costs like DuckDB</h2>
      <p>
        Each tenant gets pools of DuckDB nodes, as local processes or Kubernetes pods. Statements are classified as read,
        write or DDL and sent to a compatible, least-loaded node, so DuckLake’s single-writer rule is enforced for users
        instead of by them. Idle pools suspend to zero and wake on the next query. Managers run active-active, with
        Prometheus metrics and Grafana dashboards included. On the data side you get snapshots, time travel, table
        history, undrop, restore and scheduled maintenance.
      </p>

      <h2 id="fit">When to use it, and when not</h2>
      <p>
        Use qod when several teams, apps or agents need governed SQL access to a DuckLake or DuckDB warehouse through
        standard protocols and your existing identity provider (Keycloak, Azure AD, Google, Cognito or JWT).
      </p>
      <p>
        Look elsewhere if a single embedded DuckDB inside one application is enough, or if you need distributed joins
        across nodes on TB-scale tables. qod runs each statement on exactly one node; shuffles across many belong to
        Trino or Dremio.
      </p>

    </Post>
  );
}

const SERVE = `uvx qod@latest serve --demo             # the full gateway, seeded and secured
uvx qod@latest serve ./sales.duckdb     # your own DuckDB file, persistent
uvx qod@latest serve ./warehouse/       # a directory of parquet or csv
uvx qod@latest serve s3://bucket/data/  # or a remote prefix

# admin UI: http://localhost:20900/ui/   Flight SQL: localhost:31338`;

const HYBRID = `ATTACH 'quack:localhost:9494' AS qod (TYPE quack,
  TOKEN 'tenant=acme&pool=bi&user=alice&password=demo-alice');

SELECT s.label, count(*) AS customers
FROM qod.tpch1.customer c JOIN my_segments s ON c.c_mktsegment = s.segment
GROUP BY 1 ORDER BY 2 DESC;`;
