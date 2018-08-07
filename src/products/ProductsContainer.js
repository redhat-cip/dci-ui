import React, { Component } from "react";
import { connect } from "react-redux";
import {isEmpty} from "lodash-es";
import DCICard from "../DCICard";
import productsActions from "./producstActions";
import teamsActions from "../teams/teamsActions";
import {CopyButton, EmptyState} from "../ui";
import NewProductButton from "./NewProductButton";
import EditProductButton from "./EditProductButton";
import ConfirmDeleteButton from "../ConfirmDeleteButton";
import { getProducts } from "./productSelectors";
import { getTeams } from "../teams/teamsSelectors";
import { MainContent } from "../layout";

export class ProductsContainer extends Component {
  componentDidMount() {
    this.props.fetchProducts();
  }

  render() {
    const { products, isFetching } = this.props;
    return (
      <MainContent>
        <DCICard
          title="Products"
          loading={isFetching && isEmpty(products)}
          empty={!isFetching && isEmpty(products)}
          HeaderButton={<NewProductButton className="pull-right" />}
          EmptyComponent={
            <EmptyState
              title="There is no products"
              info="Do you want to create one?"
              button={<NewProductButton />}
            />
          }
        >
          <table className="table table-striped table-bordered table-hover">
            <thead>
              <tr>
                <th className="text-center">ID</th>
                <th>Name</th>
                <th>Label</th>
                <th>Team Owner</th>
                <th>Description</th>
                <th>Created</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, i) => (
                <tr key={i}>
                  <td className="text-center">
                    <CopyButton text={product.id} />
                  </td>
                  <td>{product.name}</td>
                  <td>{product.label}</td>
                  <td>
                    {product.team ? product.team.name.toUpperCase() : null}
                  </td>
                  <td>{product.description}</td>
                  <td>{product.from_now}</td>
                  <td className="text-center">
                    <EditProductButton className="mr-1" key={product.etag} product={product} />
                    <ConfirmDeleteButton
                      name="product"
                      resource={product}
                      whenConfirmed={product =>
                        this.props.deleteProduct(product)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </DCICard>
      </MainContent>
    );
  }
}

function mapStateToProps(state) {
  return {
    products: getProducts(state),
    teams: getTeams(state),
    isFetching: state.products.isFetching || state.teams.isFetching
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchProducts: () => {
      dispatch(productsActions.all({ embed: "team" }));
      dispatch(teamsActions.all());
    },
    deleteProduct: product => dispatch(productsActions.delete(product))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductsContainer);
