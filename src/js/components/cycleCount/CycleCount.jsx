import React, { useLayoutEffect } from "react";

import CycleCountAllProducts from "components/cycleCount/allProductsTab/CycleCountAllProducts";
import cycleCountFilterFields from "components/cycleCount/CycleCountFilterFields";
import CycleCountFilters from "components/cycleCount/CycleCountFilters";
import CycleCountHeader from "components/cycleCount/CycleCountHeader";
import CycleCountToApprove from "components/cycleCount/CycleCountToApprove";
import CycleCountToCount from "components/cycleCount/toCountTab/CycleCountToCount";
import CycleCountToResolve from "components/cycleCount/toResolveTab/CycleCountToResolve";
import Tabs from "components/listPagesUtils/Tabs";
import {
  ALL_PRODUCTS_TAB,
  TO_APPROVE_TAB,
  TO_COUNT_TAB,
  TO_RESOLVE_TAB,
} from "consts/cycleCount";
import useCycleCountFilters from "hooks/cycleCount/useCycleCountFilters";
import useCycleCountPagination from "hooks/useCycleCountPagination";
import useQueryParams from "hooks/useQueryParams";
import useResetScrollbar from "hooks/useResetScrollbar";
import useSwitchTabs from "hooks/useSwitchTabs";
import useTableCheckboxes from "hooks/useTableCheckboxes";
import useTranslation from "hooks/useTranslation";
import PageWrapper from "wrappers/PageWrapper";

import "components/cycleCount/cycleCount.scss";

const CycleCount = () => {
  const { switchTab } = useSwitchTabs({ defaultTab: ALL_PRODUCTS_TAB });
  useTranslation("cycleCount");

  const {
    defaultFilterValues,
    setFilterValues,
    categories,
    internalLocations,
    tags,
    catalogs,
    abcClasses,
    negativeQuantity,
    filterParams,
    resetForm,
    isLoading,
  } = useCycleCountFilters();

  // This is needed to pass the selected checkboxes state from "All Products" to "To Count"
  const toCountTabCheckboxes = useTableCheckboxes();
  const { setCheckedCheckboxes } = toCountTabCheckboxes;

  // Moved this here to prevent resetting number of rows per page when switching tabs.
  const tablePaginationProps = useCycleCountPagination(filterParams);
  const { pageSize, offset } = tablePaginationProps;

  const tabs = {
    [ALL_PRODUCTS_TAB]: {
      label: {
        id: "react.cycleCount.allProducts.label",
        defaultMessage: "All products",
      },
      onClick: (tab) => switchTab(tab, resetForm),
    },
    [TO_COUNT_TAB]: {
      label: {
        id: "react.cycleCount.toCount.label",
        defaultMessage: "To count",
      },
      onClick: (tab) => switchTab(tab, resetForm),
    },
    [TO_RESOLVE_TAB]: {
      label: {
        id: "react.cycleCount.toResolve.label",
        defaultMessage: "To resolve",
      },
      onClick: (tab) => switchTab(tab, resetForm),
    },
    [TO_APPROVE_TAB]: {
      label: {
        id: "react.cycleCount.toApprove.label",
        defaultMessage: "To approve",
      },
      onClick: (tab) => switchTab(tab, resetForm),
    },
  };

  const { tab } = useQueryParams();

  const { resetScrollbar } = useResetScrollbar({
    selector: "body",
  });

  useLayoutEffect(() => {
    resetScrollbar();
  }, [tab, pageSize, offset]);

  return (
    <PageWrapper>
      <CycleCountHeader />
      <div className="list-page-list-section">
        <Tabs config={tabs} className="m-3" />
        <CycleCountFilters
          defaultValues={defaultFilterValues}
          setFilterParams={setFilterValues}
          filterFields={cycleCountFilterFields}
          formProps={{
            categories,
            catalogs,
            tags,
            internalLocations,
            abcClasses,
            negativeQuantity,
          }}
          isLoading={isLoading}
        />
        {tab === ALL_PRODUCTS_TAB && (
          <CycleCountAllProducts
            switchTab={switchTab}
            filterParams={filterParams}
            resetForm={resetForm}
            setToCountCheckedCheckboxes={setCheckedCheckboxes}
            tablePaginationProps={tablePaginationProps}
          />
        )}
        {tab === TO_COUNT_TAB && (
          <CycleCountToCount
            filterParams={filterParams}
            toCountTabCheckboxes={toCountTabCheckboxes}
            tablePaginationProps={tablePaginationProps}
          />
        )}
        {tab === TO_RESOLVE_TAB && (
          <CycleCountToResolve
            filterParams={filterParams}
            tablePaginationProps={tablePaginationProps}
          />
        )}
        {tab === TO_APPROVE_TAB && <CycleCountToApprove />}
      </div>
    </PageWrapper>
  );
};

export default CycleCount;
