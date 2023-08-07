import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty, uniqBy } from "lodash";
import { Button, TextContent, Text } from "@patternfly/react-core";
import { TrashIcon, InfoCircleIcon } from "@patternfly/react-icons";
import {
  getProductsWithTeams,
  removeTeamProductPermission,
} from "./permissionsActions";
import { IProductWithTeams } from "types";
import { AppDispatch } from "store";
import AllowTeamToAccessProductForm from "./AllowTeamToAccessProductForm";
import teamsActions from "teams/teamsActions";
import { getTeams } from "teams/teamsSelectors";
import { global_info_color_100 } from "@patternfly/react-tokens";
import { Table, Tr, Tbody, Td } from "@patternfly/react-table";

export default function ProductsPermissionsPage() {
  const [products, setProducts] = useState<IProductWithTeams[]>([]);
  const teams = useSelector(getTeams);
  const [isFetching, setIsFetching] = useState(true);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getProductsWithTeams())
      .then(setProducts)
      .finally(() => setIsFetching(false));
    dispatch(teamsActions.all());
  }, [dispatch]);

  return (
    <div>
      {isFetching ? (
        <div className="py-md">loading...</div>
      ) : (
        <div>
          <TextContent className="pf-v5-u-mt-lg">
            <Text component="p">
              <div
                style={{
                  backgroundColor: global_info_color_100.value,
                  padding: "1em",
                }}
              >
                <InfoCircleIcon className="pf-v5-u-mr-xs" />
                By giving access to a product, a team can download all topics
                non restricted. If you want to give access to a restricted topic
                (topic under export control policy for example), you can use the
                Topics tab.
              </div>
            </Text>
          </TextContent>
          <AllowTeamToAccessProductForm
            teams={teams}
            products={products}
            onClick={(team, product) => {
              const newProducts = products.map((p) => {
                if (p.id === product.id) {
                  p.teams = uniqBy([...p.teams, team], "id");
                }
                return p;
              });
              setProducts(newProducts);
            }}
          />
          {products.map((product) => {
            if (isEmpty(product.teams)) return null;
            return (
              <TextContent
                key={`${product.id}.${product.etag}`}
                className="pf-v5-u-mt-lg"
              >
                <Text component="h1">{product.name}</Text>
                <Text component="p">
                  List of teams that have access to {product.name}
                </Text>
                <Table
                  className="pf-v5-c-table pf-m-grid-md pf-m-compact"
                  role="grid"
                >
                  <Tbody>
                    {product.teams.map((team) => (
                      <Tr key={`${team.id}.${team.etag}`}>
                        <Td className="pf-m-width-30">{team.name}</Td>
                        <Td className="pf-m-width-70">
                          <Button
                            variant="secondary"
                            isDanger
                            icon={<TrashIcon />}
                            onClick={() =>
                              dispatch(
                                removeTeamProductPermission(team, product),
                              ).then(() => {
                                const newProducts = products.map((p) => {
                                  if (p.id === product.id) {
                                    p.teams = p.teams.filter(
                                      (t) => t.id !== team.id,
                                    );
                                  }
                                  return p;
                                });
                                setProducts(newProducts);
                              })
                            }
                          >
                            remove {team.name} permission
                          </Button>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TextContent>
            );
          })}
        </div>
      )}
    </div>
  );
}
