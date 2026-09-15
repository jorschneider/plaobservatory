"""Render two separately scoped issuer panels. Verified with matplotlib 3.10.5."""

import json
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt

root = Path(__file__).resolve().parents[1]
research = root / "research/military-robotics"
data = json.loads((research / "scale-panel.json").read_text())
output = research / "figures"
output.mkdir(exist_ok=True)

plt.rcParams.update({
    "font.family": "DejaVu Sans",
    "font.size": 11,
    "svg.fonttype": "none",
    "svg.hashsalt": "robotics-scale-2026-09-15",
    "axes.spines.top": False,
    "axes.spines.right": False,
    "axes.spines.left": False,
    "axes.edgecolor": "#b7c1c6",
    "text.color": "#142c39",
    "axes.labelcolor": "#142c39",
    "xtick.color": "#526774",
    "ytick.color": "#526774",
})
fig, axes = plt.subplots(1, 2, figsize=(13.5, 7))
fig.subplots_adjust(left=0.07, right=0.975, top=0.72, bottom=0.26, wspace=0.28)
fig.suptitle("Growth headlines conceal timing and customer mix", x=0.07,
             y=0.96, ha="left", fontsize=22, weight="bold")
fig.text(0.07, 0.895, "Two issuer disclosures. Different scopes; neither panel estimates China's military robotics market.",
         fontsize=11, color="#526774")

quarterly = data["jingpin"]["quarterlyRevenue2025"]
revenue = [row["amount"] / 1_000_000 for row in quarterly]
ax = axes[0]
bars = ax.bar(["Q1", "Q2", "Q3", "Q4"], revenue,
              color=["#bdcbd0", "#bdcbd0", "#176b7a", "#176b7a"], width=0.6)
ax.bar_label(bars, labels=[f"{v:.1f}" for v in revenue], padding=5, fontsize=11)
ax.set_title("Jingpin: 2025 revenue by quarter", loc="left", fontsize=14, weight="bold", pad=32)
ax.text(0, 1.025, "Consolidated company revenue, all businesses", transform=ax.transAxes,
        fontsize=10, color="#526774")
ax.set_ylim(0, 160)
ax.set_ylabel("CNY million")
h2_share = sum(revenue[2:]) / sum(revenue) * 100
ax.text(0, -0.19, f"{h2_share:.1f}% recognized in the second half.", transform=ax.transAxes,
        weight="bold", fontsize=11)

customers = data["deepinfar"]["customerTypePanel"]
total = [row["rovAuvRevenueWan"] / 100 for row in customers]
defense = [row["defenseCustomerRevenueWan"] / 100 for row in customers]
other = [t - d for t, d in zip(total, defense)]
ax = axes[1]
years = [str(row["year"]) for row in customers]
ax.bar(years, defense, color="#176b7a", width=0.55, label="Defense-customer category")
bars = ax.bar(years, other, bottom=defense, color="#bdcbd0", width=0.55,
              label="All other customer categories")
ax.bar_label(bars, labels=[f"{v:.1f}" for v in total], padding=5, fontsize=11)
for i, value in enumerate(defense):
    ax.text(i, value / 2, f"{value:.1f}", ha="center", va="center", color="white", weight="bold")
ax.set_title("Deepinfar: product revenue by customer", loc="left", fontsize=14, weight="bold", pad=32)
ax.text(0, 1.025, "ROV + autonomous-underwater products", transform=ax.transAxes,
        fontsize=10, color="#526774")
ax.set_ylim(0, 270)
ax.set_ylabel("CNY million")
ax.legend(loc="upper left", bbox_to_anchor=(-0.02, -0.12), frameon=False, fontsize=10)

for ax in axes:
    ax.set_axisbelow(True)
    ax.grid(axis="y", color="#e4e9eb", linewidth=0.7)
    ax.tick_params(axis="both", length=0)

fig.text(0.07, 0.09, "Sources: Jingpin FY2025 report, p.8; Deepinfar May 2026 IPO inquiry response, p.8-1-263.",
         fontsize=9, color="#526774")
fig.text(0.07, 0.05, "Deepinfar's other customer categories are not verified civilian end use. Revenue is not a fleet count. Reviewed 15 Sep 2026.",
         fontsize=9, color="#526774")
fig.savefig(output / "scale-evidence.svg", metadata={"Date": None})
svg = output / "scale-evidence.svg"
svg.write_text("\n".join(line.rstrip() for line in svg.read_text().splitlines()) + "\n")
fig.savefig(output / "scale-evidence.png", dpi=160)
plt.close(fig)
