import {
  FormControl,
  FormHelperText,
  InputLabel,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
} from "@mui/material";
import { useAccount } from "@starknet-react/core";
import React, { FunctionComponent, useEffect, useState } from "react";
import { hexToFelt } from "../../utils/felt";

type SelectIdentityProps = {
  tokenId: string;
  changeTokenId: (value: string) => void;
  defaultText?: string;
};

type Identity = {
  id: string;
  domain?: string;
};

const SelectIdentity: FunctionComponent<SelectIdentityProps> = ({
  tokenId,
  changeTokenId,
  defaultText = "Mint a new starknet.id",
}) => {
  const { account } = useAccount();
  const [ownedIdentities, setOwnedIdentities] = useState<Identity[] | []>([]);

  useEffect(() => {
    if (account) {
      fetch(
        `${
          process.env.NEXT_PUBLIC_APP_LINK
        }/api/indexer/addr_to_full_ids?addr=${hexToFelt(account.address)}`
      )
        .then((response) => response.json())
        .then((data) => {
          setOwnedIdentities(data.full_ids);
        });
    }
  }, [account]);

  return (
    <div className="mt-3">
      <FormControl fullWidth>
        <InputLabel>Starknet.id</InputLabel>
        <Select
          value={tokenId}
          defaultValue={ownedIdentities[0]?.id}
          label="Starknet.id"
          onChange={(e) => changeTokenId(e.target.value)}
          sx={{
            "& .MuiSelect-select": {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            },
          }}
        >
          <MenuItem value={0}>
            <ListItemIcon>
              <img
                width={"25px"}
                src="/visuals/StarknetIdLogo.svg"
                alt="starknet.id avatar"
              />
            </ListItemIcon>
            <ListItemText primary={defaultText} />
          </MenuItem>
          {ownedIdentities.map((identity: Identity, index: number) => (
            <MenuItem key={index} value={identity.id}>
              <ListItemIcon>
                <img
                  width={"25px"}
                  src={`https://www.starknet.id/api/identicons/${identity.id}`}
                  alt="starknet.id avatar"
                />
              </ListItemIcon>
              <ListItemText primary={identity?.domain ?? identity.id} />
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>
          Choose the starknet identity you want to link with your identity token
        </FormHelperText>
      </FormControl>
    </div>
  );
};

export default SelectIdentity;
