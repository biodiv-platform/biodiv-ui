import { Spinner } from "@chakra-ui/react";
import {
  TaxonBrowserContainer,
  TaxonBrowserProps,
  TaxonBrowserState
} from "@components/pages/observation/list/filters/taxon-browser/taxon-browser";
import {
  getNewTreeData,
  loopLoading,
  mergeDeep
} from "@components/pages/observation/list/filters/taxon-browser/taxon-browser-helpers";
import TaxonResultArrows from "@components/pages/observation/list/filters/taxon-browser/taxon-result-arrows";
import TaxonSuggest from "@components/pages/observation/list/filters/taxon-browser/taxon-suggest";
import { axGetTaxonList } from "@services/api.service";
import Head from "next/head";
import Tree from "rc-tree";
import React, { Component } from "react";

import useTaxonFilter from "../use-taxon";

class TaxonBrowserComponent extends Component<TaxonBrowserProps, TaxonBrowserState> {
  constructor(props) {
    super(props);
    this.state = {
      treeData: [],
      selectedKeys: this.props.initialTaxon ? this.props.initialTaxon?.split(",") : [],
      expandedKeys: [],
      resultsCount: -1
    };
  }

  onExpand = (expandedKeys) => this.setState({ expandedKeys });

  onSelect = (selectedKeys) => {
    if (selectedKeys.length) {
      this.setState({ selectedKeys });
      this.props.onTaxonChange("taxonId", selectedKeys?.toString());
    }
  };

  setParentState = (d) => {
    this.props.onTaxonChange("taxonId", d.selectedKeys?.toString());
    this.setState(d);
  };

  expandInitialTaxon = async () => {
    if (!this.state.selectedKeys.length) {
      return;
    }

    const treeData = await axGetTaxonList({
      expand_taxon: true,
      taxonIds: this.state.selectedKeys.toString()
    });

    if (!treeData.length) {
      return;
    }

    const expandedKeys = Array.from(
      new Set([...this.state.expandedKeys, ...(treeData?.[0]?.ids || [])])
    );

    this.setState({
      treeData: mergeDeep(this.state.treeData, treeData),
      expandedKeys
    });

    document.querySelectorAll(".rc-tree-node-selected")?.[0]?.scrollIntoView({ block: "center" });
  };

  componentDidMount() {
    axGetTaxonList({}).then((treeData) => {
      // sets root taxon browser nodes
      this.setState({ treeData });
      // if `showTaxon` is passed in URL automatically opens modal
      this.expandInitialTaxon();
    });
  }

  onLoadData = async (treeNode) => {
    const treeData = [...this.state.treeData];
    const nodes = await axGetTaxonList(treeNode);
    getNewTreeData(treeData, treeNode.key, nodes);
    this.setState({ treeData });
  };

  render() {
    const treeNodes = loopLoading(this.state.treeData);

    return (
      <TaxonBrowserContainer id="taxon-browser">
        <Head>
          <link rel="stylesheet" href="https://unpkg.com/rc-tree/assets/index.css" key="rc-tree" />
        </Head>

        <TaxonSuggest setParentState={this.setParentState} parentState={this.state} />

        <div id="taxon-browser-tree">
          {this.state.treeData.length ? (
            <Tree
              showIcon={false}
              showLine={true}
              selectable={true}
              checkStrictly={true}
              loadData={this.onLoadData}
              onExpand={this.onExpand}
              expandedKeys={this.state.expandedKeys}
              selectedKeys={this.state.selectedKeys}
              onSelect={this.onSelect}
            >
              {treeNodes}
            </Tree>
          ) : (
            <Spinner m={2} />
          )}
        </div>

        <TaxonResultArrows resultsCount={this.state.resultsCount} />
      </TaxonBrowserContainer>
    );
  }
}

export default function TaxonBrowserFilter() {
  const { filter, addFilter } = useTaxonFilter();

  return <TaxonBrowserComponent initialTaxon={filter?.taxonId} onTaxonChange={addFilter} />;
}
