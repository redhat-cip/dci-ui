import React, { Component } from "react";
import { connect } from "react-redux";
import { isEmpty } from "lodash";
import productsActions from "products/productsActions";
import { getProducts } from "products/productsSelectors";
import { FilterWithSearch, LoadingFilter } from "ui";
import { createProductsFilter, getCurrentFilters, removeFilter } from "./filters";

export class ProductsFilter extends Component {
  componentDidMount() {
    const { fetchProducts } = this.props;
    fetchProducts();
  }

  _cleanFiltersAndFilterJobs = filters => {
    const { filterJobs, activeFilters } = this.props;
    const otherFilters = removeFilter(activeFilters, "product_id");
    filterJobs(otherFilters.concat(filters));
  };

  render() {
    const { products, isFetching, activeFilters } = this.props;
    if (isFetching && isEmpty(products)) {
      return (
        <LoadingFilter placeholder="Filter by Product" className="pf-u-mr-xl" />
      );
    }
    const productsFilter = createProductsFilter(products);
    const productFilter = getCurrentFilters(activeFilters, productsFilter).product_id;
    return (
      <FilterWithSearch
        placeholder="Filter by Product"
        filter={productFilter}
        filters={productsFilter}
        onFilterValueSelected={newProductFilter =>
          this._cleanFiltersAndFilterJobs([newProductFilter])
        }
        className="pf-u-mr-xl"
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    products: getProducts(state),
    isFetching: state.products.isFetching
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchProducts: () => dispatch(productsActions.all())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductsFilter);
