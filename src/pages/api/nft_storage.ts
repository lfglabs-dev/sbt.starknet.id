// Import the NFTStorage class and File constructor from the 'nft.storage' package
import { NFTStorage, File } from "nft.storage";

// The 'fs' builtin module on Node.js provides access to the file system
import fs from "fs";

// The 'path' module provides helpers for manipulating filesystem paths
import path from "path";

import formidable from "formidable";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * Reads an image file from `imagePath` and stores an NFT with the given name and description.
 * @param {string} imagePath the path to an image file
 * @param {string} name a name for the NFT
 * @param {string} description a text description for the NFT
 */
async function storeNFT(imagePath: string, name: string, description: string) {
  // load the file from disk
  const image = await fileFromPath(imagePath);

  // create a new NFTStorage client using our API key
  const nftstorage = new NFTStorage({ token: process.env.NFT_STORAGE_API_KEY as string });

  // call client.store, passing in the image & metadata
  return nftstorage.store({
    image,
    name,
    description,
  });
}

/**
 * A helper to read a file from a location on disk and return a File object.
 * Note that this reads the entire file into memory and should not be used for
 * very large files.
 * @param {string} filePath the path to a file to store
 * @returns {File} a File object containing the file content
 */
async function fileFromPath(filePath: string) {
  const content = await fs.promises.readFile(filePath);
  const type = "image/*";
  return new File([content], path.basename(filePath), { type });
}

/**
 * The main entry point for the script that checks the command line arguments and
 * calls storeNFT.
 *
 * To simplify the example, we don't do any fancy command line parsing. Just three
 * positional arguments for imagePath, name, and description
 */

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function uploadToIpfs(req: NextApiRequest, res: NextApiResponse<{ message: string, ipnft?: string, url?: string }>) {
  const form = formidable({ multiples: true });

  form.parse(req, async (err, fields, files) => {
    let filesArr = Object.entries(files);
    if (filesArr.length == 0) {
      res.status(400).send({ message: "Please send a file" });
      return;
    } else if (filesArr.length > 1) {
      res.status(400).send({ message: "Only one file upload is allowed" });
      return;
    }
    let file = (filesArr[0][1] as formidable.File);
    let result = await storeNFT(file.filepath, fields.name as string, fields.desc as string);
    res.status(200).send({ message: "Success", ipnft: result.ipnft, url: `https://ipfs.io/ipfs/${result.ipnft}/metadata.json` });
  });
}
