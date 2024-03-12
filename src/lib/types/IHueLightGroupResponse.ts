export default interface IHueLightGroupResponse {
	name: string;
	lights: Array<number>;
	type: 'Room' | 'Entertainment';
}
