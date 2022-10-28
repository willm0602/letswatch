import { createContext, Fragment } from "react";

const UserContext = createContext(undefined);

const UserContextProvider = ({children}) => {

    const fakeDBInfo = {
        id:101,
        username:'tree',
        profileID:5,
        bio:'Very cool',
        accessToken:'This is an access token',
        dateJoined:'2022-10-27 17:54:04',
        groups:[
            {
                groupName:'Bad Movie Club',
                groupID:101,
                members:['tree', 'definetlyDaniel', 'milliam'],
                lists:[
                    {
                        listName:'Bad Horror',
                        listID:101,
                        listMembers:['tree', 'definetlyDaniel', 'milliam'],
                        media:[
                            {
                                title:'Old',
                                poster:'https://www.themoviedb.org/t/p/original/vclShucpUmPhdAOmKgf3B3Z4POD.jpg',
                                synopsis:'A group of families on a tropical holiday discover that the secluded beach where they are staying is somehow causing them to age rapidly – reducing their entire lives into a single day.',
                                score:65,
                                addedBy:'tree'
                            },
                            {
                                title:'Slender Man',
                                poster:'https://www.themoviedb.org/t/p/original/huSncs4RyvQDBmHjBBYHSBYJbSJ.jpg',
                                synopsis:'In a small town in Massachusetts, four high school girls perform a ritual in an attempt to debunk the lore of Slender Man. When one of the girls goes mysteriously missing, they begin to suspect that she is, in fact, his latest victim.',
                                score:44,
                                addedBy:'milliam'
                            },
                            {
                                title:'The Wicker Man',
                                poster:'https://www.themoviedb.org/t/p/original/9G6TBckQUKdx3dnn55abUCmonRX.jpg',
                                synopsis:`A sheriff investigating the disappearance of a young girl from a small island discovers there's a larger mystery to solve among the island's secretive, neo-pagan community.`,
                                score:43,
                                addedBy:'tree'
                            }
                        ]
                    }
                ]
            }
        ]
    };

    return(
        <Fragment>
            <UserContext.Provider value={{fakeDBInfo}}>
                {children}
            </UserContext.Provider>
        </Fragment>
    );
}

export {UserContextProvider, UserContext}