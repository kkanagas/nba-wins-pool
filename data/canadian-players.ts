// data/canadian-players.ts

export interface CanadianPlayer {
  id: number;
  name: string;
  team: string;
  position: string;
  hometown: string;
}

export const CANADIAN_PLAYERS: CanadianPlayer[] = [
  { id: 175, name: "Shai Gilgeous-Alexander", team: "OKC", position: "G", hometown: "Hamilton, ON" },
  { id: 335, name: "Jamal Murray", team: "DEN", position: "G", hometown: "Kitchener, ON" },
  { id: 27, name: "RJ Barrett", team: "TOR", position: "F", hometown: "Mississauga, ON" },
  { id: 476, name: "Andrew Wiggins", team: "MIA", position: "F", hometown: "Thornhill, ON" },
  { id: 71, name: "Dillon Brooks", team: "PHX", position: "F", hometown: "Mississauga, ON" },
  { id: 17896055, name: "Luguentz Dort", team: "ATL", position: "G", hometown: "Montreal, QC" },
  { id: 38017703, name: "Bennedict Mathurin", team: "NOP", position: "G", hometown: "Montreal, QC" },
  { id: 38017688, name: "Andrew Nembhard", team: "IND", position: "G", hometown: "Aurora, ON" },
  { id: 38017707, name: "Shaedon Sharpe", team: "POR", position: "G", hometown: "London, ON" },
  { id: 121703080, name: "Zach Edey", team: "MEM", position: "C", hometown: "Toronto, ON" },
  { id: 10, name: "Nickeil Alexander-Walker", team: "ATL", position: "G", hometown: "Toronto, ON" },
  { id: 121703082, name: "Kyshawn George", team: "WAS", position: "G", hometown: "Montreal, QC" },
  { id: 377, name: "Dwight Powell", team: "DAL", position: "F", hometown: "Toronto, ON" },
  { id: 48721245, name: "Leonard Miller", team: "CHI", position: "F", hometown: "Scarborough, ON" },
  { id: 121703110, name: "Will Riley", team: "WAS", position: "G/F", hometown: "Kitchener, ON" },
  { id: 282, name: "Trey Lyles", team: "MIN", position: "F", hometown: "Saskatoon, SK" },
  { id: 48721248, name: "Olivier-Maxence Prosper", team: "MEM", position: "F", hometown: "Montreal, QC" },
  { id: 121703088, name: "Ryan Nembhard", team: "DEN", position: "G", hometown: "Aurora, ON" },
];