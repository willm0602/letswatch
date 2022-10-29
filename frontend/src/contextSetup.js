import { createContext, Fragment } from "react";

const UserContext = createContext(undefined);

const UserContextProvider = ({children}) => {

    const fakeMediaSearch = [
            {
                title:'Everything Everywhere All at Once',
                poster:'https://www.themoviedb.org/t/p/original/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg',
                synopsis:"An aging Chinese immigrant is swept up in an insane adventure, where she alone can save what's important to her by connecting with the lives she could have led in other universes.",
                score:81,
            },
            {
                title:"Don't Worry Darling",
                poster:'https://www.themoviedb.org/t/p/original/jOqxKIOC92BVyinYO1Fm73XY7Tc.jpg',
                synopsis:"Alice and Jack are lucky to be living in the idealized community of Victory, the experimental company town housing the men who work for the top-secret Victory Project and their families. But when cracks in their idyllic life begin to appear, exposing flashes of something much more sinister lurking beneath the attractive façade, Alice can’t help questioning exactly what they’re doing in Victory, and why.",
                score:69, //nice
            },
            {
                title:"Stranger Things",
                poster:'https://www.themoviedb.org/t/p/original/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
                synopsis:" When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl.",
                score:86,
            },
            {
                title:"Doctor Who",
                poster:'https://www.themoviedb.org/t/p/original/sz4zF5z9zyFh8Z6g5IQPNq91cI7.jpg',
                synopsis:"The Doctor is a Time Lord: a 900 year old alien with 2 hearts, part of a gifted civilization who mastered time travel. The Doctor saves planets for a living—more of a hobby actually, and the Doctor's very, very good at it.",
                score:74,
            },
            {
                title:"Bob's Burgers",
                poster:'https://www.themoviedb.org/t/p/original/4Mey4NYqXH0LlDO06ebevkDleTo.jpg',
                synopsis:`Bob's Burgers follows a third-generation restaurateur, Bob, as he runs Bob's Burgers with the help of his wife and their three kids. Bob and his quirky family have big ideas about burgers, but fall short on service and sophistication. Despite the greasy counters, lousy location and a dearth of customers, Bob and his family are determined to make Bob's Burgers "grand re-re-re-opening" a success.`,
                score:79,
            },
            {
                title:"Barbarian",
                poster:'https://www.themoviedb.org/t/p/original/idT5mnqPcJgSkvpDX7pJffBzdVH.jpg',
                synopsis:`In town for a job interview, a young woman arrives at her Airbnb late at night only to find that it has been mistakenly double-booked and a strange man is already staying there. Against her better judgement, she decides to stay the night anyway, but soon discovers that there is much more to be afraid of in the house than the other guest.`,
                score:72,
            },
            {
                title:"Pearl",
                poster:'https://www.themoviedb.org/t/p/original/ulBLIBqvdnf4H6JBt0OpMCU1ECn.jpg',
                synopsis:`Trapped on her family’s isolated farm, Pearl must tend to her ailing father under the bitter and overbearing watch of her devout mother. Lusting for a glamorous life like she’s seen in the movies, Pearl’s ambitions, temptations and repressions collide.`,
                score:70,
            },
    ];

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
                members:[{username:'tree', profileID:0}, {username:'definetlyDaniel', profileID:1}, {username:'milliam', profileID:null}],
                lists:[
                    {
                        listName:'Bad Horror',
                        listID:101,
                        listMembers:[{username:'tree', profileID:0}, {username:'definetlyDaniel', profileID:1}, {username:'milliam', profileID:null}],
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
            <UserContext.Provider value={{fakeDBInfo, fakeMediaSearch}}>
                {children}
            </UserContext.Provider>
        </Fragment>
    );
}

export {UserContextProvider, UserContext}