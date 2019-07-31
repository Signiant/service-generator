const request = require('request-promise');
const error = require('./error');
const headers = require('./headers');

const requirePassingBuildsToMergeOptions = (requestHeaders) => ({
    json: true,
    headers: requestHeaders,
    body: {
        "pattern": "master",
        "kind": "require_passing_builds_to_merge",
        "type": "branchrestriction",
        "value": 1,
        "users": [],
        "groups": []
    }
});

const requireApprovalsToMergeOptions = (requestHeaders) => ({
    json: true,
    headers: requestHeaders,
    body: {
        "pattern": "master",
        "kind": "require_approvals_to_merge",
        "type": "branchrestriction",
        "value": 1,
        "users": [],
        "groups": []
    }
});

const requireTasksToBeCompletedOptions = (requestHeaders) => ({
    json: true,
    headers: requestHeaders,
    body: {
        "pattern": "master",
        "kind": "require_tasks_to_be_completed",
        "type": "branchrestriction",
        "users": [],
        "groups": []
    }
});

const dontAllowHistoryRewriteOptions = (requestHeaders) => ({
    json: true,
    headers: requestHeaders,
    body: {
        "pattern": "master",
        "kind": "force",
        "type": "branchrestriction"
    }
});

const dontAllowDeleteBranchOptions = (requestHeaders) => ({
    json: true,
    headers: requestHeaders,
    body: {
        "pattern": "master",
        "kind": "delete",
        "type": "branchrestriction"
    }
});

const setBranchPermission = async (branchPermissionsUrl, options) => {

    try {
        await request.post(branchPermissionsUrl, options);
        console.log(`Successfully set ${options.body.type} on ${options.body.pattern} branch of kind: ${options.body.kind}`);
    } catch (err) {
        // console.error("Error setting Branch permissions", err);
        return new error('Branch Permissions', err.message);
    }
};

const setBranchPermissions = async (restUrl, token) => {

    const branchPermissionsUrl = `${restUrl}/branch-restrictions`;

    console.log("setting branch permissions for master branch");

    const requestHeaders = headers(token);

    const branchPermissionOptions = [
        requirePassingBuildsToMergeOptions(requestHeaders),
        requireApprovalsToMergeOptions(requestHeaders),
        requireTasksToBeCompletedOptions(requestHeaders),
        dontAllowHistoryRewriteOptions(requestHeaders),
        dontAllowDeleteBranchOptions(requestHeaders)
    ];

    for (let option of branchPermissionOptions) {
        setBranchPermission(branchPermissionsUrl, option);
    }
};

module.exports = setBranchPermissions;
