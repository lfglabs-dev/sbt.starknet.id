import { useDomainFromAddress } from "./naming";

export function useMinified(input: string): string {
  if (input.length > 18) {
    const firstPart = input.substring(0, 7);
    const secondPart = input.substring(input.length - 5, input.length);
    return (firstPart + "..." + secondPart).toLowerCase();
  }
  return input;
}

export function useDisplayName(address: string | undefined): string {
  const domain = useDomainFromAddress(address);
  const displayName = useMinified(domain ? domain : address ? address : "none");
  return displayName;
}
