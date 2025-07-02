import {
  Card,
  CardBody,
  Button,
  CardTitle,
  Skeleton,
  Switch,
  Popover,
} from "@patternfly/react-core";
import { HelpIcon } from "@patternfly/react-icons";
import type { ITeam } from "types";
import { Table, Tr, Tbody, Td } from "@patternfly/react-table";
import {
  useAddProductToTeamMutation,
  useGetProductIdsTeamHasAccessToQuery,
  useRemoveProductFromTeamMutation,
} from "./teamsApi";
import { useListProductsQuery } from "products/productsApi";
import ProductIcon from "products/ProductIcon";

function ProductsTeamHasAccessToTable({ team }: { team: ITeam }) {
  const { data, isLoading } = useListProductsQuery();
  const {
    data: productsIdsTeamHasAccessTo,
    isLoading: isLoadingTeamHasAccessTo,
  } = useGetProductIdsTeamHasAccessToQuery(team.id);
  const [removeProductFromTeam, { isLoading: isRemoving }] =
    useRemoveProductFromTeamMutation();
  const [addProductToTeam, { isLoading: isLoadingAddProductToTeam }] =
    useAddProductToTeamMutation();

  if (isLoading || isLoadingTeamHasAccessTo) {
    return (
      <Skeleton screenreaderText="Loading products the team has access to" />
    );
  }

  if (!data || !productsIdsTeamHasAccessTo) {
    return null;
  }

  return (
    <Table borders={false}>
      <Tbody>
        {data.products.length === 0 && (
          <Tr>
            <Td colSpan={-1}>
              There is no product available. Please contact a Distributed CI
              administrator
            </Td>
          </Tr>
        )}
        {data.products.map((product) => (
          <Tr key={product.id}>
            <Td>
              <ProductIcon name={product.name} className="pf-v6-u-mr-xs" />
              {product.name}
            </Td>
            <Td isActionCell>
              <Switch
                id={`product-${product.id}-team-${team.id}-access`}
                aria-label={`team ${team.name} has access to ${product.name}`}
                isChecked={productsIdsTeamHasAccessTo.includes(product.id)}
                isDisabled={
                  isRemoving ||
                  isLoadingAddProductToTeam ||
                  isLoadingTeamHasAccessTo
                }
                onChange={(e, hasAccessToProduct) => {
                  if (hasAccessToProduct) {
                    addProductToTeam({ team, product });
                  } else {
                    removeProductFromTeam({ team, product });
                  }
                }}
              />
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}

export default function ProductsTeamHasAccessTo({ team }: { team: ITeam }) {
  return (
    <Card>
      <CardTitle>
        Product access
        <Popover bodyContent="If a product is checked, then the team has access to all released components of the product.">
          <Button
            type="button"
            variant="plain"
            icon={<HelpIcon />}
            aria-label="More info on product access"
            onClick={(e) => e.preventDefault()}
          />
        </Popover>
      </CardTitle>
      <CardBody>
        <ProductsTeamHasAccessToTable team={team} />
      </CardBody>
    </Card>
  );
}
