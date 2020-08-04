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
    const {strict_mode} = payload;
    const pull_number = number;

    if (!pull_number) {
      throw 'This action was initiated by something other than a pull_request'
    }

    console.log(`Getting commits for pull_number: ${pull_number}`);
    console.log(`Searching for: ${changelogLocation}`);

    const files = await octokit.pulls.listFiles({owner, repo, pull_number});
    const changelog_data= files.data.filter(function(file_data) {
      return file_data.filename == changelogLocation;
    })
    if (changelog_data.length == 0) {
      throw "Changelog needs to be updated with each PR"
    }

    // We either check for some additions (default behaviour) or in strict mode we need additions to outnumber deletions
    const net_new_additions = changelog_data[0].additions - changelog_data[0].deletions
    let new_additions = 0
    if (strict_mode == undefined) {
      new_additions = changelog_data[0].additions
    } else {
      new_additions = net_new_additions
    }
    if (new_additions <= 0) {
      throw "Changelog update needs to include additional information"
    }
    core.setOutput("changelog_updates", changelog_data[0].patch);
    // const payload_string = JSON.stringify(github.context.payload, undefined, 2)
    // const files_string = JSON.stringify(files, undefined, 2)
    // console.log(`The event payload: ${payload_string}`);
    // console.log(`The PR files information: ${files_string}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

main();