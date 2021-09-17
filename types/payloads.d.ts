export type Snowflake = `${bigint}`;

export interface RolePayloadTags {
	bot_id?: Snowflake;
	premium_subscriber?: null;
	integration_id?: Snowflake;
}

export interface RolePayload {
	id: Snowflake;
	name: string;
	color: number;
	hoist: boolean;
	position: number;
	permissions: string;
	managed: boolean;
	mentionable: boolean;
	tags?: RolePayloadTags;
}