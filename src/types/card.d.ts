export type HSCard = {
	id: string,
	dbfId: number,
	name: string,
	text: string,
	flavor: string,
	artist: string,
	attack: number,
	cardClass: string,
	collectible: boolean,
	cost: number,
	elite?: boolean,
	faction: string,
	health: number,
	mechanics: string[],
	rarity: string,
	set: string,
    type: string,
    race?: string
};