let name = "getProjectTree";
const iconv = require("iconv-lite");
var encoding = "cp936";
var binaryEncoding = "binary";
let line = `\n`;

const VscodeApi = require("../utils/vscode-api");
let vscodeApi = new VscodeApi(name);
const { shell } = require("../utils/node-api");
module.exports = {
  name,
  implementation: async function (url) {
    shell.cd(url._fsPath);
    let command = `tree -I "node_modules|history" -L 6`
    try {
      let cmdResult = await vscodeApi.runGlobalCommand(command)
      let handle = iconv.decode(
        Buffer.from(cmdResult, binaryEncoding),
        encoding
      );
      let arr = cmdResult
        .split(line)
        .filter((val) => val)
        .map((val) => {
          return val.replace("`--", "|--");
        });
      arr.pop();
      handle = arr.join(line);
      await vscodeApi.clipboardWriteText(handle);
    } catch (error) {
      console.log(error);
    }
  },
};
