import { workspaceRoot } from "@nx/devkit";
import assert from "node:assert";
import { FsTree } from "nx/src/generators/tree.js";
import { printAndFlushChanges } from "nx/src/command-line/release/utils/print-changes.js";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

try {
    const tree = new FsTree(workspaceRoot, true);
    tree.write("packages/lib-a/src/example.txt", "hi");
    assert.equal(tree.listChanges().length, 1);

    // Flush the changes. Content gets written to disk.
    printAndFlushChanges(tree, false, 3);

    // write the same content again
    tree.write("packages/lib-a/src/example.txt", "hi");
    // The change is not recognized because the content is the same.
    assert.equal(tree.listChanges().length, 0);

    // Problem: the changelog does not stage the file (CHANGELOG.txt) because the tree is not dirty anymore.
} finally {
    // Restore the example.txt file to get the script running again.
    fs.writeFileSync(path.join(dirname, "example.txt"), "hello world");
}
