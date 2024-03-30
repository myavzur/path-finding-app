import { House } from "@/shared/House";

export const getHouseIdsByAddresses = (
	houseAddressFrom: House["address"],
	houseAddressTo: House["address"],
	houses: House[]
) => {
	return houses.reduce(
		(ids, house) => {
			const { id, address } = house;

			const isHouseFrom = houseAddressFrom === address;
			const isHouseTo = houseAddressTo === address;

			if (isHouseFrom) {
				ids.houseFromId = id;
			}

			if (isHouseTo) {
				ids.houseToId = id;
			}

			return ids;
		},
		{ houseFromId: "", houseToId: "" }
	);
};
