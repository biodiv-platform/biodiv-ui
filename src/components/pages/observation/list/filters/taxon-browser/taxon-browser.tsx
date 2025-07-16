import "rc-tree/assets/index.css";

import { Box, Spinner } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { axGetTaxonList } from "@services/api.service";
import Tree from "rc-tree";
import React, { Component } from "react";

import { getNewTreeData, loopLoading } from "./taxon-browser-helpers";
import TaxonResultArrows from "./taxon-result-arrows";
import TaxonSuggest from "./taxon-suggest";

export interface TaxonBrowserProps {
  initialTaxon;
  onTaxonChange;
  taxonFilterKey?;
}

export interface TaxonBrowserState {
  treeData;
  selectedKeys;
  checkedKeys?;
  expandedKeys;
  resultsCount;
}

export const TaxonBrowserContainer = styled.div`
  #taxon-browser-tree {
    max-height: 20rem;
    overflow: auto;
    border-radius: 0.25rem;
    position: relative;
    border: 1px solid var(--chakra-colors-gray-300);
    padding: 0.75rem;
    background: var(--chakra-colors-white);
  }

  .rc-tree .rc-tree-treenode {
    span {
      &.rc-tree-switcher,
      &.rc-tree-checkbox,
      &.rc-tree-iconEle {
        background-image: url("/next-assets/tree-icons.svg");
      }

      &.rc-tree-icon_loading {
        margin-right: 0;
        vertical-align: middle;
        background: url("/next-assets/tree-spinner.svg") no-repeat scroll 0 0 transparent;
      }
    }

    .rc-tree-node-content-wrapper {
      height: 1.5rem;
    }
  }
`;

export default class TaxonBrowser extends Component<TaxonBrowserProps, TaxonBrowserState> {
  constructor(props) {
    super(props);
    this.state = {
      treeData: [],
      selectedKeys: [],
      checkedKeys: this.props.initialTaxon ? this.props.initialTaxon.split(",") : [],
      expandedKeys: [],
      resultsCount: -1
    };
  }

  onExpand = (expandedKeys) => this.setState({ expandedKeys });
  onCheck = (checkedKeys) => {
    this.setState({ checkedKeys });
    this.props.onTaxonChange(
      this.props.taxonFilterKey || "taxon",
      checkedKeys?.checked?.toString()
    );
  };
  setParentState = (d) => this.setState(d);

  componentDidMount() {
    axGetTaxonList({}).then((treeData) => {
      this.setState({ treeData });
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

        <Box id="taxon-browser-tree" pl={4} pr={4}>
          {this.state.treeData.length ? (
            <Tree
              checkable={true}
              showIcon={false}
              showLine={true}
              selectable={true}
              multiple={true}
              checkStrictly={true}
              loadData={this.onLoadData}
              onCheck={this.onCheck}
              checkedKeys={this.state.checkedKeys}
              onExpand={this.onExpand}
              expandedKeys={this.state.expandedKeys}
              selectedKeys={this.state.selectedKeys}
            >
              {treeNodes}
            </Tree>
          ) : (
            <Spinner m={2} />
          )}
        </Box>

        <TaxonResultArrows resultsCount={this.state.resultsCount} />
      </TaxonBrowserContainer>
    );
  }
}
