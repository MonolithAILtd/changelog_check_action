const core = require('@actions/core');
const github = require('@actions/github');

try {
  // `changelog_file input defined in action metadata file
  const changelogLocation = core.getInput('changelog_file');
  console.log(`changlelog file location ${changelogLocation}!`);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}