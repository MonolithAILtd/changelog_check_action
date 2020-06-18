const core = require('@actions/core');
const github = require('@actions/github');
const {Octokit} = require("@octokit/action");

async function main() {
  try {
    // `changelog_file input defined in action metadata file
    const changelogLocation = core.getInput('changelog_file');
    const octokit = new Octokit();
    const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");

    console.log(`changlelog file location ${changelogLocation}`);
    // Get the JSON webhook payload for the event that triggered the workflow

    const payload = github.context.payload
    const {number} = payload;
    const pull_number = number;

    if (!pull_number) {
      console.log('This action was initiated by something other than a pull_request');
      process.exit(0);
    }

    console.log(`Getting commits for pull_number: ${pull_number}`);
    console.log(`Searching for: ${changelogLocation}`);

    const files = await octokit.pulls.listFiles({owner, repo, pull_number});
    const payload_string = JSON.stringify(github.context.payload, undefined, 2)
    const files_string = JSON.stringify(files, undefined, 2)
    console.log(`The event payload: ${payload_string}`);
    console.log(`The PR files information: ${files_string}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

main();