import { RedcrabCluster } from "../diagrams";
import { Post, postMetadata } from "../post";

export const metadata = postMetadata("redcrab");

const SECTIONS = [
  ["why", "Why another broker"],
  ["try", "Five minutes with stock Kafka tools"],
  ["cluster", "A three-node cluster"],
  ["status", "What works, what does not"],
  ["bench", "Benchmark first"],
  ["inside", "Inside"],
  ["help", "How to help"],
] as const;

export default function Redcrab() {
  return (
    <Post slug="redcrab" sections={SECTIONS}>
      <div className="tldr">
        <p className="tldr-label mono">In short</p>
        <ul>
          <li>redcrab is a streaming broker that speaks the Kafka wire protocol: one Rust binary, no JVM, no ZooKeeper, Raft replication per partition.</li>
          <li>It is a clean-room implementation, tested with the stock Apache Kafka command-line tools, and MIT licensed.</li>
          <li>The benchmark came before the broker. redcrab is pre-alpha and looking for people to run it, measure it and break it.</li>
        </ul>
      </div>

      <h2 id="why">Why another broker</h2>
      <p>
        redcrab started after the <code>redpanda-data/redpanda</code> repository was archived on GitHub. I wanted a
        small, Kafka-compatible broker that ships as a single binary and that anyone can read, run and change.
      </p>
      <p>
        It is written from scratch, from the public Kafka protocol documentation and the Raft paper, and contains no
        source code from Redpanda or Apache Kafka. Existing Kafka clients work against it unchanged; so far the Kafka
        4.4.0 Java clients are the ones tested.
      </p>

      <h2 id="try">Five minutes with stock Kafka tools</h2>
      <pre>
        <code>{BUILD}</code>
      </pre>
      <p>Then create a topic, produce and consume with the official Kafka CLI, here from the <code>apache/kafka</code> image:</p>
      <pre>
        <code>{CLI}</code>
      </pre>
      <p>
        Every write acknowledged with <code>acks=1</code> or <code>acks=all</code> is already fsynced, so{" "}
        <code>kill -9</code> loses nothing that was acknowledged. Ctrl-C answers the requests already read, fsyncs and
        exits cleanly.
      </p>

      <h2 id="cluster">A three-node cluster</h2>
      <pre>
        <code>{CLUSTER}</code>
      </pre>
      <p>
        Create a topic with replication factor 3 and the leaders spread across the three nodes. The cluster survives the
        loss of any one node, and a node restarted with the same flags and data directory catches up on its own.
      </p>
      <RedcrabCluster />

      <h2 id="status">What works, and what does not yet</h2>
      <p>
        <strong>Works today:</strong> a single node or a fixed cluster; one Raft group per partition plus a metadata
        group; topics with 1 to 10,000 partitions; produce and fetch where <code>acks=all</code> waits for a majority to
        fsync and reads stop at the high watermark; classic consumer groups with replicated offsets; a segmented log with
        CRC-32C checks and crash recovery.
      </p>
      <p>
        <strong>Not yet:</strong> adding or removing nodes, retention and compaction (disk only grows), idempotence checks
        and transactions, TLS, SASL, ACLs and metrics, and the KIP-848 consumer protocol.
      </p>
      <p>
        <strong>Pre-alpha means it.</strong> There is no authentication or encryption, crafted large requests can still
        exhaust memory, and a retried produce can be stored twice. Do not put production data on it or expose it to
        untrusted networks.
      </p>

      <h2 id="bench">Benchmark first</h2>
      <p>
        The benchmark is the project’s most important deliverable, and it was built before the broker. The question it
        answers: under the same durability guarantees, how does a small Rust broker compare with Apache Kafka and
        Redpanda? The fairness rules are worth stealing for any broker comparison:
      </p>
      <ul>
        <li>
          <strong>Same client, settings and resources.</strong> The perf tools from one pinned <code>apache/kafka</code>{" "}
          image, identical producer and consumer settings, and the same machine, workloads and memory cap per broker.
        </li>
        <li>
          <strong>Same durability.</strong> <code>acks=all</code> everywhere, with <code>min.insync.replicas</code> of 1
          on one broker and 2 on three.
        </li>
        <li>
          <strong>Kafka twice.</strong> Once with its default, which does not fsync before acknowledging, and once with{" "}
          <code>flush.messages=1</code>, which does, like Redpanda and redcrab. Otherwise you compare different
          guarantees.
        </li>
        <li>
          <strong>Redpanda with write caching off</strong>, and not in developer mode.
        </li>
        <li>
          <strong>Settings read back.</strong> Each result records the effective broker and topic configs, so nobody has
          to trust the setup on faith.
        </li>
      </ul>
      <p>
        I am not quoting numbers yet. Today’s runs are local smoke tests in a small laptop VM, and they vary from run to
        run. The publishable runs, OpenMessaging Benchmark on dedicated Linux hosts with NVMe drives, are the next
        milestone, and their configurations are already in <code>bench/omb/</code>.
      </p>
      <p>
        The harness also checks failover. It writes increasing integers with <code>acks=all</code>, kills the partition
        leader or cuts brokers off the network, and verifies that every acknowledged record can be read back. In a few
        local runs, no acknowledged record went missing. That is encouraging, and not a proof.
      </p>

      <h2 id="inside">Inside</h2>
      <pre>
        <code>{ARCH}</code>
      </pre>
      <p>
        Kafka connections run on a multi-threaded Tokio runtime. Raft groups run on a few shard threads, fsyncs and reads
        on the blocking pool, and the node-to-node transport on plain threads. Tests include end-to-end clusters over TCP
        and simulated power failures that drop unsynced data.
      </p>

      <h2 id="help">How to help</h2>
      <ul>
        <li>Point your Kafka client at it and report what breaks. Clients other than the Java 4.4.0 ones are untested.</li>
        <li>Run the benchmark on real hardware. The OpenMessaging Benchmark configurations are ready.</li>
        <li>
          Pick up the roadmap: thread-per-core, io_uring and O_DIRECT, retention and compaction, then idempotent
          producers and transactions.
        </li>
      </ul>
      <p>
        Contributions must stay clean-room: nothing copied from, translated from or derived from the Kafka or Redpanda
        brokers. Work from the protocol docs, KIPs and papers; running Kafka or Redpanda as black boxes is fine. The code
        is on <a href="https://github.com/Shindora/redcrab">GitHub</a> under the MIT license.
      </p>
    </Post>
  );
}

const BUILD = `git clone https://github.com/Shindora/redcrab.git && cd redcrab
cargo build --release

# listens on 0.0.0.0:9092 and tells clients in containers where to connect
./target/release/redcrab --advertised-host host.containers.internal`;

const CLI = `kafka_cli() { podman run --rm -i docker.io/apache/kafka:4.4.0 "$@"; }
B=host.containers.internal:9092

kafka_cli /opt/kafka/bin/kafka-topics.sh --bootstrap-server $B \\
  --create --topic demo --partitions 3 --replication-factor 1

printf 'hello\\nfrom\\nredcrab\\n' | kafka_cli \\
  /opt/kafka/bin/kafka-console-producer.sh --bootstrap-server $B --topic demo

kafka_cli /opt/kafka/bin/kafka-console-consumer.sh --bootstrap-server $B \\
  --topic demo --group demo-group --from-beginning --max-messages 3`;

const CLUSTER = `PEERS=1@127.0.0.1:19093/host.containers.internal:19092
PEERS=$PEERS,2@127.0.0.1:29093/host.containers.internal:29092
PEERS=$PEERS,3@127.0.0.1:39093/host.containers.internal:39092

for id in 1 2 3; do
  ./target/release/redcrab --node-id $id --peers "$PEERS" \\
    --listen 0.0.0.0:\${id}9092 --rpc-listen 127.0.0.1:\${id}9093 \\
    --data-dir redcrab-data-$id &
done`;

const ARCH = `client ─TCP─> server.rs   frames and checks requests
  └─> api.rs   one handler per Kafka API
       ├─> broker.rs ─> cluster.rs ─> replica.rs   a Raft group per partition
       │                               ├─> raft.rs       elections, commit
       │                               ├─> storage.rs    segmented log
       │                               └─> transport.rs  node-to-node RPC
       └─> group.rs   classic consumer groups`;
