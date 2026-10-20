// data/canadian-players.ts

export interface CanadianPlayer {
  id: number;
  name: string;
  team: string;
  position: string;
  hometown: string;
}

export const CANADIAN_PLAYERS: CanadianPlayer[] = [
  { id: 1628983, name: "Shai Gilgeous-Alexander", team: "OKC", position: "G", hometown: "Hamilton, ON" },
  { id: 1627732, name: "Jamal Murray", team: "DEN", position: "G", hometown: "Kitchener, ON" },
  { id: 1629630, name: "RJ Barrett", team: "TOR", position: "F", hometown: "Mississauga, ON" },
  { id: 203952, name: "Andrew Wiggins", team: "MIA", position: "F", hometown: "Thornhill, ON" },
  { id: 1628415, name: "Dillon Brooks", team: "PHX", position: "F", hometown: "Mississauga, ON" },
  { id: 1629634, name: "Luguentz Dort", team: "ATL", position: "G", hometown: "Montreal, QC" },
  { id: 1631097, name: "Bennedict Mathurin", team: "NOP", position: "G", hometown: "Montreal, QC" },
  { id: 1631209, name: "Andrew Nembhard", team: "IND", position: "G", hometown: "Aurora, ON" },
  { id: 1631128, name: "Shaedon Sharpe", team: "POR", position: "G", hometown: "London, ON" },
  { id: 1642259, name: "Zach Edey", team: "MEM", position: "C", hometown: "Toronto, ON" },
  { id: 1629638, name: "Nickeil Alexander-Walker", team: "ATL", position: "G", hometown: "Toronto, ON" },
  { id: 1630534, name: "Kyshawn George", team: "WAS", position: "G", hometown: "Montreal, QC" },
  { id: 1630561, name: "Dwight Powell", team: "DAL", position: "F", hometown: "Toronto, ON" },
  { id: 1631200, name: "Leonard Miller", team: "CHI", position: "F", hometown: "Scarborough, ON" },
  { id: 1630592, name: "Will Riley", team: "WAS", position: "G/F", hometown: "Kitchener, ON" },
  { id: 1626168, name: "Trey Lyles", team: "MIN", position: "F", hometown: "Saskatoon, SK" },
  { id: 1641765, name: "Olivier-Maxence Prosper", team: "MEM", position: "F", hometown: "Montreal, QC" },
  { id: 1642358, name: "Ryan Nembhard", team: "DEN", position: "G", hometown: "Aurora, ON" },
];