import { TreeNode } from "rc-tree";
import React from "react";

const setLeaf = (treeData) => {
  const loopLeaf = (data) => {
    data.forEach((item) => {
      if (item.children) {
        loopLeaf(item.children);
      }
    });
  };
  loopLeaf(treeData);
};

export const getNewTreeData = (treeData, curKey, child) => {
  const loop = (data) => {
    data.forEach((item) => {
      if (item.children) {
        loop(item.children);
      } else {
        if (curKey === item.key) {
          item.children = child;
        }
      }
    });
  };
  loop(treeData);
  setLeaf(treeData);
};

export const loopLoading = (data) => {
  return data.map((item) =>
    item.children ? (
      <TreeNode title={item.text} key={item.key}>
        {loopLoading(item.children)}
      </TreeNode>
    ) : (
      <TreeNode title={item.text} key={item.key} />
    )
  );
};

/**
 * This is very expensive operation use it wisely
 *
 * @param {*} target
 * @param {*} source
 * @returns
 */
export const mergeDeep = (target, source) => {
  const isObject = (obj) => obj && typeof obj === "object";

  if (!isObject(target) || !isObject(source)) {
    return source;
  }

  Object.keys(source).forEach((key) => {
    const targetValue = target[key];
    const sourceValue = source[key];

    if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
      // Skip Array Mutation
    } else if (isObject(targetValue) && isObject(sourceValue)) {
      target[key] = mergeDeep(Object.assign({}, targetValue), sourceValue);
    } else {
      target[key] = sourceValue;
    }
  });

  return target;
};
