// data/canadian-players.ts

export interface CanadianPlayer {
  id: number;
  name: string;
  team: string;
  position: string;
  hometown: string;
}

export const CANADIAN_PLAYERS: CanadianPlayer[] = [
  { id: 4278077, name: "Shai Gilgeous-Alexander", team: "OKC", position: "G", hometown: "Hamilton, ON" },
  { id: 3936299, name: "Jamal Murray", team: "DEN", position: "G", hometown: "Kitchener, ON" },
  { id: 4395625, name: "RJ Barrett", team: "TOR", position: "F", hometown: "Mississauga, ON" },
  { id: 3059319, name: "Andrew Wiggins", team: "MIA", position: "F", hometown: "Thornhill, ON" },
  { id: 4066371, name: "Dillon Brooks", team: "PHX", position: "F", hometown: "Mississauga, ON" },
  { id: 4395701, name: "Luguentz Dort", team: "ATL", position: "G", hometown: "Montreal, QC" },
  { id: 4683021, name: "Bennedict Mathurin", team: "NOP", position: "G", hometown: "Montreal, QC" },
  { id: 4432158, name: "Andrew Nembhard", team: "IND", position: "G", hometown: "Aurora, ON" },
  { id: 4432161, name: "Shaedon Sharpe", team: "POR", position: "G", hometown: "London, ON" },
  { id: 5105652, name: "Zach Edey", team: "MEM", position: "C", hometown: "Toronto, ON" },
  { id: 4397042, name: "Nickeil Alexander-Walker", team: "ATL", position: "G", hometown: "Toronto, ON" },
  { id: 5105634, name: "Kyshawn George", team: "WAS", position: "G", hometown: "Montreal, QC" },
  { id: 2581177, name: "Dwight Powell", team: "DAL", position: "F", hometown: "Toronto, ON" },
  { id: 4683679, name: "Leonard Miller", team: "CHI", position: "F", hometown: "Scarborough, ON" },
  { id: 5194452, name: "Will Riley", team: "WAS", position: "G/F", hometown: "Kitchener, ON" },
  { id: 3138334, name: "Trey Lyles", team: "MIN", position: "F", hometown: "Saskatoon, SK" },
  { id: 5105524, name: "Olivier-Maxence Prosper", team: "MEM", position: "F", hometown: "Montreal, QC" },
  { id: 5176189, name: "Ryan Nembhard", team: "DEN", position: "G", hometown: "Aurora, ON" },
];