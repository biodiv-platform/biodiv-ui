import { bmvbhash } from "blockhash-core";

const hexToBin = (hexString) => {
  const hexBinLookup = {
    0: "0000",
    1: "0001",
    2: "0010",
    3: "0011",
    4: "0100",
    5: "0101",
    6: "0110",
    7: "0111",
    8: "1000",
    9: "1001",
    a: "1010",
    b: "1011",
    c: "1100",
    d: "1101",
    e: "1110",
    f: "1111",
    A: "1010",
    B: "1011",
    C: "1100",
    D: "1101",
    E: "1110",
    F: "1111"
  };
  let result = "";
  for (let i = 0; i < hexString.length; i++) {
    result += hexBinLookup[hexString[i]];
  }
  return result;
};

export const comparePerceptualHash = (hash1, hash2) => {
  const _hash1 = hexToBin(hash1);
  const _hash2 = hexToBin(hash2);
  const minLength = Math.min(_hash1.length, _hash2.length);
  const maxLength = Math.max(_hash1.length, _hash2.length);
  let similarity = 0;
  for (let i = 0; i < minLength; i++) {
    if (_hash1[i] === _hash2[i]) {
      similarity += 1;
    }
  }
  return similarity / maxLength;
};

export const getBlockHash = async (file) => {
  const bitmap = await createImageBitmap(file);
  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
  const context: any = canvas.getContext("2d");
  context.drawImage(bitmap, 0, 0);
  const imageData = context.getImageData(0, 0, bitmap.width, bitmap.height);

  return bmvbhash(imageData, 8);
};
