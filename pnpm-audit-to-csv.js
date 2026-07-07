#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");

const AUDIT_CMD = "pnpm audit --json";
const outputPath = process.argv[2] || "pnpm-audit-report.csv";

function runAudit() {
    try {
        return execSync(AUDIT_CMD, {
            maxBuffer: 1024 * 1024 * 50,
            encoding: "utf8",
        });
    } catch (err) {
        if (err.stdout) return err.stdout.toString();
        throw err;
    }
}

function escapeCsv(value) {
    if (value === undefined || value === null) return "";

    const str = String(value);

    if (/[",\n]/.test(str)) {
        return `"${str.replace(/"/g, '""')}"`;
    }

    return str;
}

function main() {
    const raw = runAudit();

    let audit;
    try {
        audit = JSON.parse(raw);
    } catch (err) {
        console.error("Failed to parse pnpm audit JSON");
        process.exit(1);
    }

    const advisories = audit.advisories || {};

    const rows = [];

    for (const advisory of Object.values(advisories)) {
        const dependencyPath = (advisory.findings || [])
            .flatMap((finding) => finding.paths || [])
            .join(" | ");

        rows.push({
            package: advisory.module_name,
            severity: advisory.severity,
            title: advisory.title,
            vulnerable_versions: advisory.vulnerable_versions,
            patched_versions: advisory.patched_versions,
            recommendation: `Upgrade to ${advisory.patched_versions}`,
            dependency_path: dependencyPath,
            url: advisory.url,
        });
    }

    const header = [
        "Package",
        "Severity",
        "Title",
        "Vulnerable Versions",
        "Patched Versions",
        "Recommendation",
        "Dependency Path",
        "URL",
    ];

    const csvLines = [header.join(",")];

    for (const row of rows) {
        csvLines.push(
            [
                row.package,
                row.severity,
                row.title,
                row.vulnerable_versions,
                row.patched_versions,
                row.recommendation,
                row.dependency_path,
                row.url,
            ]
                .map(escapeCsv)
                .join(",")
        );
    }

    fs.writeFileSync(outputPath, csvLines.join("\n"), "utf8");

    console.log(
        `Wrote ${rows.length} vulnerabilities to ${outputPath}`
    );
}

main();