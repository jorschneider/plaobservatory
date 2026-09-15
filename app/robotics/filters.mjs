/** @template {{id:string,supplier:string,englishName:string|null,capabilityFamily:string,nodeId:string,lane:string,tier:string}} T
 * @param {T[]} cards @param {string} query @param {string} lane @param {string} tier
 */
export function filterScorecards(cards, query, lane = "all", tier = "all") {
  const q = query.trim().toLowerCase();
  return cards.filter((c) => (lane === "all" || c.lane === lane) && (tier === "all" || c.tier === tier) && (!q || `${c.id} ${c.supplier} ${c.englishName ?? ""} ${c.capabilityFamily} ${c.nodeId}`.toLowerCase().includes(q)))
    .sort((a, b) => (a.englishName || a.supplier).localeCompare(b.englishName || b.supplier));
}
