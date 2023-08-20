import { friends } from "../friend-collections.js";
import { select } from "@inquirer/prompts";
import { input } from "@inquirer/prompts";

export async function getValidUserName() {
  return [
    // Get user name
    await select({
      message: "Who are you?",
      choices: friends
    }), 

    // Get start date
    await input({
      message: "Input a start date for the challenge (format YYYY/MM/DD):",
      type: "input",
      validate: (input) => {
        var date = Date.parse(input);
        var todaysDate = new Date();
        todaysDate.setHours(0, 0, 0, 0);
        if(date >= todaysDate && date != isNaN) 
          return true;
        else
          return "Please provide a valid date";
      }
    }),

    // Get priority letter
    await input({
      message: "Priortise dog breeds starting with input letter:",
      type: "input",
      validate: (input) => {
        if(input.match(/^[a-z]$/i)) 
          return true;
        else
          return "Please provide a single letter";
      }
    })
  ];
}