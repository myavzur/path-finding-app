import { House } from "@/shared/House";
import { HouseTableColumns } from "../../../../../IndexDB";

export const getHouseIdsByAddresses = (
	houseAddressFrom: House["address"],
	houseAddressTo: House["address"],
	housesInfo: HouseTableColumns[]
) => {
	return housesInfo.reduce(
		(ids, info) => {
			const { id, houseAddress } = info;

			const isHouseFrom = houseAddressFrom === houseAddress;
			const isHouseTo = houseAddressTo === houseAddress;

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
