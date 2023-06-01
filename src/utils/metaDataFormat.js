import axios from "axios";
import { PINATA_GATEWAY_BASE_URL } from "./commonUtils";

export function mapformat(old_format) {
  let new_format = {}
  new_format.image = PINATA_GATEWAY_BASE_URL + old_format.image;
  new_format.name = old_format.name;
  new_format.description = old_format.description;
  new_format.attributes = [
    {
      trait_type: "confidence",
      value: "",
    },
    {
      trait_type: "energy_level",
      value: "",
    },
    {
      trait_type: "personality",
      value: "",
    },
    {
      trait_type: "behavior",
      value: "",
    },
    {
      trait_type: "intelligence",
      value: "",
    },
    {
      trait_type: "popularity",
      value: "",
    },
  ];

  for (let i = 0; i < new_format.attributes.length; i++) {
    new_format.attributes[i].value = old_format[new_format.attributes[i].trait_type]
  }

  let res = {
    "pinataMetadata": {
      name: old_format.name
    },
    "pinataContent": new_format
  }
  return res;

}

//Get NFT detail from URI
export async function getNFTDetailsFromURI(uri) {
  try {

    const response = await axios.get(uri);

    if (!response.status === 200) {
      console.error('Unable to fetch NFT metadata');
      return null;
    }

    return response.data;

  } catch (error) {
    console.error("Error in fetching nft details : ", error);
    return null;
  }
}