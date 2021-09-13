export type Snowflake = `${bigint}`;

export interface APIRoleTags {
	bot_id?: Snowflake;
	premium_subscriber?: null;
	integration_id?: Snowflake;
}

export interface APIRole {
	id: Snowflake;
	name: string;
	color: number;
	hoist: boolean;
	position: number;
	permissions: string;
	managed: boolean;
	mentionable: boolean;
	tags?: APIRoleTags;
}