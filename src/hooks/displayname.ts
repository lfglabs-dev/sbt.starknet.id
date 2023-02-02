import { useState, useEffect } from "react";
import BN from "bn.js";

type AddrToDomain = {
    domain: string;
    domain_expiry: number;
};

export function useMinified(input: string): string {
    if (input.length > 16) {
        const firstPart = input.substring(0, 6);
        const secondPart = input.substring(input.length - 4, input.length);
        return (firstPart + "..." + secondPart).toLowerCase();
    }
    return input;
}

export function useUpdatedDomainFromAddress(
    address: string | undefined
): string {
    const [domain, setDomain] = useState("");

    useEffect(() => {
        if (!address || !/^0x[0123456789abcdefABCDEF]+$/.test(address)) return;
        updateDomain(new BN(address.slice(2), 16).toString(10));
    }, [address]);

    const updateDomain = (decimalAddr: string) =>
        fetch(`${process.env.NEXT_PUBLIC_APP_LINK}/api/indexer/addr_to_domain?addr=${decimalAddr}`)
            .then((response) => response.json())
            .then((data: AddrToDomain) => {
                setDomain(data.domain);
            });

    return domain;
}