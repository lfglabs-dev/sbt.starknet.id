import { useContract } from "@starknet-react/core";
import naming_abi from "../abi/starknet/naming_abi.json";
import { Abi } from "starknet";

export function useNamingContract() {
  return useContract({
    abi: naming_abi as Abi,
    address: process.env.NEXT_PUBLIC_NAMING_CONTRACT,
  });
}
