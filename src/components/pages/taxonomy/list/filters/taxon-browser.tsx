import "rc-tree/assets/index.css";

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
import Tree from "rc-tree";
import React, { Component } from "react";

import useTaxonFilter from "../use-taxon";

class TaxonBrowserComponent extends Component<TaxonBrowserProps, TaxonBrowserState> {
  constructor(props) {
    super(props);
    this.state = {
      treeData: [],
      selectedKeys: this.props.initialTaxon ? this.props.initialTaxon.toString()?.split(",") : [],
      expandedKeys: [],
      resultsCount: -1,
      allResultKeys: []
    };
  }

  onExpand = (expandedKeys) => this.setState({ expandedKeys });

  onSelect = (selectedKeys) => {
    if (selectedKeys.length) {
      this.setState({ selectedKeys });
      this.props.onTaxonChange("taxonId", selectedKeys[0]?.toString());
    }
  };

  // new method
  onNavigate = async (taxonId) => {
    const treeData = await axGetTaxonList({ expand_taxon: true, taxonIds: taxonId });
    const expandedKeys = Array.from(new Set([...this.state.expandedKeys, ...(treeData?.[0]?.ids || [])]));
    this.setState({ selectedKeys: [taxonId], treeData: mergeDeep(this.state.treeData, treeData), expandedKeys }, () => {
      this.props.onTaxonChange("taxonId", taxonId.toString());
      setTimeout(() => {
        const node = document.querySelectorAll(".rc-tree-node-selected")?.[0];
        node?.scrollIntoView({ block: "center" });
      }, 100);
    });
  };

  // in setParentState
  setParentState = (d) => {
    this.setState({ ...d, allResultKeys: d.selectedKeys, selectedKeys: [d.selectedKeys[0]] });
    this.props.onTaxonChange("taxonId", d.selectedKeys[0]?.toString());
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

        <TaxonResultArrows resultsCount={this.state.resultsCount} allResultKeys={this.state.allResultKeys} onNavigate={this.onNavigate}/>
      </TaxonBrowserContainer>
    );
  }
}

export default function TaxonBrowserFilter() {
  const { filter, addFilter } = useTaxonFilter();

  return <TaxonBrowserComponent initialTaxon={filter?.taxonId} onTaxonChange={addFilter} />;
}
