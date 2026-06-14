import { ArrowRight, Bell, CreditCard, Landmark, ReceiptText, ShieldCheck, Smartphone } from "lucide-react";
import { formatKobo } from "@openbank-ng/shared";

const account = {
  name: "Adaeze Okafor",
  number: "1023456789",
  balanceKobo: 245000000,
  availableBalanceKobo: 245000000,
  tier: "Tier 2",
};

const actions = [
  { label: "Transfer", icon: ArrowRight },
  { label: "Airtime", icon: Smartphone },
  { label: "Cards", icon: CreditCard },
  { label: "Statement", icon: ReceiptText },
];

const transactions = [
  { title: "NIP transfer to Chinedu", time: "Today, 09:42", amountKobo: -4500000, status: "Successful" },
  { title: "Salary credit", time: "Yesterday, 18:05", amountKobo: 68000000, status: "Successful" },
  { title: "Airtime top up", time: "Yesterday, 13:20", amountKobo: -500000, status: "Successful" },
];

export default function CustomerHome() {
  return (
    <main className="shell">
      <aside className="rail">
        <div className="brand">
          <span className="mark">OB</span>
          <strong>OpenBank NG</strong>
        </div>
        <nav>
          <a className="active">Home</a>
          <a>Transfers</a>
          <a>Beneficiaries</a>
          <a>Cards</a>
          <a>Support</a>
        </nav>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Retail banking cockpit</p>
            <h1>Good evening, {account.name.split(" ")[0]}</h1>
          </div>
          <button className="iconButton" aria-label="Notifications">
            <Bell size={20} />
          </button>
        </header>

        <section className="heroBand">
          <div>
            <p className="label">Primary savings account</p>
            <h2>{formatKobo(account.balanceKobo)}</h2>
            <p className="muted">Available: {formatKobo(account.availableBalanceKobo)} • {account.number}</p>
          </div>
          <div className="assurance">
            <ShieldCheck size={24} />
            <span>KYC {account.tier} verified</span>
          </div>
        </section>

        <section className="quickGrid">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <button className="action" key={action.label}>
                <Icon size={21} />
                <span>{action.label}</span>
              </button>
            );
          })}
        </section>

        <section className="contentGrid">
          <div className="panel">
            <div className="sectionTitle">
              <h3>Recent activity</h3>
              <button>View all</button>
            </div>
            <div className="transactionList">
              {transactions.map((transaction) => (
                <article className="transaction" key={transaction.title}>
                  <Landmark size={18} />
                  <div>
                    <strong>{transaction.title}</strong>
                    <span>{transaction.time}</span>
                  </div>
                  <b className={transaction.amountKobo > 0 ? "credit" : "debit"}>{formatKobo(transaction.amountKobo)}</b>
                </article>
              ))}
            </div>
          </div>

          <div className="panel transferPanel">
            <h3>Prepared transfer</h3>
            <label>Beneficiary account</label>
            <input value="0123456789" readOnly />
            <label>Bank</label>
            <input value="Standard Chartered Bank Nigeria" readOnly />
            <label>Amount</label>
            <input value="NGN 45,000.00" readOnly />
            <button className="primary">Review transfer</button>
          </div>
        </section>
      </section>
    </main>
  );
}
