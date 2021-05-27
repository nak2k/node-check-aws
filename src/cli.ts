import { checkAws } from '.';
import { red } from "chalk";

checkAws().catch(err => {
  console.error(`[${red("ERROR")}] ${err.message}`);
});
