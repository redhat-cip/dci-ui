import { useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "@patternfly/react-core";
import { SelectWithSearch } from "ui";
import { grantTeamProductPermission } from "./permissionsActions";
import { Flex, FlexItem } from "@patternfly/react-core";
import { ITeam, IProduct } from "types";
import { AppDispatch } from "store";
import { showError } from "alerts/alertsActions";

interface AllowTeamToAccessProductFormProps {
  teams: ITeam[];
  products: IProduct[];
  onClick: (team: ITeam, product: IProduct) => void;
}

export default function AllowTeamToAccessProductForm({
  teams,
  products,
  onClick,
}: AllowTeamToAccessProductFormProps) {
  const [team, setTeam] = useState<ITeam | null>(null);
  const [product, setProduct] = useState<IProduct | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className="mt-xl">
      <Flex>
        <FlexItem>Allow</FlexItem>
        <FlexItem>
          <SelectWithSearch
            placeholder={team === null ? "..." : team.name}
            option={team}
            options={teams}
            onClear={() => {
              setTeam(null);
            }}
            onSelect={(team) => setTeam(team as ITeam)}
          />
        </FlexItem>
        <FlexItem>to download every components from</FlexItem>
        <FlexItem>
          <SelectWithSearch
            placeholder={product === null ? "..." : product.name}
            option={product}
            options={products}
            onClear={() => {
              setProduct(null);
            }}
            onSelect={(resource) => {
              setProduct(resource as IProduct);
            }}
          />
        </FlexItem>
        <FlexItem>product</FlexItem>
        <FlexItem>
          <Button
            variant="primary"
            isDisabled={team === null || product === null}
            onClick={() => {
              if (team !== null && product !== null) {
                dispatch(grantTeamProductPermission(team, product))
                  .then(() => {
                    onClick(team, product);
                  })
                  .catch(() => {
                    dispatch(
                      showError(
                        `Can't grant permission to ${team.name} for product ${product.name}`
                      )
                    );
                  });
              }
            }}
          >
            Confirm
          </Button>
        </FlexItem>
      </Flex>
    </div>
  );
}
