const request = require('request-promise');
const error = require('./error')
const headers = require('./headers');

const getGroups = (restUrl, token) => {

    const getMembersOptions = {
        json: true,
        headers: headers(token)
    };

    // Get Groups (and members)
    return request.get(restUrl, getMembersOptions);
};

const addDefaultReviewers = async (host, restUrl, token, team, group) => {

    // Get all groups (and their members)
    const groupRestURL = host + `1.0/groups/${team}`;
    getGroupsResponse = await getGroups(groupRestURL, token);
    // console.log ('get groups response: ', getGroupsResponse);
    // get the member list for the group in question
    const membersList = getGroupsResponse.find(obj => obj.name === group).members;
    // console.log(`Members of Group ${group}:`, membersList);
    const reviewers = membersList.map(member => member.username);
    // console.log('Reviewers:', reviewers);

    const addDefaultReviewerOptions = {
        json: true,
        headers: headers(token)
    };

    console.log("adding default reviewers");

    try{
        for (let reviewer of reviewers) {
            const addReviewerUrl = `${restUrl}/default-reviewers/${reviewer}`;
            // console.log(`   Add review URL ${addReviewerUrl}`);
            await request.put(addReviewerUrl, addDefaultReviewerOptions);
            console.log('Successfully added default reviewer: ', reviewer);
        }
    } catch (err) {
        // console.log("Error adding default reviewers");
        return new error('Default Reviewers', err.message);
    }
};

module.exports = addDefaultReviewers;