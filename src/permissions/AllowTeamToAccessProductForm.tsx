import { useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "@patternfly/react-core";
import {
  Select,
  SelectOption,
  SelectVariant,
} from "@patternfly/react-core/deprecated";
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
  const [isTeamSelectOpen, setIsTeamSelectOpen] = useState(false);
  const [isProductSelectOpen, setIsProductSelectOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  return (
    <div className="pf-v5-u-mt-xl">
      <Flex>
        <FlexItem>Allow</FlexItem>
        <FlexItem>
          <Select
            variant={SelectVariant.typeahead}
            onToggle={(_event, val) => setIsTeamSelectOpen(val)}
            onSelect={(event, selection) => {
              setIsTeamSelectOpen(false);
              setTeam(selection as ITeam);
            }}
            onClear={() => setTeam(null)}
            selections={team === null ? "" : team.name}
            isOpen={isTeamSelectOpen}
            aria-labelledby="select"
            placeholderText={team === null ? "..." : team.name}
            maxHeight="220px"
          >
            {teams
              .map((t) => ({ ...t, toString: () => t.name }))
              .map((team) => (
                <SelectOption key={team.id} value={team} />
              ))}
          </Select>
        </FlexItem>
        <FlexItem>to download every components from</FlexItem>
        <FlexItem>
          <Select
            variant={SelectVariant.typeahead}
            onToggle={(_event, val) => setIsProductSelectOpen(val)}
            onSelect={(event, selection) => {
              setIsProductSelectOpen(false);
              setProduct(selection as IProduct);
            }}
            onClear={() => setProduct(null)}
            selections={product === null ? "" : product.name}
            isOpen={isProductSelectOpen}
            aria-labelledby="select"
            placeholderText={product === null ? "..." : product.name}
            maxHeight="220px"
          >
            {products
              .map((p) => ({ ...p, toString: () => p.name }))
              .map((product) => (
                <SelectOption key={product.id} value={product} />
              ))}
          </Select>
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
                        `Can't grant permission to ${team.name} for product ${product.name}`,
                      ),
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
