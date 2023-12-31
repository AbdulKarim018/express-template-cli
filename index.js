#! /usr/bin/env node

const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const { exec } = require('child_process');

const templatesDir = path.join(__dirname, 'templates');
const currentDir = process.cwd();
const templates = fs.readdirSync(templatesDir);

if (templates.length <= 0) {
  console.log('No templates found');
  process.exit(1);
}

const templateChoices = templates.map((template) => ({
  name: template,
  value: template,
}));

const questions = [
  {
    type: 'input',
    name: 'name',
    message: 'Project name:',
  },
  {
    type: 'list',
    name: 'template',
    message: 'What project template would you like to generate?',
    choices: templateChoices,
  },
  {
    type: 'confirm',
    name: 'install',
    message: 'Install dependencies?',
    default: false,
  },
];

inquirer.prompt(questions).then((answers) => {
  const templateDir = path.join(templatesDir, answers.template);
  const targetDir = path.join(currentDir, answers.name);

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir);
  }

  createDirectoryContents(templateDir, answers.name);
  answers.install ? installDependencies(answers.name) : null;
  console.log('Project Ready!');
});

function createDirectoryContents(templateDir, projectName) {
  const filesToCreate = fs.readdirSync(templateDir);

  filesToCreate.forEach((file) => {
    const origFilePath = path.join(templateDir, file);

    const stats = fs.statSync(origFilePath);

    if (stats.isFile()) {
      const contents = fs.readFileSync(origFilePath, 'utf8');

      const writePath = path.join(currentDir, projectName, file);
      fs.writeFileSync(writePath, contents, 'utf8');
    } else if (stats.isDirectory()) {
      fs.mkdirSync(path.join(currentDir, projectName, file));

      createDirectoryContents(
        path.join(templateDir, file),
        path.join(projectName, file)
      );
    }
  });
}

const installDependencies = (projectName) => {
  console.log('Installing dependencies...');
  exec(`cd ${currentDir}/${projectName} && npm install`, (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(stdout);
  });
};