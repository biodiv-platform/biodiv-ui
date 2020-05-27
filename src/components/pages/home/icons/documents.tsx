import React from "react";

function DocumentsIcon({ s = 140 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={s} height={s} viewBox="0 0 140 140" fill="none">
      <rect width="140" height="140" fill="#F9EEFC" rx="18"></rect>
      <path
        fill="#AB73E1"
        fillRule="evenodd"
        d="M41 46v42.523h22.521c2.503 0 4.588 2.085 4.588 4.586h4.588c0-2.501 1.668-4.586 4.17-4.586H99.39V46H76.867c-2.502 0-5.004.834-6.673 2.918C68.526 46.834 66.441 46 63.521 46H41zm4.588 4.169H63.52c2.503 0 4.588 2.084 4.588 4.586h4.588c0-2.502 1.668-4.586 4.17-4.586h17.934v33.768H76.867c-2.502 0-5.004 1.251-6.673 2.919-1.668-1.668-3.753-2.919-6.673-2.919H45.588V50.17zm22.521 9.172v4.585h4.588v-4.585h-4.588zm0 8.754v4.586h4.588v-4.586h-4.588zm0 9.172v4.586h4.588v-4.586h-4.588z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
}

export default DocumentsIcon;
