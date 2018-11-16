import React, { Component } from "react";
import { connect } from "react-redux";
import { isEmpty } from "lodash";
import { Page } from "../layout";
import productsActions from "./producstActions";
import teamsActions from "../teams/teamsActions";
import { CopyButton, EmptyState } from "../ui";
import NewProductButton from "./NewProductButton";
import EditProductButton from "./EditProductButton";
import ConfirmDeleteButton from "../ConfirmDeleteButton";
import { getProducts } from "./productSelectors";
import { getTeams } from "../teams/teamsSelectors";

export class ProductsContainer extends Component {
  componentDidMount() {
    this.props.fetchProducts();
  }

  render() {
    const { products, isFetching } = this.props;
    return (
      <Page
        title="Products"
        loading={isFetching && isEmpty(products)}
        empty={!isFetching && isEmpty(products)}
        HeaderButton={<NewProductButton />}
        EmptyComponent={
          <EmptyState
            title="There is no products"
            info="Do you want to create one?"
          />
        }
      >
        <table className="pf-c-table pf-m-compact pf-m-grid-md">
          <thead>
            <tr>
              <th className="pf-u-text-align-center pf-m-width-5">ID</th>
              <th className="pf-m-width-10">Name</th>
              <th className="pf-m-width-10">Label</th>
              <th className="pf-m-width-10">Team Owner</th>
              <th className="pf-m-width-35">Description</th>
              <th className="pf-m-width-10 pf-u-text-align-center">Created</th>
              <th className="pf-u-text-align-center pf-m-width-20">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={`${product.id}.${product.etag}`}>
                <td className="pf-u-text-align-center">
                  <CopyButton text={product.id} />
                </td>
                <td>{product.name}</td>
                <td>{product.label}</td>
                <td>{product.team ? product.team.name.toUpperCase() : null}</td>
                <td>{product.description}</td>
                <td className="pf-u-text-align-center">{product.from_now}</td>
                <td className="pf-u-text-align-center">
                  <EditProductButton className="pf-u-mr-xs" product={product} />
                  <ConfirmDeleteButton
                    title={`Delete product ${product.name}`}
                    content={`Are you sure you want to delete ${product.name}?`}
                    whenConfirmed={() => this.props.deleteProduct(product)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Page>
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
