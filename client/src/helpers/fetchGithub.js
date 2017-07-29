export default async () => {
    try{
        const response = await fetch('https://api.github.com/repos/GlebDolzhikov/allEvents/contributors');
        const parsedResponse = await response.json()
        return parsedResponse.filter((user)=>
            checkExcludedUsers(user.login)
        )
    }
    catch(e){
        return Promise.reject(e);
    }
}

function checkExcludedUsers(user){
    const contributorsOfReactApp = ['r0mdau', 'jmartin4563', 'zeke','jonmountjoy','hunterloftis', 'raul', 'samccone', 'jmorrell','scantini', 'scantini', 'theneva','friism', 'friism'];
    return contributorsOfReactApp.indexOf(user) === -1;
}