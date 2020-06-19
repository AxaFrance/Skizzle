# How to Contribute

## Reporting Issues

Should you run into issues with the project, please don't hesitate to let us know by
[filing an issue](https://github.com/axa-group/skizzle/issues/new).

Pull requests containing only failing tests demonstrating the issue are welcomed
and this also helps ensure that your issue won't regress in the future once it's fixed.

## Pull Requests

We accept [pull requests](https://github.com/axa-group/skizzle/pull/new/master)!

Generally we like to see pull requests that

- Maintain the existing code style
- Are focused on a single change (i.e. avoid large refactoring or style adjustments in untouched code if not the primary goal of the pull request)
- Have [good commit messages](https://chris.beams.io/posts/git-commit/)
- Have tests
- Don't decrease the current code coverages

## Commit messages

By default semantic-release uses [Angular Commit Message Conventions](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines).

Here is an example of the release type that will be done based on a commit messages:

| Commit message                                                                                                                                                                                   | Release type  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------- |
| `fix(pencil): stop graphite breaking when too much pressure applied`                                                                                                                             | Patch Release |
| `feat(pencil): add 'graphiteWidth' option`                                                                                                                                                       | Minor Release |
| `perf(pencil): remove graphiteWidth option`<br><br>`BREAKING CHANGE: The graphiteWidth option has been removed.`<br>`The default graphite width of 10mm is always used for performance reasons.` | Major Release |
