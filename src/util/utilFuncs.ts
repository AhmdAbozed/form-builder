export const getSubreddit = async (id: number) => {

    const options = {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const resp = await fetch(protocol+"://" + window.location.hostname + ":" + 3003 + "/subreddits/" + id, options);
    const data = await resp.json()
    return data
}

export const verifyMember = async (id: number, user_id: number) => {

    const options = {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const resp = await fetch(protocol+"://" + window.location.hostname + ":" + 3003 + "/members?subreddit_id=" + id + "&member_id=" + user_id, options);
    if (resp.status == 200) {
        return true
    }
    else {
        console.log("Not a member")
        return false
    }
}
export const join = async (subId: number, user_id: number) => {

    const options = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const resp = await fetch(protocol+"://" + window.location.hostname + ":" + 3003 + "/members?subreddit_id=" + subId + "&member_id=" + user_id, options);
    const data = await resp.json()
    if (resp.status == 200) {
        console.log("member added, 200")
        window.location.reload()
    }
    //const resp = await fetch(protocol+"://" + window.location.hostname + ":" + 3003 + "/members?"+ new URLSearchParams({member_id: }), options);
    //const data = await resp.json()
}

export const submitComment = async (event: React.FormEvent<HTMLFormElement>, parent_id: number | null, id: number, post_id: number) => {
    event.preventDefault();
    const target = event.target as any
    console.log("submitting comment... " + target.elements.comment.value)
    if (target.elements.comment.value == "") {
        return false
    }
    //const submission = { Title: target.elements.title.value, Text: target.elements.desc.value, }
    const submission = { Text: target.elements.comment.value, parent_id: parent_id }

    console.log("parent_id is " + JSON.stringify(submission))

    const options = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: "include",
        body: JSON.stringify(submission)
    }
    //@ts-ignore
    const resp = await fetch(protocol+"://" + window.location.hostname + ":3003/subreddits/" + id + "/posts/" + post_id, options);
    if (resp.status == 200) {
        console.log("Created post successfully. 200")
        return true;
    }
    else if (resp.status == 404 || resp.status == 401) {
        console.log("failed to post comment", + resp.status)
        return false;
        //document.getElementById("result")!.innerHTML = "ERROR" + resp.status
    }

}

function getProtocol(){
    if(process.env.NODE_ENV == "production"){
        return "https"
    }
    else return "http"
}

export const protocol = getProtocol();