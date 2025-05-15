# Description

There is a bug in the `nx release` (changelog) command.
The file `nx/src/command-line/release/changelog.js` generates changelogs sequentially, flushing changes after each iteration.
If a later changelog (for a different library) contains the same content as a previously generated one,
the virtual `FsTree` implementation mistakenly removes it, assuming the file was reverted to its original state.
As a result, only one changelog ends up being staged and committed.

# Steps to reproduce

## Using FsTree
`tsx ./packages/lib-a/src/index.ts`

## Using releaseChangelog

`nx release --projects="lib-a,lib-b" 1.0.0 --skipPublish`

Note:
If you remove the dependency on lib-b from ./packages/lib-a/package.json, the changelog is staged correctly.