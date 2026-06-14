import { AlertTriangle, BadgeCheck, Banknote, FileSearch, LockKeyhole, ShieldCheck, Users } from "lucide-react";
import { formatKobo } from "@openbank-ng/shared";

const queues = [
  { label: "KYC reviews", count: 18, icon: FileSearch },
  { label: "Risk holds", count: 6, icon: LockKeyhole },
  { label: "Open customers", count: 12840, icon: Users },
  { label: "Daily volume", count: "NGN 82.4m", icon: Banknote },
];

const transfers = [
  { ref: "OBNG2026061401", customer: "Adaeze Okafor", amountKobo: 4500000, status: "Successful", risk: "Low" },
  { ref: "OBNG2026061402", customer: "Musa Abdullahi", amountKobo: 150000000, status: "Review", risk: "High" },
  { ref: "OBNG2026061403", customer: "Chika Nwosu", amountKobo: 800000, status: "Successful", risk: "Low" },
];

const auditEvents = [
  "KYC approved for Adaeze Okafor",
  "Account freeze control ready",
  "Transfer reversal workflow enabled",
  "High-risk transfer moved to manual review",
];

export default function AdminHome() {
  return (
    <main className="console">
      <header className="masthead">
        <div>
          <p>Operations console</p>
          <h1>OpenBank NG Control Room</h1>
        </div>
        <span className="status"><BadgeCheck size={18} /> Sandbox ledger online</span>
      </header>

      <section className="queueGrid">
        {queues.map((item) => {
          const Icon = item.icon;
          return (
            <article className="metric" key={item.label}>
              <Icon size={22} />
              <span>{item.label}</span>
              <strong>{item.count}</strong>
            </article>
          );
        })}
      </section>

      <section className="workGrid">
        <div className="panel wide">
          <div className="panelHead">
            <h2>Transaction supervision</h2>
            <button>Export report</button>
          </div>
          <table>
            <thead>
              <tr>
                <th>Reference</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Risk</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transfers.map((transfer) => (
                <tr key={transfer.ref}>
                  <td>{transfer.ref}</td>
                  <td>{transfer.customer}</td>
                  <td>{formatKobo(transfer.amountKobo)}</td>
                  <td><span className={transfer.risk === "High" ? "pill warn" : "pill"}>{transfer.risk}</span></td>
                  <td><span className={transfer.status === "Review" ? "pill warn" : "pill"}>{transfer.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="panel risk">
          <AlertTriangle size={28} />
          <h2>Risk gate</h2>
          <p>Untrusted devices, missing OTP, large tier-relative transfers, and repeated similar transfers route here before release.</p>
          <button>Open review queue</button>
        </div>
      </section>

      <section className="governanceGrid">
        <div className="panel">
          <div className="panelHead">
            <h2>KYC command lane</h2>
            <ShieldCheck size={22} />
          </div>
          <p className="muted">Compliance officers can approve, reject, or request more information for BVN/NIN-ready customer profiles.</p>
          <div className="controlRow">
            <span>Review case</span>
            <strong>kyc_001</strong>
            <span className="pill">Approved</span>
          </div>
        </div>

        <div className="panel">
          <h2>Audit trail</h2>
          <div className="auditList">
            {auditEvents.map((event) => (
              <span key={event}>{event}</span>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
