#! /usr/bin/env node

const fs = require("fs");
const xml2js = require("xml2js");

const solrXmlPath = process.argv[2];
const jsonlOutputPath = process.argv[3];

if (!solrXmlPath || !jsonlOutputPath) {
  console.log(
    `Usage: npx solr-xml-to-jsonl <path_to_solr_xml> <path_to_output_jsonl>`,
  );
  process.exit(1);
}

const parser = new xml2js.Parser();

async function parseXml(xmlData) {
  return new Promise((resolve, reject) => {
    parser.parseString(xmlData, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

function convertToNativeValue(value) {
  if (value === "null") {
    return null;
  }

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  const numValue = Number(value);
  if (!isNaN(numValue)) {
    return numValue;
  }

  return value;
}

async function writeJsonl(jsonData) {
  const jsonArray = jsonData.add.docs[0].doc.map((doc) => {
    const transformedEntries = doc.field.map((f) => [
      f.$.name,
      convertToNativeValue(f._),
    ]);

    const transformedObjectWithArraysHandled = {};

    // If there are any repeated fields, then convert them into an array value
    for (const [key, value] of transformedEntries) {
      if (transformedObjectWithArraysHandled[key] === undefined) {
        transformedObjectWithArraysHandled[key] = value;
      } else {
        if (Array.isArray(transformedObjectWithArraysHandled[key])) {
          transformedObjectWithArraysHandled[key].push(value);
        } else {
          transformedObjectWithArraysHandled[key] = [
            transformedObjectWithArraysHandled[key],
            value,
          ];
        }
      }
    }
    return transformedObjectWithArraysHandled;
  });
  const jsonLines = jsonArray.map(JSON.stringify).join("\n");

  fs.writeFileSync(jsonlOutputPath, jsonLines, "utf-8");
  console.log(`JSONL file written to ${jsonlOutputPath}`);
}

async function convertToJsonl() {
  const xmlData = fs.readFileSync(solrXmlPath, "utf-8");
  const jsonData = await parseXml(xmlData);
  await writeJsonl(jsonData);
  console.log("Conversion to JSONL successful.");
}

convertToJsonl();
