import Tooltip from "@components/@core/tooltip";
import useTranslation from "@configs/i18n/useTranslation";
import { AssetStatus } from "@interfaces/custom";
import React from "react";

export default function StatusIcon({ type }: { type?: AssetStatus }) {
  const { t } = useTranslation();

  switch (type) {
    case AssetStatus.Uploaded:
      return (
        <Tooltip title={t("OBSERVATION.UPLOAD_STATUS.UPLOADED")} hasArrow={true}>
          <svg
            className="icon"
            width="24"
            height="24"
            viewBox="0 0 189 188"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M179.472 94C179.472 140.853 141.49 178.835 94.637 178.835C47.7839 178.835 9.80196 140.853 9.80196 94C9.80196 47.1469 47.7839 9.165 94.637 9.165C141.49 9.165 179.472 47.1469 179.472 94Z"
              fill="#3DA942"
              stroke="white"
              strokeWidth="18.33"
            />
            <path
              d="M97.7092 50.3329C116.069 50.3329 122.761 64.7493 126.615 77.6805C127.094 77.6471 127.561 77.5282 128.051 77.5282C140.358 77.5282 150.327 87.4967 150.327 99.8042C150.327 112.112 140.358 122.08 128.051 122.08H66.7921C51.4105 122.08 38.9471 109.617 38.9471 94.2352C38.9471 78.8537 51.4105 66.3903 66.7921 66.3903C68.7412 66.3903 70.6321 66.5989 72.4698 66.9776C78.217 59.8827 82.4604 50.3329 97.7092 50.3329Z"
              fill="white"
            />
          </svg>
        </Tooltip>
      );

    case AssetStatus.InProgress:
      return (
        <Tooltip title={t("OBSERVATION.UPLOAD_STATUS.UPLOADING")} hasArrow={true}>
          <svg
            className="icon bounce"
            width="24"
            height="24"
            viewBox="0 0 189 188"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M179.8 94C179.8 140.853 141.818 178.835 94.9648 178.835C48.1118 178.835 10.1298 140.853 10.1298 94C10.1298 47.1469 48.1118 9.165 94.9648 9.165C141.818 9.165 179.8 47.1469 179.8 94Z"
              fill="#0D91FB"
              stroke="white"
              strokeWidth="18.33"
            />
            <path
              d="M136.282 96.0739C134.57 97.7899 132.323 98.6525 130.076 98.6525C127.829 98.6525 125.582 97.7899 123.87 96.0739L103.742 75.8946V133.339C103.742 138.197 99.8183 142.139 94.9648 142.139C90.1107 142.139 86.1865 138.197 86.1865 133.339V75.8946L66.0593 96.0739C62.6273 99.5144 57.0794 99.5144 53.6474 96.0739C50.2154 92.6328 50.2154 87.0708 53.6474 83.6303L88.7503 48.4373C89.5579 47.6189 90.532 46.9766 91.612 46.5278C93.7534 45.6388 96.1762 45.6388 98.3181 46.5278C99.3981 46.9766 100.372 47.6189 101.18 48.4373L136.283 83.6303C139.714 87.0708 139.714 92.6328 136.282 96.0739V96.0739Z"
              fill="white"
            />
          </svg>
        </Tooltip>
      );

    case AssetStatus.Failed:
      return (
        <Tooltip title={t("OBSERVATION.UPLOAD_STATUS.FAILED")} hasArrow={true}>
          <svg
            className="icon"
            width="24"
            height="24"
            viewBox="0 0 189 188"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M179.136 94C179.136 140.853 141.154 178.835 94.3009 178.835C47.4478 178.835 9.4659 140.853 9.4659 94C9.4659 47.1469 47.4478 9.165 94.3009 9.165C141.154 9.165 179.136 47.1469 179.136 94Z"
              fill="#CE3D3B"
              stroke="white"
              strokeWidth="18.33"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M94.301 107.755L114.87 128.324C119.002 132.456 125.101 133.064 129.233 128.932C133.365 124.8 132.757 118.701 128.625 114.569L108.056 94L128.625 73.4309C132.757 69.2989 133.365 63.2 129.233 59.0681C125.101 54.9361 119.002 55.5441 114.87 59.6761L94.301 80.2452L73.7319 59.6761C69.6 55.5441 63.501 54.9361 59.3691 59.0681C55.2371 63.2 55.8452 69.2989 59.9771 73.4309L80.5462 94L59.9771 114.569C55.8451 118.701 55.2371 124.8 59.369 128.932C63.501 133.064 69.5999 132.456 73.7318 128.324L94.301 107.755Z"
              fill="#FAFAFA"
            />
          </svg>
        </Tooltip>
      );

    default:
      return (
        <Tooltip title={t("OBSERVATION.UPLOAD_STATUS.PENDING")} hasArrow={true}>
          <svg
            className="icon"
            width="24"
            height="24"
            viewBox="0 0 189 188"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M179.128 94C179.128 140.853 141.146 178.835 94.293 178.835C47.4399 178.835 9.45797 140.853 9.45797 94C9.45797 47.1469 47.4399 9.165 94.293 9.165C141.146 9.165 179.128 47.1469 179.128 94Z"
              fill="#FFC004"
              stroke="white"
              strokeWidth="18.33"
            />
            <path
              d="M135.905 109.803H88.2856C82.9393 109.803 78.6003 105.464 78.6003 100.117V52.4982C78.6003 47.1519 82.9393 42.8129 88.2856 42.8129C93.6319 42.8129 97.9709 47.1519 97.9709 52.4982V90.4322H135.905C141.251 90.4322 145.59 94.7712 145.59 100.117C145.59 105.464 141.251 109.803 135.905 109.803Z"
              fill="#FAFAFA"
            />
          </svg>
        </Tooltip>
      );
  }
}
