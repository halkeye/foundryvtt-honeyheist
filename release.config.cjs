const yaml = require('js-yaml');
const Handlebars = require('handlebars')

Handlebars.registerHelper("yamlString", function (options) {
  const input = options.fn(this).trim()
  return yaml.dump(input.replace(/^\s*\*\s*/g, '').trim(), {lineWith: 999, forceQuotes: true, quotingType: '"'});
});

/*
const chartPath = process.env.CHART_PATH;
if (!chartPath) {
  throw new Error('No chart path defined')
}
*/

module.exports = {
  "branches": [
    "master",
  ],
  "plugins": [
    [
      "@semantic-release/commit-analyzer",
      {
        "preset": "angular",
        "releaseRules": [
          {breaking: true, release: "major"},
          {revert: true, release: "patch"},
          {type: "chore", release: false},
          {type: "ci", release: false},
          {type: "fix", release: "patch"},
          {release: "minor"}
        ]
      }
    ],
    [
      "@semantic-release/release-notes-generator",
      {
        "preset": "angular",
        "parserOpts": {
          "noteKeywords": ["BREAKING CHANGE", "BREAKING CHANGES", "BREAKING"]
        }
      }
    ],
    [
      "@semantic-release/changelog",
      {
        "changelogFile": "release-notes.txt"
      }
    ],
    [
      "semantic-release-replace-plugin",
      {
        "replacements": [
          {
            "files": ["system.json"],
            "from": "\"version\": .*,",
            "to": "\"version\": \"${nextRelease.version}\",",
            "results": [
              {
                "file": "system.json",
                "hasChanged": true,
                "numMatches": 1,
                "numReplacements": 1
              }
            ],
            "countMatches": true
          },
          {
            "files": ["system.json"],
            "from": "\"download\": .*,",
            "to": "\"download\": \"https://github.com/halkeye/foundryvtt-honeyheist/releases/download/v${nextRelease.version}/honey-heist.zip\",",
            "results": [
              {
                "file": "system.json",
                "hasChanged": true,
                "numMatches": 1,
                "numReplacements": 1
              }
            ],
            "countMatches": true
          }
        ]
      }
    ],
    [
      "@semantic-release/exec",
      {
        "prepareCmd": "zip -r ./honey-heist.zip LICENSE.txt README.md credits.md lang module package.json release-notes.txt resources styles system.json template.json templates"
      }
    ],
    [
      "@semantic-release/git",
      {
        "assets": [
          "package.json",
          "package-lock.json",
          "system.json",
        ],
        "message": "chore(release): ${nextRelease.version} [skip release] [skip ci]\n\n${nextRelease.notes}"
      }
    ],
    [
      "@semantic-release/github",
      {
        "assets": [
          {"path": "system.json"},
          {"path": "honey-heist.zip"},
        ]
      }
    ]
  ]
}

